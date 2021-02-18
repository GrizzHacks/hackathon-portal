import {
  Button,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { Input as kyInput, Options as kyOptions } from "ky";
import React from "react";
import { ApiExplorerFirebaseApp } from "./apiExplorerFirebaseConfig";
import ApiClient from "../helper/ApiClient";

const ApiExplorer: React.FunctionComponent = () => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [endpoint, setEndpoint] = React.useState<string>("");
  const [requestBody, setRequestBody] = React.useState<string>("");
  const [status, setStatus] = React.useState<number | string>("");
  const [responseBody, setResponseBody] = React.useState<string>("");

  const apiClient = new ApiClient(ApiExplorerFirebaseApp);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleEndpointChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndpoint(event.target.value);
  };

  const handleRequestBodyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRequestBody(event.target.value);
  };

  const makeRequest = (
    apiClientFunction: (url: kyInput, options?: kyOptions) => Promise<Response>,
    sendBody: boolean = true
  ) => {
    setStatus("Pending response...");
    setResponseBody("");
    if (email) {
      ApiExplorerFirebaseApp.auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          makeRequestHelper(apiClientFunction, sendBody);
        })
        .catch((err) => {
          makeRequestHelper(apiClientFunction, sendBody, err);
        });
    } else {
      makeRequestHelper(
        apiClientFunction,
        sendBody,
        "No email specified, treating the user as PUBLIC."
      );
    }
  };

  const makeRequestHelper = (
    apiClientFunction: (url: kyInput, options?: kyOptions) => Promise<Response>,
    sendBody: boolean,
    authError?: any
  ) => {
    apiClientFunction(endpoint, {
      body: sendBody ? requestBody : undefined,
    }).then((response) => {
      if (!authError) {
        ApiExplorerFirebaseApp.auth().signOut();
      }
      if (response) {
        setStatus(response.status);
        response.text().then((text) => {
          setResponseBody(
            !authError
              ? text
              : text +
                  "\n\nNOTE: This request was made with an authorizaton error:\n" +
                  authError.toString()
          );
        });
      } else {
        setStatus("");
        setResponseBody(
          "Response was `undefined`. This is likely due to a timeout with no response sent back from the API."
        );
      }
    });
  };

  return (
    <Container>
      <Typography variant="h3">Hackathon Portal API Explorer</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Authentication</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email"
                value={email}
                onChange={handleEmailChange}
                variant="outlined"
                fullWidth
              ></TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Password"
                value={password}
                onChange={handlePasswordChange}
                variant="outlined"
                fullWidth
              ></TextField>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Request Parameters</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Endpoint"
                value={endpoint}
                onChange={handleEndpointChange}
                variant="outlined"
                fullWidth
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Request Body"
                value={requestBody}
                onChange={handleRequestBodyChange}
                variant="outlined"
                fullWidth
                multiline
              ></TextField>
            </Grid>
            <Grid item xs={3}>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={() => {
                  makeRequest(apiClient.get, false);
                }}
              >
                GET
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={() => {
                  makeRequest(apiClient.post);
                }}
              >
                POST
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={() => {
                  makeRequest(apiClient.patch);
                }}
              >
                PATCH
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={() => {
                  makeRequest(apiClient.delete);
                }}
              >
                DELETE
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Response</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Status"
                value={status}
                disabled
                variant="outlined"
                fullWidth
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Response Body"
                value={responseBody}
                disabled
                variant="outlined"
                fullWidth
                multiline
              ></TextField>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ApiExplorer;
