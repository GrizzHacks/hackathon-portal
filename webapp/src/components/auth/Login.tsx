import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { ExpandMore, Error } from "@material-ui/icons";
import firebase from "firebase";
import React, { Fragment } from "react";
import { firebaseApp as FirebaseAppGlobal } from "../../config/firebaseConfig";

declare interface LoginBoxProps {
  firebaseApp?: firebase.app.App;
}

const LoginBox: React.FunctionComponent<LoginBoxProps> = ({ firebaseApp }) => {
  const firebaseAppLocal = firebaseApp ? firebaseApp : FirebaseAppGlobal;
  const [temp, setTemp] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [errorText, setErrorText] = React.useState<string>("");

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
          console.log(methods);
          if (methods.length > 0) {
            setEmail(email.toLowerCase());
            setTemp("");
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
          console.log("Signed In Successfully!");
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

  const handleChangeEmail = () => {
    setErrorText("");
    setTemp("");
    setEmail("");
  };

  return (
    <Fragment>
      <Card>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4">{!email ? "Sign in" : "Hi"}</Typography>
          </Grid>
          {!!email && (
            <Grid item xs={12}>
              <Chip
                variant="outlined"
                avatar={
                  <Avatar alt="Andrew" src="/static/images/avatar/1.jpg" />
                }
                label={email}
                onClick={handleChangeEmail}
                onDelete={handleChangeEmail}
                deleteIcon={<ExpandMore />}
              />
            </Grid>
          )}
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
                onClick={() => {}}
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
        </Grid>
      </Card>
    </Fragment>
  );
};

export default LoginBox;
