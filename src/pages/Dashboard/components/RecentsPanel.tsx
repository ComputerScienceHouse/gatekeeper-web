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