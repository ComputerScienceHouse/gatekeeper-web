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
import * as Yup from "yup";
import { Group } from "../../../interfaces/models";
import withErrorBoundary from "../../../components/withErrorBoundary";
import ResourceForm from "../../../components/ResourceForm";
import FormFieldInput from "../../../components/FormFieldInput";

const createMutation = gql`
  mutation CreateGroup($input: GroupCreateGenericType!) {
    mutated: groupCreate(newGroup: $input) {
      ok
      group {
        id
      }
    }
  }
`;

const updateMutation = gql`
  mutation UpdateGroup($input: GroupUpdateGenericType!) {
    mutated: groupUpdate(newGroup: $input) {
      ok
      group {
        id
      }
    }
  }
`;

const deleteMutation = gql`
  mutation DeleteGroup($id: ID!) {
    mutated: groupDelete(id: $id){
      ok
    }
  }
`;

interface GroupFormProps {
  group?: Group
}

class GroupForm extends React.Component<GroupFormProps> {
  public render() {
    const { group } = this.props;
    const isUpdate = group != null;

    let formFields: {
      name: string
    } | null = null;

    if (isUpdate) {
      formFields = {
        name: group!.name
      };
    }

    return (
      <ResourceForm
        fields={formFields || undefined}
        validationSchema={Yup.object().shape({
          name: Yup.string().required("A name for the group is required.")
        })}
        mutations={{
          create: createMutation,
          update: updateMutation,
          delete: deleteMutation
        }}
        baseUrl="/groups"
        resourceName="Group"
        fieldName="group"
        displayName={isUpdate ? group!.name : undefined}
        id={isUpdate ? group!.id : undefined}
        render={this.renderFormBody}
      />
    );
  }

  private renderFormBody = () => (
    <>
      <FormFieldInput name="name" label="Name"/>
    </>
  );
};

export default withErrorBoundary(GroupForm);