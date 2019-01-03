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