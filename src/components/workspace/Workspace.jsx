import React from "react";
import { Paper, Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Network, DataSet } from "vis";

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  },
  paper: {
    padding: theme.spacing.unit
  },
  divCanvas: {
    height: window.innerHeight * 0.8,
    [theme.breakpoints.down("md")]: {
      height: window.innerHeight * 0.7
    }
  },
  divUtil: {
    height: window.innerHeight * 0.8,
    [theme.breakpoints.down("md")]: {
      height: window.innerHeight * 0.3
    }
  }
});

const nodes = new DataSet([
  { id: 1, label: "Node 1" },
  { id: 2, label: "Node 2" },
  { id: 3, label: "Node 3" },
  { id: 4, label: "Node 4" },
  { id: 5, label: "Node 5" }
]);

const edges = new DataSet([
  { from: 1, to: 3 },
  { from: 1, to: 2 },
  { from: 2, to: 4 },
  { from: 2, to: 5 }
]);

const data = {
  nodes,
  edges
};

const options = {};

class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.network = {};
    this.visRef = React.createRef();
  }

  componentDidMount() {
    this.network = new Network(this.visRef, data, options);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={16}>
          <Grid item lg={9} xs={12}>
            <Paper className={classes.paper} elevation={12}>
              <div
                ref={ref => {
                  this.visRef = ref;
                }}
                className={classes.divCanvas}
              />
            </Paper>
          </Grid>
          <Grid item lg={3} xs={12}>
            <Paper className={classes.paper} elevation={12}>
              <div className={classes.divUtil}>tools</div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Workspace.propTypes = {
  classes: PropTypes.shape().isRequired
};

export default withStyles(styles)(Workspace);
