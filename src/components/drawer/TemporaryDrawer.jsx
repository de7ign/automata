import React, { Component } from "react";
import List from "@material-ui/core/List";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  list: {
    width: 250
  }
};

class TemporaryDrawer extends Component {
  state = {
    open: false,
    selectedModeKey: 0,
    selectedLinkKey: null
  };

  handleToggleDrawer = () => {
    this.setState(prevState => ({ open: !prevState.open }));
  };

  handleModeListItemClick = (event, key) => {
    this.setState({ selectedModeKey: key, selectedLinkKey: null });
  };

  handleLinkListItemClick = (event, key) => {
    this.setState({ selectedLinkKey: key, selectedModeKey: null });
  };

  render() {
    const { classes } = this.props;
    const { open, selectedModeKey, selectedLinkKey } = this.state;

    const sideList = (
      <div className={classes.list}>
        <List>
          {[
            ["DFA", 1],
            ["NFA", 2],
            ["NFA to DFA", 3],
            ["ENFA to NFA", 4],
            ["DFA Minimization", 5]
          ].map(([value, key]) => {
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

    return (
      <div>
        <Drawer open={open} onClose={this.handleToggleDrawer}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.handleToggleDrawer}
            onKeyDown={this.handleToggleDrawer}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}

TemporaryDrawer.propTypes = {
  classes: PropTypes.shape().isRequired
};

export default withStyles(styles)(TemporaryDrawer);
