import { render } from "@testing-library/react";
import React from "react";
import CustomThemeProvider from "./styles/CustomThemeProvider";

test("renders learn react link", () => {
  render(<CustomThemeProvider />);
  // Dummy test to confirm that it basically builds.
  // TODO: update once we have a home page...
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});
