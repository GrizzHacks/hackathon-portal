import React from "react";
import logo from "./logo.svg";
import ApiExplorer from "./devTools/ApiExplorer";

import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import Home from "./components/Home";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/api" component={ApiExplorer} />
          <Route render={() => <div>404 Not Found</div>} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
