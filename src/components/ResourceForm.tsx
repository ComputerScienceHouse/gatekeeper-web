/* tslint:disable jsx-no-lambda */
import { DocumentNode } from "graphql";
import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Form
} from "reactstrap";
import {
  FaCheck,
  FaTrashAlt
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Mutation, MutationFn } from "react-apollo";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Formik, FormikActions, FormikProps } from "formik";
import ConfirmDialog from "./ConfirmDialog";
import withErrorBoundary from "./withErrorBoundary";

type ResourceFormProps<T> = {
  fields?: T;
  validationSchema: any | (() => any);
  mutations: {
    create: DocumentNode;
    update: DocumentNode;
    delete: DocumentNode;
  },
  baseUrl: string;
  resourceName: string;
  fieldName: string;
  displayName?: string;
  id?: string;
  render: ((props: FormikProps<T | undefined>) => React.ReactNode);
} & RouteComponentProps<{}>;

class ResourceForm<T> extends React.Component<ResourceFormProps<T>> {
  public render() {
    const {
      id,
      fields,
      validationSchema,
      mutations
    } = this.props;
    const isUpdate = fields != null && id != null;

    return (
      <Mutation mutation={isUpdate ? mutations.update : mutations.create}>
        {(mutateResource) => (
          <Formik
            initialValues={fields}
            validationSchema={validationSchema}
            onSubmit={(values: T | undefined, formikActions: FormikActions<T | undefined>) => this.handleSubmit(values, formikActions, mutateResource)}
            render={this.renderFormBody}
          />
        )}
      </Mutation>
    );
  }

  private handleSubmit = (values: T | undefined, { setSubmitting }: FormikActions<T | undefined>, mutateResource: MutationFn) => {
    const { fields, id, baseUrl, fieldName, resourceName, history } = this.props;
    const isUpdate = fields != null && id != null;

    const variables: { input: any } = {
      input: values || {}
    };

    if (isUpdate) {
      variables.input.id = id!;
    }

    mutateResource({ variables })
      .then(({ data }: any) => {
        if (isUpdate) {
          // Return to the resource list
          history.push(baseUrl);
          toast.success((
            <>
              <FaCheck/>
              {resourceName} successfully updated.
            </>
          ));
        } else {
          // Redirect to the newly created resource, if successful
          if (data.mutated[fieldName] != null && data.mutated[fieldName]!.id != null) {
            history.push(`${baseUrl}/${data.mutated[fieldName]!.id}`);
            toast.success((
              <>
                <FaCheck/>
                {resourceName} successfully created.
              </>
            ));
          }
        }
      })
      .catch((error: Error) => {
        setSubmitting(false);
        throw error; // Will be caught by error boundary
      });
  };

  private handleDelete = (deleteResource: MutationFn) => {
    const { id, resourceName, baseUrl, history } = this.props;

    return deleteResource({ variables: { id } })
      .then(() => {
        history.push(baseUrl);
        toast.success((
          <>
            <FaCheck/>
            {resourceName} successfully deleted.
          </>
        ));
      })
      .catch((error: Error) => {
        throw error; // Will be caught by error boundary
      });
  };

  private renderFormBody = (formikBag: FormikProps<T | undefined>) => {
    const { fields, id, displayName, render, resourceName, mutations } = this.props;
    const { errors, isSubmitting, handleSubmit } = formikBag;
    const isUpdate = fields != null && id != null;

    return (
      <Form onSubmit={handleSubmit}>
        <h2>{isUpdate ? `${resourceName}${displayName && `: ${displayName}`}` : `New ${resourceName}`}</h2>
        <Card>
          <CardBody>
            {render(formikBag)}
          </CardBody>
          <CardFooter>
            <Button
              type="submit"
              color="primary"
              size="large"
              disabled={isSubmitting || Object.getOwnPropertyNames(errors).length > 0}
            >
              <FaCheck/>
              {isUpdate ? "Update" : "Create"} {resourceName}
            </Button>
            {isUpdate && (
              <Mutation mutation={mutations.delete}>
                {(deleteResource) => (
                  <ConfirmDialog
                    title="Confirm Deletion"
                    body={`Are you sure you want to delete this ${resourceName}?`}
                    callToAction={(
                      <>
                        <FaTrashAlt/>
                        Delete
                      </>
                    )}
                    callToActionColor="danger"
                    onConfirm={() => this.handleDelete(deleteResource)}
                  >
                    {(toggle) => (
                      <Button
                        color="danger"
                        size="large"
                        className="float-right"
                        disabled={isSubmitting}
                        onClick={toggle}
                      >
                        <FaTrashAlt/>
                        Delete
                      </Button>
                    )}
                  </ConfirmDialog>
                )}
              </Mutation>
            )}
          </CardFooter>
        </Card>
      </Form>
    );
  };
}

export default withErrorBoundary(withRouter(ResourceForm));