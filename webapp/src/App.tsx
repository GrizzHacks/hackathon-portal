import { Container } from "@material-ui/core";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginBox from "./components/auth/Login";
import NavBar from "./components/layouts/NavBar";
import BugReportFab from "./components/misc/BugReportFab";
import LoadingScreen from "./components/misc/LoadingScreen";
import NotificationBar, {
  NotificationMessage,
} from "./components/misc/Notifications";
import Error404Page from "./components/pages/Error404Page";
import Home from "./components/pages/Home";
import ApiExplorer from "./devTools/ApiExplorer";
import { styles } from "./styles";

declare interface AppProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const App: React.FunctionComponent<AppProps> = ({ theme, toggleTheme }) => {
  const classes = styles();

  const [loadingMessage, setLoadingMessage] = React.useState("");
  const [notification, setNotification] = React.useState<NotificationMessage>({
    type: "info",
    message: "",
    open: false,
  });

  return (
    <Router>
      <NavBar
        theme={theme}
        toggleTheme={toggleTheme}
        currentUserProfile={null}
        pageTitle=""
      />
      <Container className={classes.padded}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/api-explorer" component={ApiExplorer} />
          <Route path="/login">
            <LoginBox />
          </Route>
          <Route component={Error404Page} />
        </Switch>
      </Container>
      <LoadingScreen loadingMessage={loadingMessage} />
      <NotificationBar
        notification={notification}
        setNotification={setNotification}
      />
      <BugReportFab />
    </Router>
  );
};

export default App;
