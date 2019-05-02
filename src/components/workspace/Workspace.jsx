import React from "react";
import {
  Paper,
  Grid,
  withStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button
} from "@material-ui/core";
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

class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.network = {};
    this.visRef = React.createRef();

    this.state = {
      edgeDialogOpen: false,
      edgeLabel: "",
      labelError: false,
      nodeDialogOpen: false,
      nodeLabel: ""
    };
  }

  componentDidMount() {
    const options = {
      clickToUse: true,
      nodes: {
        shape: "circle",
        heightConstraint: {
          minimum: 50
        },
        widthConstraint: {
          minimum: 50,
          maximum: 50
        }
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
          // this.handleClickOpen();
          // edgeData.label = this.state.edgeLabel

          if (!this.isEdgePresent(edgeData)) {
            this.handleEdgeDialogOpen();
            callback(edgeData);
          } else {
            // give a alert/notification there's already a edge
          }
        }
      }
    };

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
        label: "",
        x: params.pointer.canvas.x,
        y: params.pointer.canvas.y
      });
      this.handleNodeDialogOpen();
    });

    /**
     * when canvas is out of focus, and any object is tried to drag it works
     * and selected object is dragged, but the canvas stay out of focus.
     * this will take care of the problem
     */
    this.network.on("dragStart", () => {
      this.visRef.focus();
    });

    /**
     * delete key will delete the selected node/edges
     */
    keys.bind("delete", () => {
      const selection = this.network.getSelection();
      if (!selection.nodes[0]) {
        edges.remove(selection.edges[0]);
      }
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

  /** checks if there's already a edge with same from and to as new proposed edge */
  isEdgePresent = edgeData => {
    let flag = false;
    const edgesData = edges.get();
    for (let i = 0; i < edgesData.length; i += 1) {
      if (
        edgesData[i].from === edgeData.from &&
        edgesData[i].to === edgeData.to
      ) {
        flag = true;
        break;
      }
    }
    return flag;
  };

  handleNodeDialogOpen = () => {
    this.setState({ nodeDialogOpen: true });
  };

  handleNodeDialogClose = () => {
    this.setState({ nodeDialogOpen: false, labelError: false });

    // no label provided ? then delete the node
    nodes.remove(nodes.getIds()[nodes.length - 1]);
  };

  handleNodeDialogEnterClose = () => {
    const { nodeLabel } = this.state;

    // node label shouldn't be empty
    if (nodeLabel !== "") {
      nodes.update({ id: nodes.getIds()[nodes.length - 1], label: nodeLabel });
      this.setState({
        nodeDialogOpen: false,
        labelError: false,
        nodeLabel: ""
      });
    } else {
      this.setState({ labelError: true });
    }
  };

  handleNodeLabelChange = event => {
    this.setState({ nodeLabel: event.target.value });
  };

  handleEdgeDialogOpen = () => {
    this.setState({ edgeDialogOpen: true });
  };

  handleEdgeDialogClose = () => {
    this.setState({ edgeDialogOpen: false, labelError: false });

    // no label provided ? then delete the edge
    edges.remove(edges.getIds()[edges.length - 1]);
  };

  handleEdgeDialogEnterClose = () => {
    const { edgeLabel } = this.state;

    // edge label shouldn't be empty or contain any space
    if (edgeLabel !== "" && !/\s/g.test(edgeLabel)) {
      edges.update({ id: edges.getIds()[edges.length - 1], label: edgeLabel });
      this.setState({
        edgeDialogOpen: false,
        labelError: false,
        edgeLabel: ""
      });
    } else {
      this.setState({ labelError: true });
    }
  };

  handleEdgeLabelChange = event => {
    this.setState({ edgeLabel: event.target.value });
  };

  render() {
    const { classes } = this.props;
    const { edgeDialogOpen, labelError, nodeDialogOpen } = this.state;
    return (
      <div className={classes.root}>
        <Grid container spacing={16}>
          <Grid item lg={9} xs={12}>
            <Paper className={classes.paper} elevation={6}>
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
            <Paper className={classes.paper} elevation={6}>
              <div className={classes.divUtil}>tools</div>
            </Paper>
          </Grid>
        </Grid>

        <Dialog
          open={nodeDialogOpen}
          onClose={this.handleNodeDialogClose}
          aria-labelledby="node-form-dialog-title"
        >
          <DialogTitle id="node-form-dialog-title">Node</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a label for your new node
            </DialogContentText>
            {labelError ? (
              <DialogContentText style={{ color: "red" }}>
                Label cannot be empty or include space
              </DialogContentText>
            ) : (
              ""
            )}
            <TextField
              autoFocus
              autoComplete="off"
              margin="dense"
              id="nodelabel"
              onChange={this.handleNodeLabelChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleNodeDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleNodeDialogEnterClose} color="primary">
              Enter
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={edgeDialogOpen}
          onClose={this.handleEdgeDialogClose}
          aria-labelledby="edge-form-dialog-title"
        >
          <DialogTitle id="edge-form-dialog-title">Edge</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a label for your new edge
            </DialogContentText>
            {labelError ? (
              <DialogContentText style={{ color: "red" }}>
                Label cannot be empty or include space
              </DialogContentText>
            ) : (
              ""
            )}
            <TextField
              autoFocus
              autoComplete="off"
              margin="dense"
              id="edgelabel"
              onChange={this.handleEdgeLabelChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleEdgeDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleEdgeDialogEnterClose} color="primary">
              Enter
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Workspace.propTypes = {
  classes: PropTypes.shape().isRequired
};

export default withStyles(styles)(Workspace);
