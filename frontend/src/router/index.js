import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { LastLocationProvider } from "react-router-last-location";
import { routes } from "./RouteList";

const browserHistory = createBrowserHistory();

const Cryptography = React.lazy(() => import("views/Cryptography"));
const NotFound = React.lazy(() => import("views/NotFound"));
const RC4 = React.lazy(() => import("views/RC4"));
const Steganography = React.lazy(() => import("views/Steganography"));
const PublicKey = React.lazy(() => import("views/PublicKey"));

const RouterPath = () => (
  <Router history={browserHistory}>
    <LastLocationProvider watchOnlyPathname={Boolean(true)}>
      <Switch>
        <Route path={routes.root} component={Cryptography} exact />
        <Route path={routes.classic} component={Cryptography} exact />
        <Route path={routes.rc4} component={RC4} exact />
        <Route path={routes.steganography} component={Steganography} exact />
        <Route path={routes.publicKey} component={PublicKey} exact />
        <Route component={NotFound} />
      </Switch>
    </LastLocationProvider>
  </Router>
);

export default RouterPath;
