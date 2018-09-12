import React from "react";
import { Input, InputProps } from "reactstrap";
import { FieldProps } from "formik";
import FormField from "./FormField";

type FormFieldInputProps = {
  name: string;
  label: string;
} & InputProps;

class FormFieldInput<T> extends React.PureComponent<FormFieldInputProps> {
  public render() {
    const { name, label } = this.props;

    return (
      <FormField
        name={name}
        label={label}
        render={this.renderField}
      />
    );
  }

  private renderField = ({ form, field }: FieldProps<T>) => {
    const { name, label, ...attributes } = this.props;

    return (
      <Input
        invalid={form.touched[name] && form.errors[name] != null}
        {...field}
        {...attributes}
      />
    );
  };
}

export default FormFieldInput;