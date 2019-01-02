import React, { Component } from 'react';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import './App.css';
import Canvas from './components/canvas/Canvas';
import PreAlphaNotice from './components/preAlpha/PreAlphaNotice';
import Utils from './components/utils/Utils';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div style={{display: "flex", flexDirection: "row"}}>
          <Canvas />
          <Utils />
        </div>
        <PreAlphaNotice />
        <Footer />
      </div>
    );
  }
}

export default App;
