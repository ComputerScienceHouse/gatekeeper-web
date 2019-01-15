import React from "react";
import styled from "@emotion/styled";
import { Progress, ProgressProps } from "reactstrap";

const TagProgressContainer = styled.div`
  text-align: center;
`;

const TagProgressLabel = styled.h4`
  padding: 0.5rem;
`;

type TagProgressProps = ProgressProps & {
  message: string;
  indefinite?: boolean;
  percentage?: number;
}

const HelperTaskProgress = ({ message, indefinite = false, percentage, ...opts }: TagProgressProps) => (
  <TagProgressContainer>
    <TagProgressLabel>{message}</TagProgressLabel>
    <Progress
      animated={indefinite}
      value={indefinite ? 100 : percentage}
      {...opts}
    />
  </TagProgressContainer>
);

export default HelperTaskProgress;