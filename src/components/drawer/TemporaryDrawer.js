import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class TemporaryDrawer extends Component {

  state = {
    open: false,
    selectedModeIndex: 0,
    selectedLinkIndex: null
  };

  toggleDrawer = () => {
    this.setState({
      open: !this.state.open
    });
  };

  handleModeListItemClick = (event, index) => {
    this.setState({ selectedModeIndex: index, selectedLinkIndex: null });
  }

  handleLinkListItemClick = (event, index) => {
    this.setState({ selectedLinkIndex: index, selectedModeIndex: null });
  }

  render() {
    const sideList = (
      <div style={{width: 250}}>
        <List>
          {['DFA', 'NFA', 'NFA to DFA', 'ENFA to NFA', 'DFA Minimization'].map((text, index) => (
            <ListItem key={index} button selected={this.state.selectedModeIndex === index} onClick={event => this.handleModeListItemClick(event, index)}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['Examples', 'Tutorial', 'Github', 'Feedback'].map((text, index) => (
            <ListItem key={index} button selected={this.state.selectedLinkIndex === index} onClick={event => this.handleLinkListItemClick(event, index)}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    );

    return (
      <div>
        <Button onClick={this.toggleDrawer}>Open Left</Button>
        <Drawer open={this.state.open} onClose={this.toggleDrawer}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer}
            onKeyDown={this.toggleDrawer}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    )
  }
}

export default TemporaryDrawer;
