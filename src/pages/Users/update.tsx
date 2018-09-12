import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";
import { match } from "react-router";
import UserForm from "./components/UserForm";
import withErrorBoundary from "../../components/withErrorBoundary";
import { User } from "../../interfaces/models";
import { NodeResult } from "../../interfaces/graphql";

const query = gql`
  query UserQuery($id: ID!) {
    user(id: $id) {
      id
      username
      firstName
      lastName
      email
      isStaff
      isSuperuser
    }
  }
`;

interface RouteParams {
  id: string;
}

interface UpdateUserProps {
  match: match<RouteParams>
}

const UpdateUser = ({ match: routeMatch }: UpdateUserProps) => (
  <Query
    query={query}
    variables={{ id: routeMatch.params.id }}
    skip={routeMatch.params.id === "new"}
  >
    {({ loading, error, data }: QueryResult<NodeResult<User>>) => {
      if (error) {
        throw error; // Will be caught by error boundary
      }

      if (loading && routeMatch.params.id !== "new") {
        return <span>Loading...</span>;
      }

      return (
        <UserForm user={(data || {}).user}/>
      );
    }}
  </Query>
);

export default withErrorBoundary(UpdateUser);