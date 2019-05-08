import React from "react";
import {
  Typography,
  Grid,
  Paper,
  withStyles,
  Tooltip,
  IconButton
} from "@material-ui/core";
import { Mail, InsertDriveFile, Language } from "@material-ui/icons";
import PropTypes from "prop-types";

const styles = theme => ({
  root: {
    backgroundColor: "#4D4D4D",
    color: "#ffffff"
  },
  container: {
    padding: theme.spacing.unit * 8,
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing.unit * 3,
      marginLeft: theme.spacing.unit
    }
  },
  title: {
    marginBottom: theme.spacing.unit * 2
  },
  about: {
    color: "#ffffff",
    paddingBottom: theme.spacing.unit,
    textAlign: "center"
  },
  icons: {
    color: "#ffffff"
  }
});

const Footer = props => {
  const { classes } = props;
  const icons = [
    [
      <Tooltip title="website" className={classes.icons}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://nihalmurmu.me"
        >
          <IconButton color="inherit">
            <Language />
          </IconButton>
        </a>
      </Tooltip>
    ],
    [
      <Tooltip title="mail" className={classes.icons}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="mailto:nhlmrm@gmail.com"
        >
          <IconButton color="inherit">
            <Mail />
          </IconButton>
        </a>
      </Tooltip>
    ],
    [
      <Tooltip title="twitter" className={classes.icons}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://twitter.com/nihalmurmu"
        >
          <IconButton color="inherit">
            <ion-icon name="logo-twitter" />
          </IconButton>
        </a>
      </Tooltip>
    ],
    [
      <Tooltip title="linkedin" className={classes.icons}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://linkedin.com/in/nihalmurmu"
        >
          <IconButton color="inherit">
            <ion-icon name="logo-linkedin" />
          </IconButton>
        </a>
      </Tooltip>
    ],
    [
      <Tooltip title="github" className={classes.icons}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/nihalmurmu"
        >
          <IconButton color="inherit">
            <ion-icon name="logo-github" />
          </IconButton>
        </a>
      </Tooltip>
    ],
    [
      <Tooltip title="resume" className={classes.icons}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://nihalmurmu.me/resume.pdf"
        >
          <IconButton color="inherit">
            <InsertDriveFile />
          </IconButton>
        </a>
      </Tooltip>
    ]
  ];

  return (
    <Paper elevation={0} square className={classes.root}>
      <Grid container className={classes.container}>
        <Grid item lg={3} md={3} />
        <Grid item lg={9} md={9} xs={12} className={classes.title}>
          <Typography variant="h5" component="h3" color="inherit">
            Quick Links
          </Typography>
        </Grid>

        <Grid item lg={3} md={3} />
        <Grid item lg={3} md={3} xs={12}>
          <Typography variant="subtitle1">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/nihalmurmu/Automata"
              style={{ textDecoration: "none", color: "white" }}
            >
              Github
            </a>
          </Typography>
        </Grid>
        <Grid item lg={3} md={3} xs={12}>
          <Typography variant="subtitle1">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/nihalmurmu/Automata"
              style={{ textDecoration: "none", color: "white" }}
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
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/nihalmurmu/Automata"
              style={{ textDecoration: "none", color: "white" }}
            >
              Tutorial
            </a>
          </Typography>
        </Grid>
        <Grid item lg={3} md={3} xs={12}>
          <Typography variant="subtitle1">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/nihalmurmu/Automata"
              style={{ textDecoration: "none", color: "white" }}
            >
              Any suggestion?
            </a>
          </Typography>
        </Grid>
        <Grid item lg={3} md={3} />
      </Grid>

      <div className={classes.about}>
        <Typography variant="overline" color="inherit">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://nihalmurmue.me"
            style={{ textDecoration: "none", color: "white" }}
          >
            &copy; Nihal Murmu 2018-2019
          </a>
        </Typography>
        <Grid container justify="center" spacing={16}>
          {icons.map(value => (
            <Grid item>{value}</Grid>
          ))}
        </Grid>
      </div>
    </Paper>
  );
};

Footer.propTypes = {
  classes: PropTypes.shape().isRequired
};

export default withStyles(styles)(Footer);
