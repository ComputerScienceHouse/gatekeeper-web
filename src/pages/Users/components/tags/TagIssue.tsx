import React, { Component } from "react";
import { IssueRequest } from "../../../../interfaces/helper";
import AdminHelperAPI from "../../../../api/helper";
import HelperTask from "../../../../components/HelperTask";

interface TagIssueProps {
  issueRequest: IssueRequest;
  onSuccess?: () => void;
  onFailure?: () => void;
}

class TagIssue extends Component<TagIssueProps> {
  public render() {
    const { issueRequest, onSuccess, onFailure } = this.props;

    return (
      <HelperTask
        message="Writing tag..."
        onSuccess={onSuccess}
        onFailure={onFailure}
      >
        {async () => await AdminHelperAPI.issue(issueRequest)}
      </HelperTask>
    );
  }
}

export default TagIssue;