import * as React from 'react';
import { Alert } from 'reactstrap';

const MISSING_ERROR = 'Error was swallowed during propagation.';

interface ErrorInfo {
  componentStack: string;
}

interface WithErrorBoundaryState {
  readonly error: Error | null | undefined;
  readonly info: ErrorInfo | null | undefined;
}

export const withErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return class WithErrorBoundary extends React.Component<P, WithErrorBoundaryState> {
    public static displayName = `withErrorBoundary(${WrappedComponent.name})`;

    public readonly state: WithErrorBoundaryState = {
      error: undefined,
      info: undefined
    };

    public componentDidCatch(error: Error | null, info: ErrorInfo | null) {
      this.setState({
        error: error || new Error(MISSING_ERROR),
        info
      });
      this.logError(error, info);
    }

    public logError = (error: Error | null, info: ErrorInfo | null) => {
      // TODO: send error report
    };

    public render() {
      const { error, info } = this.state;

      if (error != null) {
        return (
          <Alert color="danger">
            <h4 className="alert-heading">Application Error</h4>
            <p>An unexpected error occurred. Please try again in a few moments.
              If the problem persists, please contact the system administrator.</p>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {error.message}
              {(info != null) && info.componentStack}
            </details>
          </Alert>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withErrorBoundary;