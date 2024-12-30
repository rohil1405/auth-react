import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom"; 
import NotFound from "./NotFound"; 

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Link: jest.fn(({ children, to }) => (
    <a href={to}>{children}</a>
  )),
}));

describe("NotFound component", () => {
  test("renders the '404' text", () => {
    render(
      <Router>
        <NotFound />
      </Router>
    );
    const titleElement = screen.getByText(/404/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("renders 'Page Not Found' text", () => {
    render(
      <Router>
        <NotFound />
      </Router>
    );
    const contentElement = screen.getByText(/Page Not Found/i);
    expect(contentElement).toBeInTheDocument();
  });

  test("renders all logos images", () => {
    render(
      <Router>
        <NotFound />
      </Router>
    );
    const logoOne = screen.getByAltText(/logo-one/i);
    const logoMain = screen.getByAltText(/main-logo/i);
    const logoTwo = screen.getByAltText(/logo-two/i);
    expect(logoOne).toBeInTheDocument();
    expect(logoMain).toBeInTheDocument();
    expect(logoTwo).toBeInTheDocument();
  });

  test("renders the icon image", () => {
    render(
      <Router>
        <NotFound />
      </Router>
    );
    const iconImage = screen.getByAltText(/icon/i);
    expect(iconImage).toBeInTheDocument();
  });
});
