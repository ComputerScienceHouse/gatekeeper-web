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
import { Query, QueryResult } from "@apollo/react-components";
import { match } from "react-router";
import GroupForm from "./components/GroupForm";
import withErrorBoundary from "../../components/withErrorBoundary";
import { Group } from "../../interfaces/models";
import { NodeResult } from "../../interfaces/graphql";
import Loader from "../../components/Loader";

const query = gql`
  query GroupQuery($id: ID!) {
    group(id: $id) {
      id
      name
      user {
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
        return <Loader/>;
      }

      return (
        <GroupForm group={(data || {}).group}/>
      );
    }}
  </Query>
);

export default withErrorBoundary(UpdateGroup);