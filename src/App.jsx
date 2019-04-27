import React from "react";
import "./App.css";
import Header from "./components/header/Header";
import Workspace from "./components/workspace/Workspace";
import PreAlphaNotice from "./components/preAlpha/PreAlphaNotice";
import Footer from "./components/footer/Footer";

const App = () => {
  return (
    <div className="App">
      <Header />
      <Workspace />
      <PreAlphaNotice />
      <Footer />
    </div>
  );
};

export default App;
