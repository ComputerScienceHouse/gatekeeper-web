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
import "react-duallist/lib/react_duallist.css";
import Realm from "../../../interfaces/models/Realm";
import withErrorBoundary from "../../../components/withErrorBoundary";
import ResourceForm from "../../../components/ResourceForm";
import FormFieldInput from "../../../components/FormFieldInput";

const createMutation = gql`
  mutation CreateRealm($input: RealmCreateGenericType!) {
    mutated: realmCreate(newRealm: $input) {
      realm {
        id
      }
    }
  }
`;

const updateMutation = gql`
  mutation UpdateRealm($input: RealmUpdateGenericType!) {
    mutated: realmUpdate(newRealm: $input) {
      realm {
        id
      }
    }
  }
`;

const deleteMutation = gql`
  mutation DeleteRealm($id: ID!) {
    mutated: realmDelete(id: $id){
      ok
    }
  }
`;

interface RealmFormProps {
  realm?: Realm
}

class RealmForm extends React.Component<RealmFormProps> {
  public render() {
    const { realm } = this.props;
    const isUpdate = realm != null;

    const formFields: {
      name?: string,
      slot?: number,
      readKey?: string,
      authKey?: string,
      updateKey?: string,
      publicKey?: string,
      privateKey?: string
    } = {};

    if (isUpdate) {
      Object.assign(formFields, {
        name: realm!.name,
        slot: realm!.slot,
        readKey: realm!.readKey,
        authKey: realm!.authKey,
        updateKey: realm!.updateKey,
        publicKey: realm!.publicKey,
        privateKey: realm!.privateKey
      });
    }

    return (
      <ResourceForm
        fields={formFields}
        validationSchema={Yup.object().shape({
          name: Yup.string().required("A name for this realm is required."),
          slot: Yup.number()
            .integer("The slot number must be an integer.")
            .min(0, "The slot number must be positive.")
            .max(14, "The slot number must be less than 15.")
            .required("A slot between 0-14 for this realm is required."),
          readKey: Yup.string(),
          authKey: Yup.string(),
          updateKey: Yup.string(),
          publicKey: Yup.string(),
          privateKey: Yup.string()
        })}
        mutations={{
          create: createMutation,
          update: updateMutation,
          delete: deleteMutation
        }}
        baseUrl="/realms"
        resourceName="Realm"
        fieldName="realm"
        displayName={isUpdate ? realm!.name : undefined}
        id={isUpdate ? realm!.id : undefined}
        render={this.renderFormBody}
      />
    );
  }

  private renderFormBody = () => {
    const { realm } = this.props;
    const isUpdate = realm != null;

    return (
      <>
        <FormFieldInput name="name" label="Name"/>
        <FormFieldInput name="slot" label="Slot"/>
        {isUpdate ? (
          <>
            <FormFieldInput name="readKey" label="Read Key"/>
            <FormFieldInput name="authKey" label="Authentication Key"/>
            <FormFieldInput name="updateKey" label="Update Key"/>
            <FormFieldInput name="publicKey" label="Public Key" type="textarea"/>
            <FormFieldInput name="privateKey" label="Private Key" type="textarea"/>
          </>
        ) : null}
      </>
    );
  };
}

export default withErrorBoundary(RealmForm);