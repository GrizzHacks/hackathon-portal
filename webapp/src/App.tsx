import { Container } from "@material-ui/core";
import React, { Fragment } from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./components/layouts/NavBar";
import BugReportFab from "./components/misc/BugReportFab";
import ErrorPage from "./components/pages/ErrorPage";
import Home from "./components/pages/Home";
import ApiExplorer from "./devTools/ApiExplorer";

declare interface AppProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const App: React.FunctionComponent<AppProps> = ({ theme, toggleTheme }) => {
  return (
    <Fragment>
      <NavBar
        theme={theme}
        toggleTheme={toggleTheme}
        currentUserProfile={null}
        pageTitle=""
      />
      <Container>
        <Router>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/api-explorer" component={ApiExplorer} />
            <Route
              render={() => (
                <ErrorPage
                  errorCode={404}
                  errorMessage="Unable to find the page you are looking for."
                  errorDescription="Unless, of course, you are looking for an error page. In which case,
                  great job! You found it!"
                />
              )}
            />
          </Switch>
        </Router>
      </Container>
      <BugReportFab />
    </Fragment>
  );
};

export default App;
