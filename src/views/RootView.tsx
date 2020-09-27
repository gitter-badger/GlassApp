import * as React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { SimDataModel } from "../models/SimDataModel";
import { useInterval } from "../utils/react";
import AppView from "./AppView";

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
  }
`;

export default function RootView(): JSX.Element {
    return (
        <React.Fragment>
            <GlobalStyle />
            <AppView />
        </React.Fragment>
    );
}
