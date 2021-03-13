import { createMuiTheme } from "@material-ui/core";

export const lightTheme = createMuiTheme({
  palette: {
    primary: undefined,
    secondary: undefined,
    success: undefined,
    error: undefined,
    info: undefined,
    warning: undefined,
  },
});

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: undefined,
    secondary: undefined,
    success: undefined,
    error: undefined,
    info: undefined,
    warning: undefined,
  },
});
