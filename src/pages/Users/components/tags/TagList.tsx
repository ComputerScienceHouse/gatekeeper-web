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
import ResourceTable from "../../../../components/ResourceTable";
import { Variables } from "../../../../interfaces/graphql";

const query = gql`
  query TagListQuery(
  $userId: ID!,
  $limit: Int,
  $offset: Int,
  $ordering: String
  ) {
    allTags(
      user: $userId
    ) {
      totalCount
      results(
        limit: $limit,
        offset: $offset,
        ordering: $ordering
      ) {
        id
      }
    }
  }
`;

const columns = [
  {
    Header: "Tag ID",
    accessor: "id"
  }
];

interface TagListProps {
  userId: string;
}

const TagList = ({ userId }: TagListProps) => {
  const variables: Variables = {
    "userId": userId
  };

  return (
    <ResourceTable
      query={query}
      variables={variables}
      columns={columns}
      defaultPageSize={10}
      fieldName="allTags"
    />
  );
};

export default TagList;