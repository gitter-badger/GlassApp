import * as React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { SimModel } from "../models/sim";
import { useInterval } from "../utils/react";
import AppView from "./AppView";

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
            <AppView />
        </React.Fragment>
    );
}
