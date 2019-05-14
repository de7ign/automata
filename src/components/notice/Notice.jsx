import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography, withStyles } from "@material-ui/core";

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2
  }
});

const Notice = props => {
  const { classes } = props;
  return (
    <div>
      <Card className={classes.root} id="notice" elevation={6}>
        <CardContent>
          <Typography variant="title" gutterBottom>
            How to get hands dirty
          </Typography>
          <Typography variant="body2">Operation on States</Typography>
          <Typography variant="body1" gutterBottom>
            + Double click to create a state.
            <br />
            + Double click on a non-final state to make it a final state.
            <br />
            + Double click on a final state to make it a non-final state.
            <br />
            + Select a node, and edit the node label in text field above
            <br />
          </Typography>
          <Typography variant="body2">Operation on Transition edges</Typography>
          <Typography variant="body1" gutterBottom>
            + Press and hold down shift button, then click-drag from one node to
            other node you wish to join.
            <br />
            + Select a edge, and edit the node label in text field above
            <br />
          </Typography>
          <Typography variant="body2">Delete ?</Typography>
          <Typography variant="body1">
            Just select the object you want to delete and press
            &apos;delete&apos; key!
            <br />
          </Typography>
        </CardContent>
      </Card>

      <Card className={classes.root} id="notice" elevation={6}>
        <CardContent>
          <Typography variant="title" gutterBottom>
            Alpha Release
          </Typography>
          <Typography variant="body1">
            Application is in active development phase
            <br />
            This web application is currently in the stages of its development.
            <br />
            It has some quirks and many parts are not yet available.
            <br />
            We are working hard to finalize the Application&apos;s structure,
            and roughly once every two weeks we roll out new functionality
            towards this goal.
            <br />
            Until then you may notice that some resources move or even disappear
            for a while.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

Notice.propTypes = {
  classes: PropTypes.shape().isRequired
};

export default withStyles(styles)(Notice);
