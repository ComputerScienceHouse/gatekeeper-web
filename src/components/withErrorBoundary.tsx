/*
 * Gatekeeper - Open source access control
 * Copyright (C) 2018-2019 Steven Mirabito
 *
 * This file is part of Gatekeeper.
 *
 * Gatekeeper is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Gatekeeper is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Gatekeeper.  If not, see <http://www.gnu.org/licenses/>.
 */

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