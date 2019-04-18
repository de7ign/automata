import React from "react";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import "./App.css";
import Workspace from "./components/workspace/Workspace";
import PreAlphaNotice from "./components/preAlpha/PreAlphaNotice";

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
