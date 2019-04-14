import React, { Component } from "react";
import List from "@material-ui/core/List";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

class TemporaryDrawer extends Component {
  state = {
    open: false,
    selectedModeKey: 0,
    selectedLinkKey: null
  };

  toggleDrawer = () => {
    this.setState(prevState => ({ open: !prevState.open }));
  };

  handleModeListItemClick = (event, key) => {
    this.setState({ selectedModeKey: key, selectedLinkKey: null });
  };

  handleLinkListItemClick = (event, key) => {
    this.setState({ selectedLinkKey: key, selectedModeKey: null });
  };

  render() {
    const sideList = (
      <div style={{ width: 250 }}>
        <List>
          {[
            ["DFA", 1],
            ["NFA", 2],
            ["NFA to DFA", 3],
            ["ENFA to NFA", 4],
            ["DFA Minimization", 5]
          ].map(([value, key]) => {
            const { selectedModeKey } = this.state;
            return (
              <ListItem
                key={key}
                button
                selected={selectedModeKey === key}
                onClick={event => this.handleModeListItemClick(event, key)}
              >
                <ListItemText primary={value} />
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <List>
          {[
            ["Examples", 1],
            ["Tutorial", 2],
            ["GitHub", 3],
            ["Feedback", 4]
          ].map(([value, key]) => {
            const { selectedLinkKey } = this.state;
            return (
              <ListItem
                key={key}
                button
                selected={selectedLinkKey === key}
                onClick={event => this.handleLinkListItemClick(event, key)}
              >
                <ListItemText primary={value} />
              </ListItem>
            );
          })}
        </List>
      </div>
    );
    const { open } = this.state;
    return (
      <div>
        <Drawer open={open} onClose={this.toggleDrawer}>
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
    );
  }
}

export default TemporaryDrawer;
