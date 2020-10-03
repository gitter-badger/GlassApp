import "core-js/stable";
import "regenerator-runtime/runtime";

import "./jank";
import "./map.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import RootView from "./views/RootView";

ReactDOM.render(<RootView />, document.getElementById("root"));
