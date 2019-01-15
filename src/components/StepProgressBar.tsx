import React from "react";
import { ProgressBar, Step, StepContext } from "react-step-progress-bar";
import { ThemeProp } from "../interfaces/Theme";
import styled from "@emotion/styled";
import range from "lodash/range";
import clamp from "lodash/clamp";

const ProgressBarContainer = styled.div`
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  
  & .RSPBprogression {
    background: ${(props: ThemeProp) => props.theme!.colors.info};
  } 
`;

type IndexedStepProps = ThemeProp & {
  accomplished: boolean;
}

const IndexedStep = styled.div`
  color: white;
  width: 20px;
  height: 20px;
  font-size: 12px;
  background-color: ${(props: IndexedStepProps) => props.accomplished ? props.theme!.colors.info : props.theme!.colors.light};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface StepProgressBarProps {
  steps: number;
  current: number;
}

const stepBody = ({ accomplished, index }: StepContext) => (
  <IndexedStep accomplished={accomplished}>
    {index + 1}
  </IndexedStep>
);

const StepProgressBar = ({ steps, current }: StepProgressBarProps) => {
  const percent = clamp(((current - 1) / (steps - 1) * 100) + 1, 0, 100);

  return (
    <ProgressBarContainer>
      <ProgressBar percent={percent}>
        {range(steps).map((idx) => (
          <Step
            accomplished={idx < current}
            position={idx}
            index={idx}
            key={idx}
          >
            {stepBody}
          </Step>
        ))}
      </ProgressBar>
    </ProgressBarContainer>
  );
};

export default StepProgressBar;