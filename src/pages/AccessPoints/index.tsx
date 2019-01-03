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
import { withRouter, RouteComponentProps } from "react-router";
import AccessPointList from "./components/AccessPointList";

class AccessPoints extends React.Component<RouteComponentProps<{}>> {
  public render() {
    return (
      <>
        <h2>
          Access Points
          <Button
            color="primary"
            className="float-right"
            onClick={this.createAccessPoint}
          >
            <FaPlus/>
            Create Access Point
          </Button>
        </h2>
        <AccessPointList/>
      </>
    );
  }

  private createAccessPoint = () => {
    this.props.history.push("/access-points/new");
  };
}

export default withRouter(AccessPoints);