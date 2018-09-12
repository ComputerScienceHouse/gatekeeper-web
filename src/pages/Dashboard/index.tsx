import * as React from 'react';
import RecentsPanel from "./components/RecentsPanel";
import StatusPanel from "./components/StatusPanel";

const Dashboard = () => (
  <div>
    <h2>Dashboard</h2>
    <StatusPanel/>
    <RecentsPanel/>
  </div>
);

export default Dashboard;