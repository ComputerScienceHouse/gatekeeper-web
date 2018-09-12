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