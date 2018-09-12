import * as React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {
  Card,
  CardHeader
} from 'reactstrap';

const data = [
  {
    accessPoint: 'Library',
    badgeId: '23ASD2AW',
    name: 'Steven Mirabito',
    result: 'Access Granted',
    timestamp: '06/17/2018 8:37 PM'
  }
];

const columns = [
  {
    Header: 'Timestamp',
    accessor: 'timestamp'
  },
  {
    Header: 'Access Point',
    accessor: 'accessPoint'
  },
  {
    Header: 'Badge ID',
    accessor: 'badgeId'
  },
  {
    Header: 'Name',
    accessor: 'name'
  },
  {
    Header: 'ConnectionResult',
    accessor: 'result'
  }
 ];

const RecentsPanel = () => (
  <Card>
    <CardHeader>Recent Access Attempts</CardHeader>
    <ReactTable
      data={data}
      columns={columns}
      defaultPageSize={10}
    />
  </Card>
);

export default RecentsPanel;