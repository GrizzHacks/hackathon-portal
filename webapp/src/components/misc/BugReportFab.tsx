import { createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import BugReportIcon from "@material-ui/icons/BugReport";
import React from "react";

declare interface BugReportFabProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: "fixed",
      bottom: "0px",
      right: "0px",
      margin: theme.spacing(2),
    },
  })
);

const BugReportFab: React.FunctionComponent<BugReportFabProps> = () => {
  const classes = useStyles();

  return (
    <Fab
      color="primary"
      onClick={() => {
        window.open(
          "https://github.com/GrizzHacks/hackathon-portal/issues",
          "_blank"
        );
      }}
      className={classes.fab}
    >
      <BugReportIcon />
    </Fab>
  );
};

export default BugReportFab;
