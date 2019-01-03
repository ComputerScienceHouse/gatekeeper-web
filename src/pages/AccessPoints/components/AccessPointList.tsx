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
import { Badge } from "reactstrap";
import { Link } from "react-router-dom";
import { RowRenderProps } from "react-table";
import ResourceTable from "../../../components/ResourceTable";
import { AccessPoint } from "../../../interfaces/models";

const query = gql`
  query AccessPointListQuery(
    $name_Icontains: String,
    $location_Icontains: String,
    $limit: Int,
    $offset: Int,
    $ordering: String
  ) {
    allAccessPoints(
      name_Icontains: $name_Icontains,
      location_Icontains: $location_Icontains,
    ) {
      totalCount
      results(
        limit: $limit,
        offset: $offset,
        ordering: $ordering
      ) {
        id
        name
        location
        online
      }
    }
  }
`;

const columns = [
  {
    Header: "Name",
    id: "name",
    accessor: (ap: AccessPoint) => {
      return <Link to={`/access-points/${ap.id}`}>{ap.name}</Link>;
    }
  },
  {
    Header: "Location",
    accessor: "location"
  },
  {
    Header: "Status",
    accessor: "online",
    Cell: (row: RowRenderProps) => {
      if (row.value) {
        return <Badge color="success">Online</Badge>;
      }

      return <Badge color="danger">Offline</Badge>;
    },
    id: "online",
    filterable: false
  }
];

const AccessPointList = () => (
  <ResourceTable
    query={query}
    columns={columns}
    defaultPageSize={10}
    fieldName="allAccessPoints"
  />
);

export default AccessPointList;