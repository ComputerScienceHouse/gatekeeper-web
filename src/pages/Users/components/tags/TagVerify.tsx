import React, { Component } from "react";
import AdminHelperAPI from "../../../../api/helper";
import HelperTask from "../../../../components/HelperTask";
import { IssueRequest } from "../../../../interfaces/helper";

interface TagVerifyProps {
  issueRequest: IssueRequest;
  onSuccess?: () => void;
  onFailure?: () => void;
}

class TagVerify extends Component<TagVerifyProps> {
  public render() {
    const { issueRequest, onSuccess, onFailure } = this.props;

    return (
      <HelperTask
        message="Verifying tag..."
        onSuccess={onSuccess}
        onFailure={onFailure}
      >
        {async () => await AdminHelperAPI.verify(issueRequest)}
      </HelperTask>
    );
  }
}

export default TagVerify;