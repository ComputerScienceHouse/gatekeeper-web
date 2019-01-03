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
      accessPoint {
        id
      }
    }
  }
`;

const updateMutation = gql`
  mutation UpdateAccessPoint($input: AccessPointUpdateGenericType!) {
    mutated: accessPointUpdate(newAccessPoint: $input) {
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

    const formFields: {
      name?: string,
      location?: string
    } = {
      name: "",
      location: ""
    };

    if (isUpdate) {
      Object.assign(formFields, {
        name: accessPoint!.name,
        location: accessPoint!.location
      });
    }

    return (
      <ResourceForm
        fields={formFields}
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
            { value: 'foo', 'label': 'Foo' },
            { value: 'bar', 'label': 'Bar' }
          ]}
          selected={['foo']}
          sortable={false}
        />
        <h4>Users</h4>
        <Duallist
          available={[
            { value: 'foo', 'label': 'Foo' },
            { value: 'bar', 'label': 'Bar' }
          ]}
          selected={['foo']}
          sortable={false}
        />
      </>
    );
  };
}

export default withErrorBoundary(AccessPointForm);