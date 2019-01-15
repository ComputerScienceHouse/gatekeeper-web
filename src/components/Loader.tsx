import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/core";
import { ThemeProp } from "../interfaces/Theme";

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const Grid = styled.div`
  display: inline-block;
  position: relative;
  width: 4rem;
  height: 4rem;
  
  & *:nth-of-type(1) {
    top: 6px;
    left: 6px;
    animation-delay: 0s;
  }
  
  & *:nth-of-type(2) {
    top: 6px;
    left: 26px;
    animation-delay: -0.4s;
  }

  & *:nth-of-type(3) {
    top: 6px;
    left: 45px;
    animation-delay: -0.8s;
  }

  & *:nth-of-type(4) {
    top: 26px;
    left: 6px;
    animation-delay: -0.4s;
  }

  & *:nth-of-type(5) {
    top: 26px;
    left: 26px;
    animation-delay: -0.8s;
  }

  & *:nth-of-type(6) {
    top: 26px;
    left: 45px;
    animation-delay: -1.2s;
  }

  & *:nth-of-type(7) {
    top: 45px;
    left: 6px;
    animation-delay: -0.8s;
  }

  & *:nth-of-type(8) {
    top: 45px;
    left: 26px;
    animation-delay: -1.2s;
  }

  & *:nth-of-type(9) {
    top: 45px;
    left: 45px;
    animation-delay: -1.6s;
  }
`;

const Dot = styled.div`
  position: absolute;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: ${(props: ThemeProp) => props.theme!.colors.info};
  animation: ${pulse} 1.2s linear infinite;
`;

const Loader = () => (
  <Container>
    <Grid>
      <Dot/>
      <Dot/>
      <Dot/>
      <Dot/>
      <Dot/>
      <Dot/>
      <Dot/>
      <Dot/>
      <Dot/>
    </Grid>
  </Container>
);

export default Loader;