import React from "react";
import { Paper, Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  },
  paper: {
    padding: theme.spacing.unit * 2
  }
});

const Workspace = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Grid container spacing={16}>
        <Grid item lg={9} xs={12}>
          <Paper className={classes.paper}>canvas</Paper>
        </Grid>
        <Grid item lg={3} xs={12}>
          <Paper className={classes.paper}>tools</Paper>
        </Grid>
      </Grid>
    </div>
  );
};

Workspace.propTypes = {
  classes: PropTypes.shape().isRequired
};

export default withStyles(styles)(Workspace);
