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

import * as React from "react";
import { Query } from 'react-apollo';
import { DocumentNode } from 'graphql';
import { Column } from 'react-table';
import ResourceTable from './ResourceTable';
import { Variables } from '../../interfaces/graphql';
import withErrorBoundary from "../withErrorBoundary";

interface ResourceTableWrapperProps {
  query: DocumentNode;
  defaultPageSize: number;
  columns: Column[];
  fieldName: string;
}

interface ResourceTableWrapperState {
  queryVariables: Variables;
}

class ResourceTableWrapper extends React.Component<ResourceTableWrapperProps, ResourceTableWrapperState> {

  constructor(props: ResourceTableWrapperProps) {
    super(props);

    this.state = {
      queryVariables: {
        limit: props.defaultPageSize
      }
    };
  }
  public refetch = (variables: Variables) => {
    this.setState({ queryVariables: variables });
  };

  public render() {
    const {
      query,
      defaultPageSize,
      columns,
      fieldName,
      ...opts
    } = this.props;

    return (
      <Query
        query={query}
        variables={this.state.queryVariables}
      >
        {({ loading, error, data, fetchMore, updateQuery }) => {
          if (error) {
            throw error; // Will be caught by error boundary
          }

          return (
            <ResourceTable
              data={data}
              loading={loading}
              fetchMore={fetchMore}
              updateQuery={updateQuery}
              refetch={this.refetch}
              columns={columns}
              defaultPageSize={defaultPageSize}
              fieldName={fieldName}
              {...opts}
            />
          );
        }}
      </Query>
    );
  }
}

export default withErrorBoundary(ResourceTableWrapper);