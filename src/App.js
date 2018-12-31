import React, { Component } from 'react';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import './App.css';
import Canvas from './components/canvas/Canvas';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Canvas />
        <Footer />
      </div>
    );
  }
}

export default App;
