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
import { NavLink as RouterNavLink } from "react-router-dom";
import {
  Collapse,
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink
} from "reactstrap";
import {
  FaTachometerAlt,
  FaUser,
  FaUsers,
  FaDoorOpen,
  FaReceipt,
  FaGlobe
} from "react-icons/fa";
import logo from "./logo.svg";

const navLinks = [
  {
    exact: true,
    label: (
      <>
        <FaTachometerAlt/>
        Dashboard
      </>
    ),
    to: "/"
  },
  {
    label: (
      <>
        <FaUser/>
        Users
      </>
    ),
    to: "/users"
  },
  {
    label: (
      <>
        <FaUsers/>
        Groups
      </>
    ),
    to: "/groups"
  },
  {
    label: (
      <>
        <FaGlobe/>
        Realms
      </>
    ),
    to: "/realms"
  },
  {
    label: (
      <>
        <FaDoorOpen/>
        Access Points
      </>
    ),
    to: "/access-points"
  },
  {
    label: (
      <>
        <FaReceipt/>
        Logs
      </>
    ),
    to: "/logs"
  }
];


interface IHeaderState {
  isOpen: boolean;
}

export default class Header extends React.Component<{}, IHeaderState> {
  constructor(props: {}) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  public render() {
    return (
      <>
        <Navbar dark={true} color="dark" expand="md" fixed="top">
          <Container>
            <img src={logo} aria-hidden={true} height="38px"/>
            <NavbarBrand href="/">
              Gatekeeper
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle}/>
            <Collapse isOpen={this.state.isOpen} navbar={true}>
              <Nav navbar={true}>
                {navLinks.map((item, i) => (
                  <NavItem key={i}>
                    <NavLink
                      activeClassName="active"
                      exact={item.exact}
                      tag={RouterNavLink}
                      to={item.to}
                    >{item.label}</NavLink>
                  </NavItem>
                ))}
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        <Navbar light={true} color="light" expand="md">
          <Container>
            Breadcrumbs
          </Container>
        </Navbar>
      </>
    );
  }

  private toggle() {
    this.setState((prevState: IHeaderState) => ({
      isOpen: !prevState.isOpen
    }));
  }
}