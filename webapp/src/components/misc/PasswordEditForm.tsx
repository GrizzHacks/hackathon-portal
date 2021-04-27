import {
  Checkbox,
  Fab,
  FormControlLabel,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from "@material-ui/core";
import { Clear, Done, Edit, Error } from "@material-ui/icons";
import React, { Fragment, ReactNode } from "react";
import { styles } from "../../styles";

declare interface PasswordEditFormProps<T> {
  handleUpdate: (password: string, confirmPassword: string) => void;
  createOnly?: boolean;
  editing: boolean;
  setEditing: (editing: boolean) => void;
}

const PasswordEditForm /* : React.FunctionComponent<PasswordEditFormProps<T>> */ = <
  T,
>({
  handleUpdate,
  createOnly,
  editing,
  setEditing,
}: PasswordEditFormProps<T> & { children?: ReactNode }) => {
  const classes = styles();

  const [password, setPassword] = React.useState<string>("");
  const [errorText, setErrorTest] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [
    confirmPasswordError,
    setConfirmPasswordError,
  ] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const startEditing = () => {
    setEditing(true);
  };

  const passwordIsValid = () => {
    const valid = [true, true];
    if (password.length < 6) {
      setErrorTest("The new password must contain at least 6 characters.");
      valid[0] = false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      valid[1] = false;
    }
    return valid.reduce((reduced, value) => {
      return reduced && value;
    });
  };

  const cancelEditing = () => {
    setErrorTest("");
    setConfirmPasswordError(false);
    setPassword("");
    setConfirmPassword("");
    setEditing(false);
  };

  const saveAttribute = () => {
    setErrorTest("");
    setConfirmPasswordError(false);
    if (passwordIsValid()) {
      handleUpdate(password, confirmPassword);
      setPassword("");
      setConfirmPassword("");
      setEditing(false);
    }
  };

  const handlePasswordValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  return (
    <ListItem key={`edit_display_password`}>
      <ListItemText
        primary="Password"
        secondary={
          editing ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  error={!!errorText}
                  value={password}
                  type={showPassword ? "text" : "password"}
                  onChange={handlePasswordValueChange}
                  variant="outlined"
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  error={confirmPasswordError}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordValueChange}
                  variant="outlined"
                  helperText={
                    confirmPasswordError && (
                      <Fragment>
                        <Error fontSize="inherit" />
                        {
                          " The new password and the confirmation password do not match."
                        }
                      </Fragment>
                    )
                  }
                />
              </Grid>
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
            </Grid>
          ) : (
            "********"
          )
        }
      />
      {editing && (
        <ListItemIcon className={classes.marginLeft}>
          <Fab
            color="primary"
            size="small"
            onClick={() => {
              saveAttribute();
            }}
          >
            <Done />
          </Fab>
        </ListItemIcon>
      )}

      <ListItemSecondaryAction>
        {editing ? (
          <Fab
            color="primary"
            size="small"
            onClick={() => {
              cancelEditing();
            }}
          >
            <Clear />
          </Fab>
        ) : (
          <Fab
            color="primary"
            size="small"
            onClick={() => {
              startEditing();
            }}
          >
            <Edit />
          </Fab>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default PasswordEditForm;
