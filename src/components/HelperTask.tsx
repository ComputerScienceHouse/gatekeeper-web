import React, {Component} from "react";
import isFunction from "lodash/isFunction";
import HelperTaskProgress from "./HelperTaskProgress";
import AdminHelperAPI from "../api/helper";
import styled from "@emotion/styled";
import Sockette from "sockette";

const REGEX_ERROR = new RegExp("ERROR|FATAL");

const LogViewer = styled.div`
  height: 300px;
  overflow-y: scroll;
  font-family: monospace;
  margin-top: 1rem;
  white-space: pre-line;
`;

interface HelperTaskActions {
  updateMessage: (msg: string) => void;
}

interface HelperTaskProps {
  message: string;
  onSuccess?: (res?: object) => void;
  onFailure?: () => void;
  children: (actions: HelperTaskActions) => Promise<string | null>;
}

interface HelperTaskState {
  result?: "success" | "failed";
  message: string;
  showLogViewer: boolean;
  log: string;
}

class HelperTask extends Component<HelperTaskProps, HelperTaskState> {
  public state = {
    result: undefined,
    message: this.props.message,
    showLogViewer: false,
    log: ""
  };

  private ws: Sockette | null = null;

  public render() {
    const {message} = this.props;
    const {showLogViewer, log, result} = this.state;

    let color = "primary";
    if (result === "success") {
      color = "success";
    } else if (result === "failed") {
      color = "danger";
    }

    return (
      <>
        <HelperTaskProgress
          message={message}
          indefinite={true}
          color={color}
        />
        {showLogViewer ? <LogViewer>{log}</LogViewer> : null}
      </>
    );
  }

  public async componentDidMount() {
    const {children} = this.props;

    const taskId = await children({
      updateMessage: this.updateMessage
    });

    if (!taskId) {
      this.handleSuccess();
      return;
    }

    this.ws = AdminHelperAPI.openTaskLog(taskId, {
      maxAttempts: 3,
      onopen: () => {
        this.log("Connected to Admin Helper.\n");
        this.setState({showLogViewer: true});
      },
      onmessage: (m: MessageEvent) => {
        // Check for the result payload
        try {
          const res = JSON.parse(m.data);
          this.handleSuccess(res);
        } catch (e) {
          // Normal text message
          this.log(m.data);

          // Check for an error message
          if (m.data.match(REGEX_ERROR) != null) {
            this.handleFailure();
          }
        }
      },
      onreconnect: () => this.log("Connection lost. Attempting to reconnect...\n"),
      onclose: () => this.log("Connection closed.\n"),
      onerror: () => {
        this.log(`[ERROR] WebSocket error\n`);
      }
    });
  }

  public componentWillUnmount() {
    if (this.ws != null) {
      this.ws.close();
    }
  }

  private updateMessage = (message: string) => {
    this.setState({message});
  };

  private handleSuccess = (res?: object) => {
    const {onSuccess} = this.props;

    this.setState({result: "success"}, () => {
      if (this.ws != null) {
        this.ws.close();
      }

      if (isFunction(onSuccess)) {
        onSuccess(res);
      }
    });
  };

  private handleFailure = () => {
    const {onFailure} = this.props;

    this.setState({result: "failed"}, () => {
      if (this.ws != null) {
        this.ws.close();
      }

      if (isFunction(onFailure)) {
        onFailure();
      }
    });
  };

  private log = (msg: string) => {
    this.setState((prevState) => ({
      log: prevState.log + `${msg}`
    }));
  };
}

export default HelperTask;