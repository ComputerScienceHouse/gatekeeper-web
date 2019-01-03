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