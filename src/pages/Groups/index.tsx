import * as React from "react";
import { Button } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import { RouteComponentProps, withRouter } from "react-router";
import GroupList from "./components/GroupList";

class Groups extends React.Component<RouteComponentProps<{}>> {
  public render() {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }

  private createGroup = () => {
    this.props.history.push("/groups/new");
  };
}

export default withRouter(Groups);