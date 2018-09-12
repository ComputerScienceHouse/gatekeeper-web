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
      group {
        id
      }
    }
  }
`;

const updateMutation = gql`
  mutation UpdateGroup($input: GroupUpdateGenericType!) {
    mutated: groupUpdate(newGroup: $input) {
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

    const formFields: {
      name: string
    } = {
      name: ""
    };

    if (isUpdate) {
      Object.assign(formFields, {
        name: group!.name
      });
    }

    return (
      <ResourceForm
        fields={formFields}
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
    <React.Fragment>
      <FormFieldInput name="name" label="Name"/>
    </React.Fragment>
  );
};

export default withErrorBoundary(GroupForm);