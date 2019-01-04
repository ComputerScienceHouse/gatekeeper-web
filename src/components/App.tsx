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

/** @jsx jsx */
import { Route } from "react-router-dom";
import { spring, AnimatedSwitch } from "react-router-transition";
import { Container } from "reactstrap";
import { IconContext } from "react-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsx, css, Global, ClassNames } from "@emotion/core";
import Dashboard from "../pages/Dashboard/index";
import Users from "../pages/Users/index";
import UpdateUser from "../pages/Users/update";
import Groups from "../pages/Groups/index";
import UpdateGroup from "../pages/Groups/update";
import AccessPoints from "../pages/AccessPoints/index";
import UpdateAccessPoint from "../pages/AccessPoints/update";
import Realms from "../pages/Realms/index";
import UpdateRealm from "../pages/Realms/update";
import Settings from "../pages/Settings/index";
import Header from "./Header/index";

const globalStyle = css`
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
  <ClassNames>
    {({ css: styles }) => {
      const globalIconStyle = styles`
        margin-right: 5px;
        position: relative;
        bottom: 1px;
      `;

      const toastStyle = styles`
        min-height: initial;
        padding: 10px;
      `;

      return (
        <IconContext.Provider value={{ className: globalIconStyle }}>
          <Global styles={globalStyle}/>
          <Header/>
          <Container css={containerStyle}>
            <AnimatedSwitch {...transition} css={switchStyle}>
              <Route exact={true} path="/" component={Dashboard}/>
              <Route exact={true} path="/users" component={Users}/>
              <Route path="/users/:id" component={UpdateUser}/>
              <Route exact={true} path="/groups" component={Groups}/>
              <Route path="/groups/:id" component={UpdateGroup}/>
              <Route exact={true} path="/access-points" component={AccessPoints}/>
              <Route path="/access-points/:id" component={UpdateAccessPoint}/>
              <Route exact={true} path="/realms" component={Realms}/>
              <Route path="/realms/:id" component={UpdateRealm}/>
              <Route exact={true} path="/settings" component={Settings}/>
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
    }}
  </ClassNames>
);

export default App;
