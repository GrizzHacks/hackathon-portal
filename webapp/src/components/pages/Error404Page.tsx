import React from "react";
import ErrorPage from "./ErrorPage";

const Error404Page: React.FunctionComponent = () => {
  return (
    <ErrorPage
      errorCode={404}
      errorMessage="Unable to find the page you are looking for."
      errorDescription="Unless, of course, you are looking for an error page. In which case,
great job! You found it!"
    />
  );
};

export default Error404Page;
