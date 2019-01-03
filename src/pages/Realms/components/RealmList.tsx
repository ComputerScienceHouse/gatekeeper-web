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
import React from "react";
import { Link } from "react-router-dom";
import ResourceTable from "../../../components/ResourceTable";
import { Realm } from "../../../interfaces/models";

const query = gql`
  query RealmListQuery(
  $name_Icontains: String,
  $limit: Int,
  $offset: Int,
  $ordering: String
  ) {
    allRealms(
      name_Icontains: $name_Icontains
    ) {
      totalCount
      results(
        limit: $limit,
        offset: $offset,
        ordering: $ordering
      ) {
        id
        name
        slot
      }
    }
  }
`;

const columns = [
  {
    Header: "Name",
    id: "name",
    accessor: (realm: Realm) => {
      return <Link to={`/realms/${realm.id}`}>{realm.name}</Link>;
    }
  },
  {
    Header: "Slot",
    accessor: "slot",
    filterable: false
  }
];

const RealmList = () => (
  <ResourceTable
    query={query}
    columns={columns}
    defaultPageSize={10}
    fieldName="allRealms"
  />
);

export default RealmList;