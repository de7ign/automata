import React, { Component } from 'react';
import { AppBar, Typography } from '@material-ui/core';

class Header extends Component {
  render() {
    return (
      <AppBar position="static">
        <Typography variant="headline" color="inherit">Header</Typography>
      </AppBar>
    )
  }
}

export default Header