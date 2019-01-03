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

import React, { ReactNode } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

interface ConfirmDialogProps {
  title?: string | ReactNode;
  body?: string | ReactNode;
  callToAction?: string | ReactNode;
  callToActionColor?: string;
  onConfirm: () => Promise<any>;
  children: (toggle: () => void) => ReactNode;
  className?: string;
}

interface ConfirmDialogState {
  open: boolean;
  disabled: boolean;
}

class ConfirmDialog extends React.Component<ConfirmDialogProps, ConfirmDialogState> {
  public static defaultProps = {
    title: null,
    callToAction: "Confirm",
    callToActionColor: "primary",
    className: "",
    disabled: false
  };

  constructor(props: ConfirmDialogProps) {
    super(props);

    this.state = {
      open: false,
      disabled: false
    };
  }

  public toggle = () => {
    this.setState(prevState => ({
      open: !prevState.open
    }));
  };

  public onConfirm = () => {
    this.setState({ disabled: true });
    this.props.onConfirm()
      .then(() => this.toggle());
  };

  public render() {
    const { title, body, callToAction, callToActionColor, children, className } = this.props;

    return (
      <>
        {children(this.toggle)}
        <Modal isOpen={this.state.open} toggle={this.toggle} className={className}>
          {title && (
            <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
          )}
          {body && (
            <ModalBody>{body}</ModalBody>
          )}
          <ModalFooter>
            <Button
              color="secondary"
              onClick={this.toggle}
              disabled={this.state.disabled}
            >
              Cancel
            </Button>
            <Button
              color={callToActionColor}
              onClick={this.onConfirm}
              disabled={this.state.disabled}
            >
              {callToAction}
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default ConfirmDialog;