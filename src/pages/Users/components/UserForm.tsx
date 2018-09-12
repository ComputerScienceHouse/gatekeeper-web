import gql from "graphql-tag";
import React from "react";
import * as Yup from "yup";
import { User } from "../../../interfaces/models";
import withErrorBoundary from "../../../components/withErrorBoundary";
import ResourceForm from "../../../components/ResourceForm";
import FormFieldInput from "../../../components/FormFieldInput";

const createMutation = gql`
  mutation CreateUser($input: UserCreateGenericType!) {
    mutated: userCreate(newUser: $input) {
      user {
        id
      }
    }
  }
`;

const updateMutation = gql`
  mutation UpdateUser($input: UserUpdateGenericType!) {
    mutated: userUpdate(newUser: $input) {
      user {
        id
      }
    }
  }
`;

const deleteMutation = gql`
  mutation DeleteUser($id: ID!) {
    mutated: userDelete(id: $id){
      ok
    }
  }
`;

interface UserFormProps {
  user?: User
}

class UserForm extends React.Component<UserFormProps> {
  public render() {
    const { user } = this.props;
    const isUpdate = user != null;

    const formFields: {
      username: string,
      firstName: string,
      lastName: string,
      email: string
    } = {
      username: "",
      firstName: "",
      lastName: "",
      email: ""
    };

    if (isUpdate) {
      Object.assign(formFields, {
        username: user!.username,
        firstName: user!.firstName,
        lastName: user!.lastName,
        email: user!.email
      });
    }

    return (
      <ResourceForm
        fields={formFields}
        validationSchema={Yup.object().shape({
          username: Yup.string().required("A username for the user is required."),
          firstName: Yup.string(),
          lastName: Yup.string(),
          email: Yup.string().required("An email address for the user is required.")
        })}
        mutations={{
          create: createMutation,
          update: updateMutation,
          delete: deleteMutation
        }}
        baseUrl="/users"
        resourceName="User"
        fieldName="user"
        displayName={isUpdate ? user!.username : undefined}
        id={isUpdate ? user!.id : undefined}
        render={this.renderFormBody}
      />
    );
  }

  private renderFormBody = () => (
    <React.Fragment>
      <FormFieldInput name="username" label="Username"/>
      <FormFieldInput name="firstName" label="First Name"/>
      <FormFieldInput name="lastName" label="Last Name"/>
      <FormFieldInput name="email" label="Email Address"/>
    </React.Fragment>
  );
}

export default withErrorBoundary(UserForm);