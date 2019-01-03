import * as React from "react";
import { Button } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import { withRouter, RouteComponentProps } from "react-router";
import RealmList from "./components/RealmList";

class Realms extends React.Component<RouteComponentProps<{}>> {
  public render() {
    return (
      <>
        <h2>
          Realms
          <Button
            color="primary"
            className="float-right"
            onClick={this.createRealm}
          >
            <FaPlus/>
            Create Realm
          </Button>
        </h2>
        <RealmList/>
      </>
    );
  }

  private createRealm = () => {
    this.props.history.push("/realms/new");
  };
}

export default withRouter(Realms);