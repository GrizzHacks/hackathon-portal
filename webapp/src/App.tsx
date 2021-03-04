import React, { Fragment } from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import BugReportFab from "./components/misc/BugReportFab";
import ApiExplorer from "./devTools/ApiExplorer";
import Home from "./components/Home";

declare interface AppProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const App: React.FunctionComponent<AppProps> = ({ theme, toggleTheme }) => {
  return (
    <Fragment>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/api" component={ApiExplorer} />
            <Route render={() => <div>404 Not Found</div>} />
          </Switch>
        </div>
      </Router>
      <BugReportFab />
    </Fragment>
  );
};

export default App;
