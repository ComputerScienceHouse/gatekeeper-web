import React from "react";
import { Query, QueryResult } from "react-apollo";
import { Alert } from "reactstrap";
import gql from "graphql-tag";
import { ListType, NodeResult } from "../../../../../interfaces/graphql";
import { Realm } from "../../../../../interfaces/models";
import TagRealmSelect from "./TagRealmSelect";
import Loader from "../../../../../components/Loader";

const query = gql`
  query TagRealmSelectQuery {
    allRealms {
      totalCount
      results {
        id
        name
      }
    }
  }
`;

interface TagRealmSelectQueryProps {
  onSelect?: (selected: string[]) => void;
}

const TagRealmSelectQuery = (props: TagRealmSelectQueryProps) => (
  <Query query={query}>
    {({ loading, error, data }: QueryResult<NodeResult<ListType<Realm>>>) => {
      if (error) {
        throw error; // Will be caught by error boundary
      }

      if (loading) {
        return <Loader/>;
      }

      if (data == null || data.allRealms.totalCount < 1) {
        return (
          <Alert color="warning">
            You must create at least one Realm before issuing a tag.
          </Alert>
        );
      }

      const options = data.allRealms.results.map((realm: Realm) => ({
        label: realm.name,
        value: realm.id
      }));

      return (
        <TagRealmSelect
          available={options}
          {...props}
        />
      );
    }}
  </Query>
);

export default TagRealmSelectQuery;