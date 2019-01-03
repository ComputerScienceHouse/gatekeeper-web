import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";
import { match } from "react-router";
import RealmForm from "./components/RealmForm";
import withErrorBoundary from "../../components/withErrorBoundary";
import { Realm } from "../../interfaces/models";
import { NodeResult } from "../../interfaces/graphql";

const query = gql`
  query RealmQuery($id: ID!) {
    realm(id: $id) {
      id
      name
      slot
      readKey
      authKey
      updateKey
      publicKey
      privateKey
    }
  }
`;

interface RouteParams {
  id: string;
}

interface UpdateRealmProps {
  match: match<RouteParams>
}

const UpdateRealm = ({ match: routeMatch }: UpdateRealmProps) => (
  <Query
    query={query}
    variables={{ id: routeMatch.params.id }}
    skip={routeMatch.params.id === "new"}
  >
    {({ loading, error, data }: QueryResult<NodeResult<Realm>>) => {
      if (error) {
        throw error; // Will be caught by error boundary
      }

      if (loading && routeMatch.params.id !== "new") {
        return <span>Loading...</span>;
      }

      return (
        <RealmForm realm={(data || {}).realm}/>
      );
    }}
  </Query>
);

export default withErrorBoundary(UpdateRealm);