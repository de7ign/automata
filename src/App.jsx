import React, { StrictMode } from "react";
import "./App.css";
import ReactGA from "react-ga";
import Header from "./components/header/Header";
import Workspace from "./components/workspace/Workspace";
import Notice from "./components/notice/Notice";
import Footer from "./components/footer/Footer";
import MuiSnackbar from "./components/snackbar/MuiSnackbar";

class App extends React.Component {
  muiSnackbarRef = React.createRef();

  componentDidMount() {
    ReactGA.initialize("UA-138685124-2");
    ReactGA.pageview(window.location.pathname);
  }

  /**
   * Displays the snackbar notification
   *
   * @param {String} variant - error, warning, info, success
   * @param {String} message - The notification message
   */
  displaySnackbar = (variant, message) => {
    this.muiSnackbarRef.current.openSnackbar(variant, message);
  };

  render() {
    return (
      <StrictMode>
        <div className="App">
          <Header />
          <Workspace notification={this.displaySnackbar} />
          <Notice />
          <Footer />
          <MuiSnackbar ref={this.muiSnackbarRef} />
        </div>
      </StrictMode>
    );
  }
}

export default App;
