import * as React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle
} from 'reactstrap';

const StatusPanel = () => (
  <Card>
    <CardHeader>System Status</CardHeader>
    <CardBody>
      <CardTitle>Special Title Treatment</CardTitle>
      <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
    </CardBody>
  </Card>
);

export default StatusPanel;