import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import styled from "@emotion/styled";
import { FaPlus } from "react-icons/fa";
import TagList from "./tags/TagList";
import TagIssueFlow from "./tags/TagIssueFlow";

const TagsContainer = styled.div`
  margin-top: 2rem;
`;

interface UserTagsProps {
  userId: string;
}

interface UserTagsState {
  showIssueModal: boolean;
  refreshTagList: boolean;
}

export default class UserTags extends React.Component<UserTagsProps, UserTagsState> {
  public state = {
    showIssueModal: false,
    refreshTagList: false
  };

  public render() {
    const { userId } = this.props;
    const { showIssueModal } = this.state;

    return (
      <>
        <TagsContainer>
          <h2>
            Tags
            <Button
              color="primary"
              className="float-right"
              onClick={this.toggleIssueModal}
            >
              <FaPlus/>
              Issue Tag
            </Button>
          </h2>
          <TagList userId={userId} />
        </TagsContainer>
        <Modal isOpen={showIssueModal}>
          <ModalHeader>Issue Tag</ModalHeader>
          <TagIssueFlow
            userId={userId}
            renderBody={this.renderModalBody}
            renderControls={this.renderModalFooter}
            onCancel={this.toggleIssueModal}
            onComplete={this.toggleIssueModal}
          />
        </Modal>
      </>
    );
  }

  private toggleIssueModal = () => {
    this.setState((prevState) => (
      { showIssueModal: !prevState.showIssueModal }
    ));
  };

  private renderModalBody = (body: React.ReactNode) => (
    <ModalBody>{body}</ModalBody>
  );

  private renderModalFooter = (controls: React.ReactNode) => (
    <ModalFooter>{controls}</ModalFooter>
  );
}