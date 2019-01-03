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

import React from "react";
import {
  FormGroup,
  Label
} from "reactstrap";
import { Field, FieldProps } from "formik";

interface FormFieldProps<T> {
  name: string;
  label: string;
  render: ((props: FieldProps<T>) => React.ReactNode);
}

class FormField<T> extends React.PureComponent<FormFieldProps<T>> {
  public render() {
    return (
      <Field
        name={this.props.name}
        render={this.renderField}
      />
    );
  }

  private renderField = (props: FieldProps<T>) => {
    const { label, render } = this.props;
    const { form } = props;

    return (
      <FormGroup>
        <Label
          for={name}
          className={
            form.touched[name] && form.errors[name] != null
              ? "text-danger"
              : undefined
          }
        >
          {label}
        </Label>
        {render(props)}
        {form.touched[name] && form.errors[name] && (
          <span className="text-danger">{form.errors[name]}</span>
        )}
      </FormGroup>
    );
  };
}

export default FormField;