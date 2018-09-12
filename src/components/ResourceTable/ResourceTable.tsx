import * as React from "react";
import snakeCase from "lodash/snakeCase";
import ReactTable, { Column, TableProps } from "react-table";
import "react-table/react-table.css";
import { ListType, Variables } from "../../interfaces/graphql";

interface ResourceTableProps<T> {
  data: Record<string, ListType<T>>;
  loading: boolean;
  refetch: (variables: Variables) => void;
  fetchMore: Function; // tslint:disable-line ban-types
  updateQuery: Function; // tslint:disable-line ban-types
  columns: Column[];
  defaultPageSize?: number;
  fieldName: string;
}

interface ResourceTableState<T> {
  page: number;
  pageSize: number;
}

export default class ResourceTable<T> extends React.Component<ResourceTableProps<T>, ResourceTableState<T>> {

  constructor(props: ResourceTableProps<T>) {
    super(props);

    this.state = {
      page: 0,
      pageSize: props.defaultPageSize || 10
    };
  }

  public handleTableChange = (tableState: TableProps) => {
    const { fieldName, fetchMore, refetch, updateQuery } = this.props;
    const { page, pageSize } = this.state;

    if (tableState.pageSize != null && pageSize > tableState.pageSize) {
      // Decreased table size
      const newPageSize = tableState.pageSize;
      this.setState({ pageSize: newPageSize });

      // Patch query result in the Apollo cache
      return updateQuery((previousResult: Record<string, ListType<T>>) => ({
        // Slice the results array and update the Apollo cache
        [fieldName]: {
          __typename: previousResult[fieldName].__typename,
          totalCount: previousResult[fieldName].totalCount,
          results: previousResult[fieldName].results.slice(0, newPageSize)
        }
      }));
    }

    const variables: Variables = {
      offset: page * pageSize,
      limit: pageSize
    };

    // Apply any filters
    if (tableState.filtered != null) {
      tableState.filtered.forEach(filter => {
        variables[`${filter.id}_Icontains`] = filter.value;
      });
    }

    // Apply any sorts
    if (tableState.sorted != null) {
      tableState.sorted.forEach(sort => {
        variables.ordering = `${sort.desc ? "-" : ""}${snakeCase(sort.id)}`;
      });
    }

    if (tableState.page != null && page !== tableState.page) {
      // Navigated to a different page
      const newPage = tableState.page;
      variables.offset = newPage * pageSize;

      this.setState({ page: newPage });

      return refetch(variables);
    }

    if (tableState.pageSize != null && pageSize < tableState.pageSize) {
      // Increased page size
      const newPageSize = tableState.pageSize;
      this.setState({ pageSize: newPageSize });

      // Retrieve only the difference
      variables.offset = (page * pageSize) + pageSize;
      variables.limit = newPageSize - pageSize;

      return fetchMore({
        variables,
        updateQuery: (
          previousResult: Record<string, ListType<T>>,
          { fetchMoreResult }: { fetchMoreResult?: Record<string, ListType<T>> }
        ) => {
          if (fetchMoreResult == null) {
            return previousResult;
          }

          return {
            // Add the new edges to the end of the list and update pageInfo
            [fieldName]: {
              __typename: previousResult[fieldName].__typename,
              totalCount: fetchMoreResult[fieldName].totalCount,
              results: [
                ...previousResult[fieldName].results,
                ...fetchMoreResult[fieldName].results
              ]
            }
          };
        }
      });
    }

    // Not paginating, simply refetch with any applied filters/sorts
    // Reset the page number as applying filters/sorts will jump back to the beginning
    this.setState({ page: 0 });

    return refetch(variables);
  };

  public render() {
    const {
      data,
      loading,
      columns,
      fieldName,
      defaultPageSize,
      fetchMore,
      children,
      ...attributes
    } = this.props;
    const { pageSize } = this.state;
    const resource: ListType<T> = data[fieldName];

    let numPages = 1;
    let tableData: T[] = [];
    if (resource != null) {
      numPages = Math.ceil(resource.totalCount / pageSize);
      tableData = resource.results;
    }

    // Don't allow the table to request a refetch if loading
    const onFetchData = loading
      ? () => Promise.resolve()
      : this.handleTableChange;

    return (
      <ReactTable
        className="-striped -highlight"
        columns={columns}
        data={tableData}
        filterable={true}
        defaultPageSize={pageSize}
        manual={true}
        pages={numPages}
        loading={loading}
        onFetchData={onFetchData}
        {...attributes}
      />
    );
  }
}