import React, { Component, ReactNode } from "react";
import { Wizard, Steps, Step as WizardStep, WizardContext } from "react-albus";
import { Alert, Button } from "reactstrap";
import { FaArrowRight, FaExclamationTriangle } from "react-icons/fa";
import styled from "@emotion/styled";
import isFunction from "lodash/isFunction";
import TagRealmSelect from "./TagRealmSelect";
import "react-step-progress-bar/styles.css";
import StepProgressBar from "../../../../components/StepProgressBar";
import withErrorBoundary from "../../../../components/withErrorBoundary";
import AdminHelperAPI from "../../../../api/helper";
import TagIssue from "./TagIssue";


const IconContinue = styled(FaArrowRight)`
  margin: 0 0 0 5px;
`;

interface TagIssueFlowProps {
  userId: string;
  onCancel?: () => void;
  renderBody?: (body: React.ReactNode) => ReactNode;
  renderControls?: (controls: React.ReactNode) => ReactNode;
}

interface TagIssueFlowState {
  loading: boolean;
  helperOnline: boolean;
  nfcConnected: boolean;
  realmIds: string[];
  tagId?: string;
}

class TagIssueFlow extends Component<TagIssueFlowProps, TagIssueFlowState> {
  public state = {
    loading: true,
    helperOnline: false,
    nfcConnected: false,
    realmIds: []
  };

  public componentDidMount() {
    return Promise.all([
      this.checkHelperHealth(),
      this.checkNFCHealth()
    ])
      .then(() => this.setState({ loading: false }));
  }

  public render() {
    if (this.state.loading) {
      return "Loading...";
    }

    if (!this.state.helperOnline) {
      return this.renderPreflightError("The Admin Helper is required to issue tags. Please install and start the application.");
    }

    if (!this.state.nfcConnected) {
      return this.renderPreflightError("Please connect a compatible NFC reader.");
    }

    return (
      <Wizard>
        <Steps>
          <WizardStep
            id="realms"
            render={this.renderRealmStep}
          />
          <WizardStep
            id="create"
            render={this.renderIssueStep}
          />
        </Steps>
      </Wizard>
    );
  }

  private checkHelperHealth = () => {
    return AdminHelperAPI.checkHealth()
      .then((ok: boolean) => {
        if (!this.state.helperOnline) {
          if (ok) {
            this.setState({ helperOnline: true });
          } else {
            setTimeout(this.checkHelperHealth, 2000);
          }
        }
      });
  };

  private checkNFCHealth = () => {
    return AdminHelperAPI.checkNFCHealth()
      .then((ok: boolean) => {
        if (!this.state.nfcConnected) {
          if (ok) {
            this.setState({ nfcConnected: true });
          } else {
            setTimeout(this.checkNFCHealth, 2000);
          }
        }
      });
  };

  private renderPreflightError = (msg: string) => {
    const showCancel = isFunction(this.props.onCancel);

    return (
      <>
        {this.renderBody(
          <Alert color="danger">
            <FaExclamationTriangle/>
            {msg}
          </Alert>
        )}
        {showCancel ? this.renderControls(
          <Button color="default" onClick={this.props.onCancel}>
            Cancel
          </Button>
        ) : null}
      </>
    );
  };

  private renderRealmStep = ({ next }: WizardContext) => {
    const showCancel = isFunction(this.props.onCancel);
    const isValid = this.state.realmIds.length > 0;

    return (
      <>
        {this.renderBody(
          <>
            <StepProgressBar steps={3} current={1}/>
            <h4>Select Realm(s)</h4>
            <TagRealmSelect onSelect={this.handleRealmSelect}/>
          </>
        )}
        {this.renderControls(
          <>
            {showCancel ? (
              <Button color="default" onClick={this.props.onCancel}>
                Cancel
              </Button>
            ) : null}
            <Button
              color="primary"
              onClick={next}
              disabled={!isValid}
            >
              Continue
              <IconContinue/>
            </Button>
          </>
        )}
      </>
    );
  };

  private handleRealmSelect = (realmIds: string[]) => {
    this.setState({ realmIds });
  };

  private renderIssueStep = ({ next }: WizardContext) => (
    <>
      {this.renderBody(
        <>
          <StepProgressBar steps={3} current={2}/>
          <TagIssue
            userId={this.props.userId}
            realmIds={this.state.realmIds}
            onComplete={next}
          />
        </>
      )}
    </>
  );

  private useRenderFuncOrReturn = (propName: string, children: React.ReactNode) => {
    if (isFunction(this.props[propName])) {
      return this.props[propName](children);
    }
    return children;
  };

  private renderBody = (children: React.ReactNode) =>
    this.useRenderFuncOrReturn("renderBody", children);

  private renderControls = (children: React.ReactNode) =>
    this.useRenderFuncOrReturn("renderControls", children);
}

export default withErrorBoundary(TagIssueFlow);