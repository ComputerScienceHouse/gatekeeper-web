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
import { toast } from "react-toastify";
import Stoplight from "../Stoplight";
import { FaLink, FaUnlink } from "react-icons/fa";

const initialState = { ok: false };
type AdminHelperState = Readonly<typeof initialState>;

class AdminHelper extends React.Component<{}, AdminHelperState> {
  public readonly state: AdminHelperState = initialState;

  public componentDidMount() {
    this.checkHealth();
    setInterval(this.checkHealth, 5000);
  }

  public render() {
    return (
      <span>
        <Stoplight ok={this.state.ok}/> Admin Helper
      </span>
    );
  }

  private checkHealth = () => {
    return fetch("http://127.0.0.1:42069/healthz")
      .then((resp: Response) => {
        if (!resp.ok) {
          throw new Error(`HTTP error (status ${resp.status})`);
        }
        return resp.text();
      })
      .then((text: string) => {
        if (!this.state.ok && text === "ok") {
          this.setState({ ok: true }, this.notify);
        }
      })
      .catch(() => {
        if (this.state.ok) {
          this.setState({ ok: false }, this.notify);
        }
      });
  };

  private notify = () => {
    if (this.state.ok) {
      toast.success((
        <>
          <FaLink/>
          Admin Helper connected.
        </>
      ));
    } else {
      toast.warn((
        <>
          <FaUnlink/>
          Admin Helper disconnected.
        </>
      ));
    }
  };
}

export default AdminHelper;