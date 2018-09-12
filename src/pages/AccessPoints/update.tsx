import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";
import { match } from "react-router";
import AccessPointForm from "./components/AccessPointForm";
import withErrorBoundary from "../../components/withErrorBoundary";
import { AccessPoint } from "../../interfaces/models";
import { NodeResult } from "../../interfaces/graphql";

const query = gql`
  query AccessPointQuery($id: ID!) {
    accessPoint(id: $id) {
      id
      name
      location
      online
    }
  }
`;

interface RouteParams {
  id: string;
}

interface UpdateAccessPointProps {
  match: match<RouteParams>
}

const UpdateAccessPoint = ({ match: routeMatch }: UpdateAccessPointProps) => (
  <Query
    query={query}
    variables={{ id: routeMatch.params.id }}
    skip={routeMatch.params.id === "new"}
  >
    {({ loading, error, data }: QueryResult<NodeResult<AccessPoint>>) => {
      if (error) {
        throw error; // Will be caught by error boundary
      }

      if (loading && routeMatch.params.id !== "new") {
        return <span>Loading...</span>;
      }

      return (
        <AccessPointForm accessPoint={(data || {}).accessPoint}/>
      );
    }}
  </Query>
);

export default withErrorBoundary(UpdateAccessPoint);