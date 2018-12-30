import React, { Component } from 'react';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import './App.css';
import TemporaryDrawer from './components/drawer/TemporaryDrawer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <TemporaryDrawer />
        <Footer />
      </div>
    );
  }
}

export default App;
