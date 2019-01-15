import React, { Component, ReactNode } from "react";
import { Wizard, Steps, Step as WizardStep, WizardContext } from "react-albus";
import { Alert, Button } from "reactstrap";
import { FaArrowRight, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import styled from "@emotion/styled";
import isFunction from "lodash/isFunction";
import TagRealmSelect from "./TagRealmSelect";
import "react-step-progress-bar/styles.css";
import StepProgressBar from "../../../../components/StepProgressBar";
import withErrorBoundary from "../../../../components/withErrorBoundary";
import AdminHelperAPI from "../../../../api/helper";
import TagIssue from "./TagIssue";
import Timeout = NodeJS.Timeout;
import { ThemeProp } from "../../../../interfaces/Theme";
import Loader from "../../../../components/Loader";
import gql from "graphql-tag";
import { Configuration, Realm, TagRealmAssoication } from "../../../../interfaces/models";
import { IssueRequest, Realm as IssueRequestRealm } from "../../../../interfaces/helper";
import { FetchResult, withApollo, WithApolloClient } from "react-apollo";
import { ListType, NodeResult } from "../../../../interfaces/graphql";
import TagVerify from "./TagVerify";
import TagCreate from "./TagCreate";

const configQuery = gql`
  query ConfigQuery {
    configuration {
      systemSecret
    }
  }
`;

const realmDataQuery = gql`
  query RealmDataQuery(
  $tagId: ID!,
  $realmId: ID!
  ) {
    realm(id: $realmId) {
      id
      name
      slot
      readKey
      authKey
      updateKey
      publicKey
      privateKey
    }
    allTagRealmAssociations(tag: $tagId, realm: $realmId) {
      results {
        id
      }
    }
  }
`;

const IconContinue = styled(FaArrowRight)`
  margin: 0 0 0 5px;
`;

const BigSuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const BigSuccess = styled(FaCheckCircle)`
  padding: 1rem;
  width: 5rem;
  height: 5rem;
  color: ${(props: ThemeProp) => props.theme!.colors.success}
`;

interface TagIssueFlowProps {
  userId: string;
  onCancel?: () => void;
  onComplete?: () => void;
  renderBody?: (body: React.ReactNode) => ReactNode;
  renderControls?: (controls: React.ReactNode) => ReactNode;
}

interface TagIssueFlowState {
  loading: boolean;
  failed: boolean;
  helperOnline: boolean;
  nfcConnected: boolean;
  realmIds: string[];
  issueRequest?: IssueRequest;
  tagId?: string;
}

class TagIssueFlow extends Component<WithApolloClient<TagIssueFlowProps>, TagIssueFlowState> {
  public state = {
    loading: true,
    failed: false,
    helperOnline: false,
    nfcConnected: false,
    realmIds: [],
    tagId: undefined,
    issueRequest: undefined
  };

  private checkHelperTimeout: Timeout | null = null;
  private checkNFCTimeout: Timeout | null = null;

  public componentDidMount() {
    return Promise.all([
      this.checkHelperHealth(),
      this.checkNFCHealth()
    ])
      .then(() => this.setState({ loading: false }));
  }

  public componentWillUnmount() {
    if (this.checkHelperTimeout != null) {
      clearTimeout(this.checkHelperTimeout);
    }

    if (this.checkNFCTimeout != null) {
      clearTimeout(this.checkNFCTimeout);
    }
  }

  public render() {
    if (this.state.loading) {
      return this.renderBody(<Loader/>);
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
            id="realm"
            render={this.renderRealmStep}
          />
          <WizardStep
            id="create"
            render={this.renderCreateStep}
          />
          <WizardStep
            id="issue"
            render={this.renderIssueStep}
          />
          <WizardStep
            id="verify"
            render={this.renderVerifyStep}
          />
          <WizardStep
            id="finish"
            render={this.renderFinishStep}
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
            this.checkHelperTimeout = setTimeout(this.checkHelperHealth, 2000);
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
            this.checkNFCTimeout = setTimeout(this.checkNFCHealth, 2000);
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

  private handleFailure = () => {
    // TODO: Roll back tag creation
    this.setState({ failed: true });
  };

  private renderRealmStep = ({ next }: WizardContext) => {
    const showCancel = isFunction(this.props.onCancel);
    const isValid = this.state.realmIds.length > 0;

    return (
      <>
        {this.renderBody(
          <>
            <StepProgressBar steps={5} current={1}/>
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

  private renderCreateStep = ({ next }: WizardContext) => {
    const { userId, onCancel } = this.props;
    const { failed, realmIds } = this.state;
    const showClose = isFunction(onCancel);

    const wrapHandleTagCreate = (tagId: string) => {
      this.handleTagCreate(tagId);
      next();
    };

    return (
      <>
        {this.renderBody(
          <>
            <StepProgressBar steps={5} current={2}/>
            <TagCreate
              userId={userId}
              realmIds={realmIds}
              onSuccess={wrapHandleTagCreate}
              onFailure={this.handleFailure}
            />
          </>
        )}
        {failed && showClose && this.renderControls(
          <Button color="default" onClick={onCancel}>
            Close
          </Button>
        )}
      </>
    );
  };

  private handleTagCreate = async (tagId: string) => {
    const config = await this.getConfig();

    const realms = [];
    for (const realmId of this.state.realmIds) {
      realms.push(await this.getRealmData(realmId, tagId));
    }

    const issueRequest: IssueRequest = {
      realms,
      systemSecret: config.systemSecret
    };

    this.setState({ issueRequest });
  };

  private renderIssueStep = ({ next }: WizardContext) => {
    const { onCancel } = this.props;
    const { failed, issueRequest } = this.state;
    const showClose = isFunction(onCancel);

    if (issueRequest == null) {
      return this.renderBody(<Loader/>);
    }

    return (
      <>
        {this.renderBody(
          <>
            <StepProgressBar steps={5} current={3}/>
            <TagIssue
              issueRequest={issueRequest}
              onSuccess={next}
              onFailure={this.handleFailure}
            />
          </>
        )}
        {failed && showClose && this.renderControls(
          <Button color="default" onClick={onCancel}>
            Close
          </Button>
        )}
      </>
    );
  };

  private renderVerifyStep = ({ next }: WizardContext) => {
    const { onCancel } = this.props;
    const { failed, issueRequest } = this.state;
    const showClose = isFunction(onCancel);

    if (issueRequest == null) {
      return this.renderBody(<Loader/>);
    }

    return (
      <>
        {this.renderBody(
          <>
            <StepProgressBar steps={5} current={4}/>
            <TagVerify
              issueRequest={issueRequest}
              onSuccess={next}
              onFailure={this.handleFailure}
            />
          </>
        )}
        {failed && showClose && this.renderControls(
          <Button color="default" onClick={onCancel}>
            Close
          </Button>
        )}
      </>
    );
  };

  private renderFinishStep = () => {
    const showFinish = isFunction(this.props.onComplete);

    return (
      <>
        {this.renderBody(
          <>
            <StepProgressBar steps={5} current={5}/>
            <BigSuccessContainer>
              <BigSuccess/>
              <h4>Successfully Issued Tag</h4>
            </BigSuccessContainer>
          </>
        )}
        {showFinish && this.renderControls(
          <>
            <Button color="primary" onClick={this.props.onComplete}>
              Finish
              <IconContinue/>
            </Button>
          </>
        )}
      </>
    );
  };

  private getConfig = async (): Promise<Configuration> => {
    const { client } = this.props;

    const data: FetchResult<NodeResult<Configuration>> = await client.query({
      query: configQuery
    });

    return ((data || {}).data || {}).configuration;
  };

  private getRealmData = async (realmId: string, tagId: string): Promise<IssueRequestRealm> => {
    const { client } = this.props;

    const data: FetchResult<{
      realm: Realm,
      allTagRealmAssociations: ListType<TagRealmAssoication>
    }> = await client.query({
      query: realmDataQuery,
      variables: {
        realmId,
        tagId
      }
    });

    const result = (data || {}).data!;

    return {
      ...result.realm,
      associationId: result.allTagRealmAssociations.results[0].id
    };
  };

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

export default withErrorBoundary(withApollo(TagIssueFlow));