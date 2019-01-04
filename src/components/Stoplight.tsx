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

import styled from "@emotion/styled";

interface StoplightProps {
  ok: boolean;
}

const Stoplight = styled.div`
  height: 10px;
  width: 10px;
  background-color: #${(props: StoplightProps) => (props.ok ? "43ac6a" : "f04124")};
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
`;

export default Stoplight;