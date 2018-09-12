import * as React from "react";
import { Route } from "react-router-dom";
import { spring, AnimatedSwitch } from "react-router-transition";
import { Container } from "reactstrap";
import { IconContext } from "react-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { css, injectGlobal } from "emotion";
import Dashboard from "../pages/Dashboard/index";
import Users from "../pages/Users/index";
import UpdateUser from "../pages/Users/update";
import Groups from "../pages/Groups/index";
import UpdateGroup from "../pages/Groups/update";
import AccessPoints from "../pages/AccessPoints/index";
import UpdateAccessPoint from "../pages/AccessPoints/update";
import Header from "./Header/index";

// tslint:disable-next-line no-unused-expression
injectGlobal`
  body {
    margin: 0;
    padding: 54.5px 0 0;
  }

  h2 {
    margin-bottom: 20px;
  }
`;

const containerStyle = css`
  margin-top: 20px;
`;

const switchStyle = css`
  position: relative;
  
  & > div {
    position: absolute;
    width: 100%;
    overflow-y: auto;
  }
`;

const globalIconStyle = css`
  margin-right: 5px;
  position: relative;
  bottom: 1px;
`;

const toastStyle = css`
  min-height: initial;
  padding: 10px;
`;

function glide(val: number) {
  return spring(val, {
    stiffness: 174,
    damping: 19
  });
}

const transition = {
  atEnter: {
    offset: 200,
    opacity: 0
  },
  atLeave: {
    offset: glide(-100),
    opacity: glide(0)
  },
  atActive: {
    offset: glide(0),
    opacity: glide(1)
  },
  mapStyles: (styles: { opacity: string, offset: string }) => ({
    opacity: styles.opacity,
    transform: `translateX(${styles.offset}px)`
  })
};

const App = () => (
  <IconContext.Provider value={{ className: globalIconStyle }}>
    <Header/>
    <Container className={containerStyle}>
      <AnimatedSwitch {...transition} className={switchStyle}>
        <Route exact={true} path="/" component={Dashboard}/>
        <Route exact={true} path="/users" component={Users}/>
        <Route path="/users/:id" component={UpdateUser}/>
        <Route exact={true} path="/groups" component={Groups}/>
        <Route path="/groups/:id" component={UpdateGroup}/>
        <Route exact={true} path="/access-points" component={AccessPoints}/>
        <Route path="/access-points/:id" component={UpdateAccessPoint}/>
      </AnimatedSwitch>
    </Container>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={true}
      closeButton={false}
      bodyClassName={toastStyle}
    />
  </IconContext.Provider>
);

export default App;
