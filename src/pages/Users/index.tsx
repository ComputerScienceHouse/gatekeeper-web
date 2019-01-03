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