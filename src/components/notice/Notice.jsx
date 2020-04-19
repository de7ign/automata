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
            How to get started.
          </Typography>
          <hr />
          <Typography variant="body2" gutterBottom>
            &bull; Double click to create a state.
            <br />
            &bull; Double click on a state to make it a final state and
            vice-versa.
            <br />
            &bull; Press and hold down shift button, then click-drag from one
            state to other state you wish to join.
            <br />
            &bull; Select a node/edge, and edit the node label in text field
            above
            <br />
            &bull; Just select the node/edge you want to delete and press
            &apos;delete&apos; key!
          </Typography>
        </CardContent>
      </Card>

      <Card className={classes.root} id="notice" elevation={6}>
        <CardContent>
          <Typography variant="title" gutterBottom>
            Alpha Release
          </Typography>
          <hr />
          <Typography variant="body2">
            This Application is currently in the stages of its active
            development.
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
