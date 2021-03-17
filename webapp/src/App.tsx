import { Container, Divider, List } from "@material-ui/core";
import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DetailsEditForm from "./components/layouts/DetailsEditForm";
import NavBar from "./components/layouts/NavBar";
import BugReportFab from "./components/misc/BugReportFab";
import LoadingScreen from "./components/misc/LoadingScreen";
import NotificationBar, {
  NotificationMessage,
} from "./components/misc/Notifications";
import ErrorPage from "./components/pages/ErrorPage";
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
        <List>
          <DetailsEditForm
            attributeName="First Name"
            attributeValue={undefined}
            handleUpdate={() => {}}
            attributeOptions={[
              { label: "True", value: true },
              { label: "False", value: false },
              { label: "None", value: undefined },
            ]}
            classes={classes}
          />
        </List>
        <Divider />
      </Container>
      <LoadingScreen loadingMessage={loadingMessage} />
      <NotificationBar
        notification={notification}
        setNotification={setNotification}
      />
      <BugReportFab />
    </Fragment>
  );
};

export default App;
