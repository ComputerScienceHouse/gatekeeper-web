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
import styled from "@emotion/styled";
import gravatar from "gravatar";

interface AvatarProps {
  email: string;
  size: number;
  className?: string;
}

class Avatar extends React.Component<AvatarProps> {
  public render() {
    const { email, size, ...attributes } = this.props;

    return (
      <img
        src={gravatar.url(email, { s: size.toString(), d: "mp" })}
        aria-hidden={true}
        {...attributes}
      />
    );
  }
}

export default styled(Avatar)`
  border-radius: 50%;
`;