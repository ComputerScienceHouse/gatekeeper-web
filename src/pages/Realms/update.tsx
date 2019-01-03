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