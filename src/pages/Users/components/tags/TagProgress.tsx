import React from "react";
import styled from "@emotion/styled";
import { Progress } from "reactstrap";

const TagProgressContainer = styled.div`
  text-align: center;
`;

const TagProgressLabel = styled.h4`
  padding: 0.5rem;
`;

interface TagProgressProps {
  message: string;
  indefinite?: boolean;
  percentage?: number;
}

const TagProgress = ({ message, indefinite = false, percentage }: TagProgressProps) => (
  <TagProgressContainer>
    <TagProgressLabel>{message}</TagProgressLabel>
    <Progress animated={indefinite} value={indefinite ? 100 : percentage}/>
  </TagProgressContainer>
);

export default TagProgress;