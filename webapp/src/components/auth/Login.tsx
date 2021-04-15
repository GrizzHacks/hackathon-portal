import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Chip,
  Container,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { ExpandMore, Error } from "@material-ui/icons";
import firebase from "firebase";
import React, { Fragment } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { firebaseApp as FirebaseAppGlobal } from "../../config/firebaseConfig";
import { styles } from "../../styles";
import qs from "qs";
import { apiClient } from "../../helper";

declare interface LoginBoxProps {
  firebaseApp?: firebase.app.App;
}

const LoginBox: React.FunctionComponent<LoginBoxProps> = ({ firebaseApp }) => {
  const classes = styles();
  const firebaseAppLocal = firebaseApp ? firebaseApp : FirebaseAppGlobal;
  const routeLocation = useLocation();
  const routeHistory = useHistory();

  const [temp, setTemp] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [errorText, setErrorText] = React.useState<string>("");
  const [passwordReset, setPasswordReset] = React.useState<boolean>(false);
  const [profile, setProfile] = React.useState<URMMinimalProfile | undefined>(
    undefined
  );

  const getRedirectUrl = () => {
    const redirect = qs.parse(routeLocation.search.substr(1)).redirect;
    return typeof redirect === "string" ? redirect : "/";
  };

  const handleSubmit = () => {
    setErrorText("");
    if (!email) {
      handleSubmitEmail(temp);
    } else {
      handleSubmitPassword(temp);
    }
  };

  const handleSubmitEmail = (email: string) => {
    if (!!email) {
      firebaseAppLocal
        .auth()
        .fetchSignInMethodsForEmail(email)
        .then((methods) => {
          if (methods.length > 0) {
            apiClient
              .post("urm/profiles-by-email", {
                body: JSON.stringify({ email }),
              })
              .then((response) => {
                response
                  .json()
                  .then((responseJson) => {
                    setProfile(responseJson as URMMinimalProfile);
                    setEmail(email.toLowerCase());
                    setTemp("");
                  })
                  .catch((err) => {
                    console.log(err);
                    setErrorText(
                      "Something went wrong. Please try again later."
                    );
                  });
              })
              .catch((err) => {
                console.log(err);
                setErrorText("Something went wrong. Please try again later.");
              });
          } else {
            setErrorText("No account found for that email");
          }
        })
        .catch((err) => {
          if (err.code === "auth/invalid-email") {
            setErrorText("Enter a valid email");
          } else {
            console.log(err);
            setErrorText("Something went wrong. Please try again later.");
          }
        });
    } else {
      setErrorText("Enter an email");
    }
  };

  const handleSubmitPassword = (password: string) => {
    if (!!password) {
      firebaseAppLocal
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          routeHistory.replace(getRedirectUrl());
        })
        .catch((err) => {
          if (err.code === "auth/wrong-password") {
            setErrorText(
              "Wrong password. Try again or click Forgot password to reset it."
            );
          } else {
            console.log(err);
            setErrorText("Something went wrong. Please try again later.");
          }
        });
    } else {
      setErrorText("Enter an password");
    }
  };

  const resetPassword = () => {
    firebaseAppLocal
      .auth()
      .sendPasswordResetEmail(email, { url: getRedirectUrl() });
    setPasswordReset(true);
  };

  const handleChangeEmail = () => {
    setErrorText("");
    setTemp("");
    setEmail("");
  };

  return (
    <Fragment>
      <Card variant="outlined" className={classes.padded}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Container className={classes.pageTitle}>
              <Typography variant="h4">
                {!email ? "Sign in" : `Hi ${profile?.firstName}`}
              </Typography>
              {!!email && (
                <Chip
                  variant="outlined"
                  avatar={
                    <Avatar
                      alt={profile?.firstName.toUpperCase()}
                      src={
                        profile?.photoUrl
                          ? profile.photoUrl
                          : "No Image Defined"
                      }
                    />
                  }
                  label={email.toLowerCase()}
                  onClick={handleChangeEmail}
                  onDelete={handleChangeEmail}
                  deleteIcon={<ExpandMore />}
                />
              )}
            </Container>
          </Grid>
          {!passwordReset ? (
            <Fragment>
              <Grid item xs={12}>
                <TextField
                  error={!!errorText}
                  label={!email ? "Email" : "Enter your password"}
                  type={!email ? "email" : showPassword ? "text" : "password"}
                  fullWidth
                  variant="outlined"
                  value={temp}
                  onChange={(element) => {
                    setTemp(element.target.value);
                  }}
                  onKeyDown={(key) => {
                    if (key.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  helperText={
                    errorText && (
                      <Fragment>
                        <Error fontSize="inherit" />
                        {" " + errorText}
                      </Fragment>
                    )
                  }
                />
              </Grid>
              {!!email && (
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showPassword}
                        onChange={() => {
                          setShowPassword(!showPassword);
                        }}
                        name="showPassword"
                        color="primary"
                      />
                    }
                    label="Show Password"
                  />
                </Grid>
              )}
              <Grid item xs={6}>
                {!!email && (
                  <Button
                    variant="text"
                    fullWidth
                    color="primary"
                    onClick={resetPassword}
                  >
                    Forgot password?
                  </Button>
                )}
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={handleSubmit}
                >
                  Next
                </Button>
              </Grid>
            </Fragment>
          ) : (
            <Container className={classes.centerText}>
              <Typography variant="body1">
                A password reset email has been sent to {email.toLowerCase()}.
              </Typography>
            </Container>
          )}
        </Grid>
      </Card>
    </Fragment>
  );
};

export default LoginBox;
