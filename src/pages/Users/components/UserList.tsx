import gql from "graphql-tag";
import * as React from "react";
import { Badge } from "reactstrap";
import { Link } from "react-router-dom";
import Avatar from "../../../components/Avatar";
import ResourceTable from "../../../components/ResourceTable";
import { User } from "../../../interfaces/models";

const query = gql`
  query UserListQuery(
  $username_Icontains: String,
  $email_Icontains: String,
  $firstName_Icontains: String,
  $lastName_Icontains: String,
  $limit: Int,
  $offset: Int,
  $ordering: String
  ) {
    allUsers(
      username_Icontains: $username_Icontains,
      email_Icontains: $email_Icontains,
      firstName_Icontains: $firstName_Icontains,
      lastName_Icontains: $lastName_Icontains
    ) {
      totalCount
      results(
        limit: $limit,
        offset: $offset,
        ordering: $ordering
      ) {
        id
        username
        firstName
        lastName
        email
        isStaff
        isSuperuser
      }
    }
  }
`;

const columns = [
  {
    accessor: (user: User) => (
      <Avatar email={user.email} size={50} />
    ),
    Header: "",
    id: "avatar",
    width: 62,
    sortable: false,
    filterable: false
  },
  {
    id: "username",
    Header: "Username",
    accessor: (user: User) => (
      <Link to={`/users/${user.id}`}>{user.username}</Link>
    )
  },
  {
    Header: "First Name",
    accessor: "firstName"
  },
  {
    Header: "Last Name",
    accessor: "lastName"
  },
  {
    Header: "Email",
    accessor: "email"
  },
  {
    Header: "Role",
    accessor: (item: User) => {
      if (item.isSuperuser) {
        return <Badge color="danger">Admin</Badge>;
      }

      if (item.isStaff) {
        return <Badge color="primary">Staff</Badge>;
      }

      return null;
    },
    id: "role",
    sortable: false,
    filterable: false
  }
];

const UserList = () => (
  <ResourceTable
    query={query}
    columns={columns}
    defaultPageSize={10}
    fieldName="allUsers"
  />
);

export default UserList;