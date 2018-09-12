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