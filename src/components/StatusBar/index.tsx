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

import React from "react";
import AccessPoints from "./AccessPoints";
import AdminHelper from "./AdminHelper";
import styled from "@emotion/styled";
import { FaBolt } from "react-icons/fa";

const StatusBarContainer = styled.div`
  width: 100%;

  & > *:not(:first-child) {
    margin-left: 10px;
  }
`;

const StatusLabel = styled.span`
  margin-right: 10px;

  & > svg {
    margin-right: 2px;
  }
`;

const StatusBarRight = styled.div`
  float: right;
`;

const StatusBar = () => (
  <StatusBarContainer>
    <StatusLabel>
      <FaBolt/>
      Status
    </StatusLabel>
    <AccessPoints/>
    <StatusBarRight>
      <AdminHelper/>
    </StatusBarRight>
  </StatusBarContainer>
);

export default StatusBar;