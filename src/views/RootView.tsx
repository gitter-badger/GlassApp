import * as React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import AppView from "./AppView";
import SandboxView from "./SandboxView";

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
  }
`;

export default function RootView(): JSX.Element {
    return (
        <React.Fragment>
            <GlobalStyle />
            <Router>
                <Switch>
                    <Route path="/sandbox">
                        <SandboxView />
                    </Route>
                    <Route path="/">
                        <AppView />
                    </Route>
                </Switch>
            </Router>
        </React.Fragment>
    );
}
