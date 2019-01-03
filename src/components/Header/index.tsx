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