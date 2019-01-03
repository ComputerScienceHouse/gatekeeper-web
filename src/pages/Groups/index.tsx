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

import * as React from "react";
import { Button } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import { RouteComponentProps, withRouter } from "react-router";
import GroupList from "./components/GroupList";

class Groups extends React.Component<RouteComponentProps<{}>> {
  public render() {
    return (
      <>
        <h2>
          Groups
          <Button
            color="primary"
            className="float-right"
            onClick={this.createGroup}
          >
            <FaPlus/>
            Create Group
          </Button>
        </h2>
        <GroupList/>
      </>
    );
  }

  private createGroup = () => {
    this.props.history.push("/groups/new");
  };
}

export default withRouter(Groups);