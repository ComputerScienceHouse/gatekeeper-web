import React, { Component } from "react";
import { IssueRequest, IssueResponse } from "../../../../interfaces/helper";
import AdminHelperAPI from "../../../../api/helper";
import HelperTask from "../../../../components/HelperTask";
import gql from "graphql-tag";
import { Mutation, MutationFn } from "react-apollo";


const addTagUIDMutation = gql`
  mutation AddTagUID($input: TagUpdateGenericType!) {
    mutated: tagUpdate(newTag: $input) {
      ok
    }
  }
`;

interface TagIssueProps {
  tagId: string;
  issueRequest: IssueRequest;
  onSuccess?: () => void;
  onFailure?: () => void;
}

class TagIssue extends Component<TagIssueProps> {
  public render() {
    const { issueRequest, onFailure } = this.props;

    return (
      <Mutation mutation={addTagUIDMutation}>
        {(addTagUID) => {
          const onSuccess = (res?: object) => this.updateTagMeta(addTagUID, res);

          return (
            <HelperTask
              message="Writing tag..."
              onSuccess={onSuccess}
              onFailure={onFailure}
            >
              {async () => await AdminHelperAPI.issue(issueRequest)}
            </HelperTask>
          )
        }}
      </Mutation>
    );
  }

  private updateTagMeta = async (addTagUID: MutationFn, res?: object) => {
    if (res != null) {
      const { tagId, onSuccess } = this.props;

      const input = {
        id: tagId,
        ...res as IssueResponse
      };
      await addTagUID({ variables: { input } });

      if (onSuccess) {
        onSuccess();
      }
    }
  };
}

export default TagIssue;