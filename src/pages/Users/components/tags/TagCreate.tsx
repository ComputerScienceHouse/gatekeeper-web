import React, { Component } from "react";
import { FetchResult, withApollo, WithApolloClient } from "react-apollo";
import gql from "graphql-tag";
import isFunction from "lodash/isFunction";
import { NodeResult, MutationResult } from "../../../../interfaces/graphql";
import { Tag } from "../../../../interfaces/models";
import TagRealmAssociation from "../../../../interfaces/models/TagRealmAssociation";
import HelperTask from "../../../../components/HelperTask";

const tagCreateMutation = gql`
  mutation TagCreate($input: TagCreateGenericType!) {
    tagCreate(newTag: $input) {
      ok
      tag {
        id
      }
      errors {
        field
        messages
      }
    }
  }
`;

const associateTagMutation = gql`
  mutation AssociateTag($input: TagRealmAssociationCreateGenericType!) {
    associateTagWithRealm(newAssociation: $input) {
      ok
      errors {
        field
        messages
      }
    }
  }
`;

interface TagIssueProps {
  userId: string;
  realmIds: string[];
  onSuccess?: (tagId: string) => void;
  onFailure?: () => void;
}

class TagIssue extends Component<WithApolloClient<TagIssueProps>> {
  public render() {
    const { onSuccess } = this.props;

    return (
      <HelperTask message="Creating tag...">
        {async ({ updateMessage }) => {
          const tagId = await this.createTag();

          updateMessage("Associating tag with realm(s)...");
          await this.associateTag(tagId);

          if (isFunction(onSuccess)) {
            onSuccess(tagId);
          }

          return null;
        }}
      </HelperTask>
    );
  }

  private createTag = async (): Promise<number> => {
    const { client, userId, onFailure } = this.props;

    const data: FetchResult<NodeResult<MutationResult<Tag>>> = await client.mutate({
      mutation: tagCreateMutation,
      variables: {
        input: {
          user: userId
        }
      }
    });

    const result = ((data || {}).data || {}).tagCreate;

    if (!result.ok) {
      // TODO: Better error handling
      if (isFunction(onFailure)) {
        onFailure();
      }

      throw new Error();
    }

    return result.tag.id;
  };

  private associateTag = async (tagId: number): Promise<void> => {
    const { client, realmIds, onFailure } = this.props;

    for (const realmId of realmIds) {
      const data: FetchResult<NodeResult<MutationResult<TagRealmAssociation>>> = await client.mutate({
        mutation: associateTagMutation,
        variables: {
          input: {
            tag: tagId,
            realm: realmId
          }
        }
      });

      const result = ((data || {}).data || {}).associateTagWithRealm;

      if (!result.ok) {
        // TODO: Better error handling
        if (isFunction(onFailure)) {
          onFailure();
        }

        throw new Error();
      }
    }
  };
}

export default withApollo(TagIssue);