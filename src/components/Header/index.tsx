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
  FaReceipt
} from "react-icons/fa";
import logo from "./logo.svg";

const navLinks = [
  {
    exact: true,
    label: (
      <React.Fragment>
        <FaTachometerAlt/>
        Dashboard
      </React.Fragment>
    ),
    to: "/"
  },
  {
    label: (
      <React.Fragment>
        <FaUser/>
        Users
      </React.Fragment>
    ),
    to: "/users"
  },
  {
    label: (
      <React.Fragment>
        <FaUsers/>
        Groups
      </React.Fragment>
    ),
    to: "/groups"
  },
  {
    label: (
      <React.Fragment>
        <FaDoorOpen/>
        Access Points
      </React.Fragment>
    ),
    to: "/access-points"
  },
  {
    label: (
      <React.Fragment>
        <FaReceipt/>
        Logs
      </React.Fragment>
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
      <React.Fragment>
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
      </React.Fragment>
    );
  }

  private toggle() {
    this.setState((prevState: IHeaderState) => ({
      isOpen: !prevState.isOpen
    }));
  }
}