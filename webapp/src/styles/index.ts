import { makeStyles, createStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import { lightTheme as light, darkTheme as dark } from "./theme";

// Evaluate these styles and see what ones we still want/need
export const styles = makeStyles((theme: Theme) =>
  createStyles({
    padded: {
      padding: theme.spacing(2),
    },
    margined: {
      margin: theme.spacing(2),
    },
    marginedTopBottom: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    marginedPadded: {
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
    marginLeft: {
      marginLeft: theme.spacing(2),
    },
    marginRight: {
      marginRight: theme.spacing(2),
    },
    profileAvatarContainer: {
      width: "100%",
    },
    marginsAuto: {
      margin: "auto",
    },
    profileViewEditGrid: {
      padding: 0,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    profileEditImageButton: {
      marginTop: "-60px",
    },
    centerText: {
      textAlign: "center",
    },
    pageTitle: {
      padding: theme.spacing(2),
      textAlign: "center",
    },
    outlined: {
      borderStyle: "solid",
      borderWidth: theme.spacing(0.5),
      borderColor: theme.palette.warning.main,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  })
);

export const lightTheme = light;
export const darkTheme = dark;
