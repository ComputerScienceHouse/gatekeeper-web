/*
 * Gatekeeper - Open source access control
 * Copyright (C) 2018-2019 Steven Mirabito
 *
 * This file is part of Gatekeeper.
 *
 * Gatekeeper is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Gatekeeper is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Gatekeeper.  If not, see <http://www.gnu.org/licenses/>.
 */

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