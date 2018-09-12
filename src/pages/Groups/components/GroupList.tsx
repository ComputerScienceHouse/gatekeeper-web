import gql from "graphql-tag";
import * as React from "react";
import { Link } from "react-router-dom";
import { RowRenderProps } from "react-table";
import ResourceTable from "../../../components/ResourceTable";
import { Group } from "../../../interfaces/models";

const query = gql`
  query GroupListQuery(
    $name_Icontains: String,
    $limit: Int,
    $offset: Int,
    $ordering: String
  ) {
    allGroups(
      name_Icontains: $name_Icontains,
    ) {
      totalCount
      results(
        limit: $limit,
        offset: $offset,
        ordering: $ordering
      ) {
        id
        name
        userSet {
          username
        }
      }
    }
  }
`;

const columns = [
  {
    id: "name",
    Header: "Name",
    accessor: (group: Group) => {
      return <Link to={`/groups/${group.id}`}>{group.name}</Link>;
    }
  },
  {
    Header: "Members",
    accessor: (group: Group) => {
      return group.userSet.map(user => user.username);
    },
    Cell: (row: RowRenderProps) => row.value.join(", "),
    id: "members",
    sortable: false,
    filterable: false
  }
];

const GroupList = () => (
  <ResourceTable
    query={query}
    columns={columns}
    defaultPageSize={10}
    fieldName="allGroups"
  />
);

export default GroupList;