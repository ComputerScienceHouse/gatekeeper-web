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
  FaTrashAlt,
  FaTimes
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
    create?: DocumentNode;
    update: DocumentNode;
    delete?: DocumentNode;
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
      fields,
      validationSchema,
      mutations
    } = this.props;
    const isUpdate = fields != null;
    if (!isUpdate && !mutations.create) {
      throw new Error("A create mutation must be provided for a ResourceForm without fields.");
    }

    return (
      <Mutation mutation={isUpdate ? mutations.update : mutations.create!}>
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
    const isUpdate = fields != null;

    const variables: { input: any } = {
      input: values || {}
    };

    if (isUpdate && id != null) {
      variables.input.id = id;
    }

    mutateResource({ variables })
      .then(({ data }: any) => {
        if (data.mutated.ok === true) {
          setSubmitting(false);

          if (isUpdate) {
            // Return to the resource list
            history.push(baseUrl);
          } else {
            // Redirect to the newly created resource
            history.push(`${baseUrl}/${data.mutated[fieldName]!.id}`);
          }

          toast.success((
            <>
              <FaCheck/>
              {resourceName} successfully {isUpdate ? "updated" : "created"}.
            </>
          ));
        } else {
          // TODO: Handle server-side errors
          setSubmitting(false);
          toast.error((
            <>
              <FaTimes/>
              Failed to {isUpdate ? "update" : "create"} {resourceName}.
            </>
          ));
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
    const { fields, displayName, render, resourceName, mutations } = this.props;
    const { errors, isSubmitting, handleSubmit } = formikBag;

    const isUpdate = fields != null;

    return (
      <Form onSubmit={handleSubmit}>
        <h2>{isUpdate ? `${resourceName}${displayName != null ? `: ${displayName}` : ""}` : `New ${resourceName}`}</h2>
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
            {isUpdate && mutations.delete && (
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