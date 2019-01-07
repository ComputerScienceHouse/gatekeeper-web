// Type definitions for react-step-progress-bar 1.0.3
// Project: https://github.com/pierreericgarcia/react-step-progress-bar
// Definitions by: Steven Mirabito <https://github.com/stevenmirabito>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.2

declare module "react-step-progress-bar" {
  import * as React from "react";

  export interface StepContext {
    accomplished: boolean;
    transitionState: string;
    index: number;
    position: number;
  }

  export interface StepProps {
    accomplished: boolean,
    position: number,
    index: number,
    children: (Object: StepContext) => React.ReactNode,
    transition?: "scale" | "rotate" | "skew",
    transitionDuration?: number,
  }

  export const Step: React.ComponentType<StepProps>;

  export interface ProgressBarProps {
    percent: number,
    children: Array<React.ReactElement<StepProps>> | React.ReactElement<StepProps>;
    stepPositions?: number[],
    unfilledBackground?: string,
    filledBackground?: string,
    width?: number,
    height?: number,
    hasStepZero?: boolean,
    text?: string,
  }

  export const ProgressBar: React.ComponentType<ProgressBarProps>;
}