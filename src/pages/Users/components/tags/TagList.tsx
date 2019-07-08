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
import { Button } from "reactstrap";
import {
  FaCheck,
  FaTrashAlt
} from "react-icons/fa";
import ResourceTable, { ResourceTableBag } from "../../../../components/ResourceTable";
import ConfirmDialog from "../../../../components/ConfirmDialog";
import { Variables } from "../../../../interfaces/graphql";
import { Tag } from "../../../../interfaces/models";
import { Mutation } from "react-apollo";
import { toast } from "react-toastify";

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
        externalId
        uid
      }
    }
  }
`;

const deleteTagMutation = gql`
  mutation DeleteTag($id: ID!) {
    mutated: tagDelete(id: $id){
      ok
    }
  }
`;

const columns = ({ refetch }: ResourceTableBag) => [
  {
    Header: "ID",
    accessor: "externalId"
  },
  {
    Header: "UID",
    accessor: "uid"
  },
  {
    id: "actions",
    Header: "Actions",
    width: 90,
    accessor: (tag: Tag) => (
      <Mutation mutation={deleteTagMutation}>
        {(deleteTag) => {
          const handleDelete = () => deleteTag({ variables: { id: tag.id } })
            .then(() => {
              refetch();
              toast.success((
                <>
                  <FaCheck/>
                  Tag successfully deleted.
                </>
              ));
            })
            .catch((error: Error) => {
              throw error; // Will be caught by error boundary
            });

          return (
            <ConfirmDialog
              title="Confirm Deletion"
              body="Are you sure you want to delete this tag?"
              callToAction={(
                <>
                  <FaTrashAlt/>
                  Delete
                </>
              )}
              callToActionColor="danger"
              onConfirm={handleDelete}
            >
              {(toggle) => (
                <Button
                  color="danger"
                  size="sm"
                  onClick={toggle}
                >
                  <FaTrashAlt/>
                  Delete
                </Button>
              )}
            </ConfirmDialog>
          );
        }}
      </Mutation>
    )
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