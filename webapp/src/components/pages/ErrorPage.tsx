import { Typography } from "@material-ui/core";
import React, { Fragment } from "react";

declare interface ErrorPageProps {
  errorCode?: number;
  errorMessage: string;
  errorDescription?: string;
}

const ErrorPage: React.FunctionComponent<ErrorPageProps> = ({
  errorCode,
  errorMessage,
  errorDescription,
}) => {
  return (
    <Fragment>
      <Typography variant="h3">
        Error{errorCode !== undefined ? ` ${errorCode}` : ""}!
      </Typography>
      <Typography variant="h4">{errorMessage}</Typography>
      {errorDescription && (
        <Typography variant="body1">{errorDescription}</Typography>
      )}
    </Fragment>
  );
};

export default ErrorPage;
