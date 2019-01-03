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
import { Button } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import { withRouter, RouteComponentProps } from "react-router";
import UserList from "./components/UserList";

class Users extends React.Component<RouteComponentProps<{}>> {
  public render() {
    return (
      <>
        <h2>
          Users
          <Button
            color="primary"
            className="float-right"
            onClick={this.createUser}
          >
            <FaPlus/>
            Create User
          </Button>
        </h2>
        <UserList/>
      </>
    );
  }

  private createUser = () => {
    this.props.history.push("/users/new");
  };
}

export default withRouter(Users);