import React, { Component } from "react";
import { FetchResult, withApollo, WithApolloClient } from "react-apollo";
import gql from "graphql-tag";
import TagProgress from "./TagProgress";
import { NodeResult, MutationResult } from "../../../../interfaces/graphql";
import { IssueRequest } from "../../../../interfaces/helper";
import { Configuration, Tag, Realm } from "../../../../interfaces/models";
import TagRealmAssociation from "../../../../interfaces/models/TagRealmAssociation";
import AdminHelperAPI from "../../../../api/helper";
import styled from "@emotion/styled";

const configQuery = gql`
  query WriteTagConfigQuery {
    configuration {
      systemSecret
    }
  }
`;

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
      association {
        id
      }
      errors {
        field
        messages
      }
    }
  }
`;

const realmDataQuery = gql`
  query WriteTagRealmDataQuery($realmId: ID!) {
    realm(id: $realmId) {
      id
      slot
      readKey
      authKey
      updateKey
      publicKey
      privateKey
    }
  }
`;

const LogViewer = styled.div`
  height: 300px;
  overflow-y: scroll;
  font-family: monospace;
  margin-top: 1rem;
  white-space: pre-line;
`;

interface TagIssueProps {
  userId: string;
  realmIds: string[];
  onComplete?: (tagId: string) => void;
}

interface TagIssueState {
  message: string;
  showLogViewer: boolean;
  log: string;
}

class TagIssue extends Component<WithApolloClient<TagIssueProps>, TagIssueState> {
  public state = {
    message: "Creating tag...",
    showLogViewer: false,
    log: ""
  };

  public render() {
    const { message, showLogViewer, log } = this.state;

    return (
      <>
        <TagProgress message={message} indefinite={true}/>
        {showLogViewer ? <LogViewer>{log}</LogViewer> : null}
      </>
    );
  }

  public async componentDidMount() {
    const { realmIds } = this.props;
    const config = await this.getConfig();

    const tagId = await this.createTag();

    this.setState({ message: "Associating tag with realm(s)..." });
    const associationMap = await this.associateTag(tagId);

    const req: IssueRequest = {
      systemSecret: config.systemSecret,
      realms: []
    };

    for (const realmId of realmIds) {
      const realmData = await this.getRealmData(realmId);

      req.realms.push({
        ...realmData,
        associationId: associationMap[realmId]
      });
    }

    this.setState({ message: "Writing tag..." });
    const taskId = await AdminHelperAPI.issue(req);

    AdminHelperAPI.openTaskLog(taskId, {
      onopen: () => this.log("Connected to Admin Helper."),
      onmessage: (e) => this.log(e.data),
      onreconnect: () => this.log("Connection lost. Attempting to reconnect..."),
      onmaximum: () => this.log("Too many attempts."),
      onclose: () => this.log("Connection closed."),
      onerror: (e) => this.log(`Error: ${e}`)
    });

    this.setState({ showLogViewer: true });

    // if (isFunction(onComplete)) {
    //   onComplete();
    // }
  }

  private getConfig = async (): Promise<Configuration> => {
    const { client } = this.props;

    const data: FetchResult<NodeResult<Configuration>> = await client.query({
      query: configQuery
    });

    return ((data || {}).data || {}).configuration;
  };

  private createTag = async (): Promise<string> => {
    const { client, userId } = this.props;

    const data: FetchResult<NodeResult<MutationResult<Tag>>> = await client.mutate({
      mutation: tagCreateMutation,
      variables: {
        input: {
          user: userId
        }
      }
    });

    const result = ((data || {}).data || {}).tagCreate;

    if (result.ok) {
      return result.tag.id;
    } else {
      // TODO: Better error handling
      throw new Error();
    }
  };

  private associateTag = async (tagId: string): Promise<Record<string, string>> => {
    const { client, realmIds } = this.props;
    const associationMap = {};

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

      if (result.ok) {
        associationMap[realmId] = result.association.id;
      } else {
        // TODO: Better error handling
        throw new Error();
      }
    }

    return associationMap;
  };

  private getRealmData = async (realmId: string): Promise<Realm> => {
    const { client } = this.props;

    const data: FetchResult<NodeResult<Realm>> = await client.query({
      query: realmDataQuery,
      variables: {
        realmId
      }
    });

    return ((data || {}).data || {}).realm;
  };

  private log = (msg: string) => {
    this.setState((prevState) => ({
      log: prevState.log + `${msg}\n`
    }));
  };
}

export default withApollo(TagIssue);