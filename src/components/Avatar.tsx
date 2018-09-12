import React from "react";
import styled from "react-emotion";
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