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
import { Configuration } from "../../../interfaces/models";
import withErrorBoundary from "../../../components/withErrorBoundary";
import ResourceForm from "../../../components/ResourceForm";
import FormFieldInput from "../../../components/FormFieldInput";

const updateMutation = gql`
  mutation ($input: ConfigurationUpdateGenericType!) {
    mutated: configurationUpdate(newConfiguration: $input) {
      ok
    }
  }
`;

interface SettingsFormProps {
  config: Configuration
}

class SettingsForm extends React.Component<SettingsFormProps> {
  public render() {
    const { config } = this.props;

    const formFields = {
      systemSecret: config.systemSecret
    };

    return (
      <ResourceForm
        fields={formFields}
        validationSchema={Yup.object().shape({
          systemSecret: Yup.string()
            .required("A value for System Secret is required.")
            .min(32, "The System Secret must be exactly 32 characters.")
            .max(32, "The System Secret must be exactly 32 characters.")
            .matches(RegExp("^[a-f0-9]+$"), "The System Secret must be a lowercase hex string (a-f, 0-9).")
        })}
        mutations={{
          update: updateMutation
        }}
        baseUrl="/settings"
        resourceName="Settings"
        fieldName="configuration"
        render={this.renderFormBody}
      />
    );
  }

  private renderFormBody = () => (
    <>
      <FormFieldInput name="systemSecret" label="System Secret"/>
    </>
  );
}

export default withErrorBoundary(SettingsForm);