import { Container } from "@material-ui/core";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginBox from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import NavBar from "./components/layouts/NavBar";
import BugReportFab from "./components/misc/BugReportFab";
import LoadingScreen from "./components/misc/LoadingScreen";
import NotificationBar, {
  NotificationMessage,
} from "./components/misc/Notifications";
import PermissionSwitchComponent from "./components/misc/PermissionSwitchComponent";
import MEWMPages from "./components/modules/mewm";
import PMPages from "./components/modules/pm";
import STPMPages from "./components/modules/stpm";
import URMPages from "./components/modules/urm";
import Error404Page from "./components/pages/Error404Page";
import Home from "./components/pages/Home";
import ProfilePage from "./components/pages/ProfilePage";
import { firebaseApp } from "./config/firebaseConfig";
import ApiExplorer from "./devTools/ApiExplorer";
import { getRandomLoadingMessage } from "./scripts/randomLoadingMessages";
import { styles } from "./styles";

declare interface AppProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const App: React.FunctionComponent<AppProps> = ({ theme, toggleTheme }) => {
  const classes = styles();

  const [loadingMessage, setLoadingMessage] = React.useState(
    getRandomLoadingMessage()
  );
  const [notification, setNotification] = React.useState<NotificationMessage>({
    type: "info",
    message: "",
    open: false,
  });

  // Show a loading message until Firebase Auth loads
  const listener = firebaseApp.auth().onAuthStateChanged(() => {
    // Remove loading message once Firebase Auth loads
    setLoadingMessage("");
    // Only make one update at the beginning
    listener();
  });

  return (
    <Router>
      <NavBar
        theme={theme}
        toggleTheme={toggleTheme}
        pageTitle=""
        setNotification={setNotification}
      />
      <Container className={classes.padded}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/api-explorer" component={ApiExplorer} />
          <Route path="/login">
            <LoginBox setNotification={setNotification} />
          </Route>
          <Route path="/profile">
            <PermissionSwitchComponent
              organizer={<ProfilePage setNotification={setNotification} />}
              sponsor={<ProfilePage setNotification={setNotification} />}
              mentor={<ProfilePage setNotification={setNotification} />}
              volunteer={<ProfilePage setNotification={setNotification} />}
              hacker={<ProfilePage setNotification={setNotification} />}
              setNotification={setNotification}
            />
          </Route>
          <Route path="/logout">
            <Logout setNotification={setNotification} />
          </Route>
          <Route path="/stpm">
            <STPMPages setNotification={setNotification} />
          </Route>
          <Route path="/pm">
            <PMPages setNotification={setNotification} />
          </Route>
          <Route path="/mewm">
            <MEWMPages setNotification={setNotification} />
          </Route>
          <Route path="/urm">
            <URMPages setNotification={setNotification} />
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
