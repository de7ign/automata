import React from "react";
import { Paper, Grid, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { Network, DataSet, keycharm } from "vis";

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

/*
  all the edges will have the property `smooth: {type: "curvedCW", roundness: 0.0 }` except the node with self edge
  `roundnes: 0.0` gives the edges a straight line.
  increasing the roundness factor will help in the case of where two distinct edges are connecting two same node with different direction
  otherwise edges and its labels will overlap
*/
const edges = new DataSet([
  { from: 1, to: 3, label: "a", smooth: { type: "curvedCW", roundness: 0.0 } },
  { from: 1, to: 2, label: "b", smooth: { type: "curvedCW", roundness: 0.0 } },
  { from: 2, to: 4, label: "c", smooth: { type: "curvedCW", roundness: 0.0 } },
  { from: 2, to: 5, label: "d", smooth: { type: "curvedCW", roundness: 0.1 } },
  { from: 5, to: 2, label: "e", smooth: { type: "curvedCW", roundness: 0.1 } },
  { from: 2, to: 2, label: "f" }
]);

const data = {
  nodes,
  edges
};

const options = {
  clickToUse: true,
  nodes: {
    shape: "circle"
  },
  edges: {
    arrows: {
      to: { enabled: true, scaleFactor: 1, type: "arrow" }
    },
    // by default all edges property should be this
    smooth: { type: "curvedCW", roundness: 0.0 }
  },
  physics: {
    enabled: false // should I enable it or add a functionality user can enable/disable physics ?
  },
  manipulation: {
    addEdge: (edgeData, callback) => {
      // if (edgeData.from === edgeData.to) {
      //   let r = alert("Do you want to connect the node to itself?");
      //   if (r === true) {
      //     callback(edgeData);
      //   }
      // } else {
      //   callback(edgeData);
      // }
      callback(edgeData);
    }
  }
};

class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.network = {};
    this.visRef = React.createRef();
  }

  componentDidMount() {
    this.network = new Network(this.visRef, data, options);
    this.visRef.focus();
    const keys = keycharm({
      container: this.visRef,
      preventDefault: true
    });

    /**
     * click event will focus on the container
     * It's necessary for keyboard events to work
     */
    this.network.on("click", () => {
      this.visRef.focus();
    });

    /**
     * create a node when double clicked in canvas
     */
    this.network.on("doubleClick", params => {
      nodes.add({
        id: nodes.length + 1,
        label: `node ${nodes.length + 1}`,
        x: params.pointer.canvas.x,
        y: params.pointer.canvas.y
      });
    });

    /**
     * delete key will delete the selected node
     */
    keys.bind("delete", () => {
      const selection = this.network.getSelection();
      nodes.remove(selection.nodes[0]);
    });

    /**
     * edges can be drawn by pressing and holding down shift and then click dragging from one node to other node
     */
    keys.bind(
      "shift",
      () => {
        this.network.addEdgeMode();
      },
      "keydown"
    );
    keys.bind(
      "shift",
      () => {
        this.network.disableEditMode();
      },
      "keyup"
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={16}>
          <Grid item lg={9} xs={12}>
            <Paper className={classes.paper} elevation={12}>
              <div
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={0}
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
