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
import {
  Badge,
  FormGroup,
  Label
} from "reactstrap";
import * as Yup from "yup";
import Duallist from "react-duallist";
import "react-duallist/lib/react_duallist.css";
import AccessPoint from "../../../interfaces/models/AccessPoint";
import withErrorBoundary from "../../../components/withErrorBoundary";
import ResourceForm from "../../../components/ResourceForm";
import FormFieldInput from "../../../components/FormFieldInput";

const createMutation = gql`
  mutation CreateAccessPoint($input: AccessPointCreateGenericType!) {
    mutated: accessPointCreate(newAccessPoint: $input) {
      ok
      accessPoint {
        id
      }
    }
  }
`;

const updateMutation = gql`
  mutation UpdateAccessPoint($input: AccessPointUpdateGenericType!) {
    mutated: accessPointUpdate(newAccessPoint: $input) {
      ok
      accessPoint {
        id
      }
    }
  }
`;

const deleteMutation = gql`
  mutation DeleteAccessPoint($id: ID!) {
    mutated: accessPointDelete(id: $id){
      ok
    }
  }
`;

interface AccessPointFormProps {
  accessPoint?: AccessPoint
}

class AccessPointForm extends React.Component<AccessPointFormProps> {
  public render() {
    const { accessPoint } = this.props;
    const isUpdate = accessPoint != null;

    let formFields: {
      name: string,
      location: string
    } | null = null;

    if (isUpdate) {
      formFields = {
        name: accessPoint!.name,
        location: accessPoint!.location
      };
    }

    return (
      <ResourceForm
        fields={formFields || undefined}
        validationSchema={Yup.object().shape({
          name: Yup.string().required("A name for this access point is required."),
          location: Yup.string().required("A location for this access point is required.")
        })}
        mutations={{
          create: createMutation,
          update: updateMutation,
          delete: deleteMutation
        }}
        baseUrl="/access-points"
        resourceName="Access Point"
        fieldName="accessPoint"
        displayName={isUpdate ? accessPoint!.name : undefined}
        id={isUpdate ? accessPoint!.id : undefined}
        render={this.renderFormBody}
      />
    );
  }

  private renderFormBody = () => {
    const { accessPoint } = this.props;
    const isUpdate = accessPoint != null;

    return (
      <>
        {isUpdate && (
          <FormGroup>
            <Label>Status</Label>
            <div>
              {accessPoint!.online
                ? <Badge color="success">Online</Badge>
                : <Badge color="danger">Offline</Badge>
              }
            </div>
          </FormGroup>
        )}
        <FormFieldInput name="name" label="Name"/>
        <FormFieldInput name="location" label="Location"/>
        <h4>Groups</h4>
        <Duallist
          available={[
            { value: "foo", "label": "Foo" },
            { value: "bar", "label": "Bar" }
          ]}
          selected={["foo"]}
          sortable={false}
        />
        <h4>Users</h4>
        <Duallist
          available={[
            { value: "foo", "label": "Foo" },
            { value: "bar", "label": "Bar" }
          ]}
          selected={["foo"]}
          sortable={false}
        />
      </>
    );
  };
}

export default withErrorBoundary(AccessPointForm);