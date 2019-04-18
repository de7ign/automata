import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2
  }
});

const PreAlphaNotice = props => {
  const { classes } = props;
  return (
    <Card className={classes.root} id="notice" elevation={12}>
      <CardContent>
        <Typography variant="title" gutterBottom>
          Pre-Alpha Release
        </Typography>
        <Typography variant="body1">
          Application is in pre-alpha phase
          <br />
          This web application is currently in the stages of its development.
          <br />
          It has some quirks and many parts are not yet available.
          <br />
          We are working hard to finalize the Application&apos;s structure, and
          roughly once every two weeks we roll out new functionality towards
          this goal.
          <br />
          Until then you may notice that some resources move or even disappear
          for a while.
        </Typography>
      </CardContent>
    </Card>
  );
};

PreAlphaNotice.propTypes = {
  classes: PropTypes.shape().isRequired
};

export default withStyles(styles)(PreAlphaNotice);
