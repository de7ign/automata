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
import CustomizedSnackbars from "../snackbar/CustomizedSnackbars";

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
  { id: 1, label: "start" },
  { id: 2, label: "Node 2" },
  { id: 3, label: "final" },
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
  visRef = React.createRef();

  CustomizedSnackbarRef = React.createRef();

  network = {};

  state = {
    edgeDialogOpen: false,
    edgeLabel: "",
    labelError: false,
    nodeDialogOpen: false,
    nodeLabel: ""
  };

  /**
   *  TODO:
   *  maybe instead of making a different DS for storing final states I can just make a new attribute in node dataset ?
   *  It'll be helpful when the DS will be passed for processing
   */
  finalStates = [3];

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

    this.network.on("beforeDrawing", ctx => {
      /**
       *  TODO
       *  make changes in nodes dataset for dynamic start node
       *  or no need for maintaining any new datastructure if default start node will be there.
       *  currently thinking of making a default start state so no need for new datastructure/dataset
       */
      // to make arrow on node 1 to represent it as start node
      const startNode = 1;
      const startNodePosition = this.network.getPositions([startNode]);
      // in order to keep the default dx as 30, we need to limit the length of node label, otherwise arrow and node will overlap
      const x1 = startNodePosition[startNode].x - 30;
      const y1 = startNodePosition[startNode].y;
      const x2 = startNodePosition[startNode].x - 80;
      const y2 = startNodePosition[startNode].y;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "#2B7CE9";
      ctx.stroke();

      const startRadians =
        Math.atan((y2 - y1) / (x2 - x1)) +
        ((x2 >= x1 ? -90 : 90) * Math.PI) / 180;

      ctx.save();
      ctx.beginPath();
      ctx.translate(x1, y1);
      ctx.rotate(startRadians);
      ctx.moveTo(0, 0);
      ctx.lineTo(5, 18);
      ctx.lineTo(0, 16);
      ctx.lineTo(-5, 18);
      ctx.closePath();
      ctx.restore();
      ctx.fillStyle = "#2B7CE9";
      ctx.fill();

      // const x_center = startNodePosition[startNode].x - 50;
      // const y_center = startNodePosition[startNode].y;

      // let angle;
      // let x;
      // let y;
      // const radius = 30

      // ctx.beginPath();

      // angle = Math.atan2(y_center , x_center);
      // x = radius * Math.cos(angle) + x_center;
      // y = radius * Math.sin(angle) + y_center;

      // ctx.moveTo(x, y);

      // angle += (1.0 / 3.0) * (2 * Math.PI);
      // x = radius * Math.cos(angle) + x_center;
      // y = radius * Math.sin(angle) + y_center;

      // ctx.lineTo(x, y);

      // angle += (1.0 / 3.0) * (2 * Math.PI);
      // x = radius * Math.cos(angle) + x_center;
      // y = radius * Math.sin(angle) + y_center;

      // ctx.lineTo(x, y);

      // ctx.closePath();

      // ctx.fill();

      if (this.finalStates !== null) {
        const nodePosition = this.network.getPositions(this.finalStates);
        ctx.strokeStyle = "#2B7CE9";
        this.finalStates.forEach(value => {
          // in order to keep the default dx as 36, we need to limit the length of node label, otherwise arrow and node will overlap
          ctx.circle(nodePosition[value].x, nodePosition[value].y, 36);
          ctx.stroke();
        });
      }
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
      const selectedNodes = this.network.getSelectedNodes();

      /**
       * maybe selectedNodes.length === 0 can be used ?
       */
      if (selectedNodes[0] === undefined) {
        nodes.add({
          label: "",
          x: params.pointer.canvas.x,
          y: params.pointer.canvas.y
        });
        this.handleNodeDialogOpen();
      } else {
        // if the state is already in finalStates[] then remove it from finalStates[]
        for (let i = 0; i < this.finalStates.length; i += 1) {
          if (this.finalStates[i] === selectedNodes[0]) {
            this.finalStates.splice(i, 1);
            return;
          }
        }
        this.finalStates.push(selectedNodes[0]);
      }
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
      // remove the node from finalStates[] too
      /**
       *  TODO:
       *  migrate from vanilla JS to lodash for all these array and object operations
       */
      for (let i = 0; i < this.finalStates.length; i += 1) {
        if (this.finalStates[i] === selection.nodes[0]) {
          this.finalStates.splice(i, 1);
        }
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

  /**
   * This function will handle the display of snackbar notification
   */
  handleSnackbarOpen = () => {
    const variantArray = ["success", "warning", "error", "info"];
    const variant =
      variantArray[Math.floor(Math.random() * variantArray.length)];
    this.CustomizedSnackbarRef.current.handleClick(variant, variant);
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

        <CustomizedSnackbars ref={this.CustomizedSnackbarRef} />
      </div>
    );
  }
}

Workspace.propTypes = {
  classes: PropTypes.shape().isRequired
};

export default withStyles(styles)(Workspace);
