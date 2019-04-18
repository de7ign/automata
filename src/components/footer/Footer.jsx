import React from "react";
import { Typography, Grid, Paper } from "@material-ui/core";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  container: {
    padding: theme.spacing.unit * 8,
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing.unit * 3,
      marginLeft: theme.spacing.unit
    }
  },
  title: {
    marginBottom: theme.spacing.unit * 2
  }
});

const Footer = props => {
  const { classes } = props;

  return (
    <Paper elevation={0} square>
      <Grid container className={classes.container}>
        <Grid item lg={3} md={3} />
        <Grid item lg={9} md={9} xs={12} className={classes.title}>
          <Typography variant="h5" component="h3">
            Quick Links
          </Typography>
        </Grid>

        <Grid item lg={3} md={3} />
        <Grid item lg={3} md={3} xs={12}>
          <Typography variant="subtitle1">
            <a
              href="https://github.com/nihalmurmu/Automata"
              style={{ textDecoration: "none", color: "black" }}
            >
              Github
            </a>
          </Typography>
        </Grid>
        <Grid item lg={3} md={3} xs={12}>
          <Typography variant="subtitle1">
            <a
              href="https://github.com/nihalmurmu/Automata"
              style={{ textDecoration: "none", color: "black" }}
            >
              Examples
            </a>
          </Typography>
        </Grid>
        <Grid item lg={3} md={3} />

        <Grid item lg={3} md={3} />
        <Grid item lg={3} md={3} xs={12}>
          <Typography variant="subtitle1">
            <a
              href="https://github.com/nihalmurmu/Automata"
              style={{ textDecoration: "none", color: "black" }}
            >
              Tutorial
            </a>
          </Typography>
        </Grid>
        <Grid item lg={3} md={3} xs={12}>
          <Typography variant="subtitle1">
            <a
              href="https://github.com/nihalmurmu/Automata"
              style={{ textDecoration: "none", color: "black" }}
            >
              Any suggestion?
            </a>
          </Typography>
        </Grid>
        <Grid item lg={3} md={3} />
      </Grid>
    </Paper>
  );
};

Footer.propTypes = {
  classes: PropTypes.shape().isRequired
};

export default withStyles(styles)(Footer);
