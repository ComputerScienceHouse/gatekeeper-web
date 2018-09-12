import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";
import { match } from "react-router";
import GroupForm from "./components/GroupForm";
import withErrorBoundary from "../../components/withErrorBoundary";
import { Group } from "../../interfaces/models";
import { NodeResult } from "../../interfaces/graphql";

const query = gql`
  query GroupQuery($id: ID!) {
    group(id: $id) {
      id
      name
      userSet {
        username
      }
    }
  }
`;

interface RouteParams {
  id: string;
}

interface UpdateGroupProps {
  match: match<RouteParams>
}

const UpdateGroup = ({ match: routeMatch }: UpdateGroupProps) => (
  <Query
    query={query}
    variables={{ id: routeMatch.params.id }}
    skip={routeMatch.params.id === "new"}
  >
    {({ loading, error, data }: QueryResult<NodeResult<Group>>) => {
      if (error) {
        throw error; // Will be caught by error boundary
      }

      if (loading && routeMatch.params.id !== "new") {
        return <span>Loading...</span>;
      }

      return (
        <GroupForm group={(data || {}).group}/>
      );
    }}
  </Query>
);

export default withErrorBoundary(UpdateGroup);