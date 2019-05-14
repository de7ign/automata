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
  Button,
  ClickAwayListener,
  Typography,
  Divider,
  IconButton
} from "@material-ui/core";
import {
  Build,
  Share,
  Delete,
  Autorenew,
  SkipPrevious,
  SkipNext,
  Stop,
  PlayArrow,
  Pause,
  Warning
} from "@material-ui/icons";
import PropTypes from "prop-types";
import { Network, DataSet, keycharm } from "vis";
import CustomizedSnackbars from "../snackbar/CustomizedSnackbars";

/**
 *  divUtil height is set to 0.862, which is approximate to canvas
 *  of height 0.8 plus edit label textbox, it works but it needs refactoring in future.
 *
 *  @todo height of canvas and util should be decided by their parent
 *  container i.e Paper component. inside the paper component div should fill up the remaining space
 */
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
    height: window.innerHeight * 0.862,
    [theme.breakpoints.down("md")]: {
      height: window.innerHeight * 0.3
    }
  },
  icon: {
    margin: theme.spacing.unit,
    verticalAlign: "middle",
    fontSize: "large"
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

  nodeSelected = {};

  edgeSelected = {};

  currentElementLabel = "";

  state = {
    edgeDialogOpen: false,
    edgeLabel: "",
    labelError: false,
    nodeDialogOpen: false,
    nodeLabel: "",
    editLabel: "",
    disableEditLabelMode: true,
    playing: false
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
      },
      interaction: {
        selectConnectedEdges: false
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
    this.network.on("click", params => {
      this.visRef.focus();
      const nodeId = params.nodes[0];
      const edgeId = params.edges[0];

      /**
       *  this below piece of code is similar to handleEditLabelClickAway()
       *  why rewritten here once again ? only difference is here I don't call
       *  unselectAll()
       *
       *  this entire piece of code can be in network.on("deselectNode", (){})
       *  but when one a node is selected hence edit label mode is enabled,
       *  clicking anywhere outside the canvas and text box should disable
       *  edit label mode and unselect the nodes. -  that is what handleEditLabelClickAway() is doing
       *
       *  but when the handleEditLabelClickAway() is called inside network.on("deselectNode", (){})
       *  the problem is when node is selected, edit mode is enabled and user agains click on different node
       *  the deselectNode is fired and then selectNode is fired but the unselectAll() in handleEditLabelClickAway()
       *  unselects the new selected node.
       *
       *  update: below code now handles the edit of edges too.
       */
      if (nodeId === undefined && edgeId === undefined) {
        const { editLabel, disableEditLabelMode } = this.state;

        // this regex checks if only space(s) are present
        const spacePattern = /^\s*$/g;

        if (
          (editLabel === "" || spacePattern.test(editLabel)) &&
          !disableEditLabelMode
        ) {
          this.setState({ editLabel: "", disableEditLabelMode: true });
          this.handleSnackbarOpen("warning", "label can't be empty");
          return;
        }

        /**
         * @todo - remove any leading and trailing extra space(s)
         * @todo - notification feature which will say if label is too big, - only for nodes
         * due to design implementation we cannot increase the size of a node
         * which results in limit the label length.
         */

        if (
          !disableEditLabelMode &&
          Object.prototype.hasOwnProperty.call(this.nodeSelected, "id")
        ) {
          this.updateNodeLabel(editLabel);
        } else if (
          !disableEditLabelMode &&
          Object.prototype.hasOwnProperty.call(this.edgeSelected, "id")
        ) {
          this.updateEdgeLabel(editLabel);
        }

        // disable the edit label mode
        this.setState({ editLabel: "", disableEditLabelMode: true });
        this.nodeSelected = {};
        this.edgeSelected = {};
      }
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
     *  If clicked on a node then it's label is displayed on edit label text box
     *  and user can change the label of selected node.
     */
    this.network.on("selectNode", params => {
      this.edgeSelected = {};
      const nodeId = params.nodes[0];
      this.nodeSelected = nodes.get(nodeId);

      // enable the edit label mode
      this.currentElementLabel = this.nodeSelected.label;
      this.setState({
        editLabel: this.nodeSelected.label,
        disableEditLabelMode: false
      });
    });

    /**
     *  If clicked on a node then it's label is displayed on edit label text box
     *  and user can change the label of selected node.
     */
    this.network.on("selectEdge", params => {
      this.nodeSelected = {};
      const edgeId = params.edges[0];

      this.edgeSelected = edges.get(edgeId);

      // enable the edit label mode
      this.currentElementLabel = this.edgeSelected.label;
      this.setState({
        editLabel: this.edgeSelected.label,
        disableEditLabelMode: false
      });
    });

    /**
     * delete key will delete the selected node/edges
     */
    keys.bind("delete", () => {
      const selection = this.network.getSelection();

      // if it's a start state then don't remove it
      if (selection.nodes[0] === 1) {
        this.handleSnackbarOpen("error", "start state can't be removed");
        return;
      }

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
   *  updates the label of the selected Node
   *  @param {string} - new label which will be used to update the node label
   */
  updateNodeLabel = label => {
    nodes.update({ id: this.nodeSelected.id, label });
  };

  /**
   *  updates the label of the selected Node
   *  @param {string} - new label which will be used to update the node label
   */
  updateEdgeLabel = label => {
    edges.update({ id: this.edgeSelected.id, label });
  };

  handleEditLabelChange = event => {
    this.setState({ editLabel: event.target.value });
  };

  handleEditLabelClickAway = () => {
    const { editLabel, disableEditLabelMode } = this.state;

    // this regex checks if only space(s) are present
    const spacePattern = /^\s*$/g;

    if (
      (editLabel === "" || spacePattern.test(editLabel)) &&
      !disableEditLabelMode
    ) {
      this.network.unselectAll();
      this.setState({ editLabel: "", disableEditLabelMode: true });
      this.handleSnackbarOpen("warning", "label can't be empty");
      return;
    }

    /**
     * @todo - remove any leading and trailing extra space(s)
     * @todo - notification feature which will say if label is too big,
     * due to design implementation we cannot increase the size of a node
     * which results in limit the label length.
     */

    if (!disableEditLabelMode) {
      this.updateNodeLabel(editLabel);
    }

    /**
     *  unselect the selected node
     *  disable the edit label mode
     */
    this.network.unselectAll();
    this.setState({ editLabel: "", disableEditLabelMode: true });
  };

  /**
   *  This function will handle the display of snackbar notification
   *  @params {string}  variant - It takes the variant of snackbar, one of - (success, warning, error, info)
   *  @params {string}  message - Message to be shown in snackbar
   */
  handleSnackbarOpen = (variant, message) => {
    // const variantArray = ["success", "warning", "error", "info"];
    // const variant =
    //   variantArray[Math.floor(Math.random() * variantArray.length)];
    this.CustomizedSnackbarRef.current.handleClick(variant, message);
  };

  handlePlayPauseToggle = () => {
    this.setState(prevState => ({
      playing: !prevState.playing
    }));
  };

  handleStopClick = () => {
    this.setState({ playing: false });
  };

  render() {
    const { classes } = this.props;
    const {
      edgeDialogOpen,
      labelError,
      nodeDialogOpen,
      editLabel,
      disableEditLabelMode,
      playing
    } = this.state;
    return (
      <div className={classes.root}>
        <Grid container spacing={16}>
          <Grid item lg={9} xs={12}>
            <Paper className={classes.paper} elevation={6}>
              <ClickAwayListener onClickAway={this.handleEditLabelClickAway}>
                <TextField
                  placeholder="Nodes/Edges label"
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={editLabel}
                  disabled={disableEditLabelMode}
                  onChange={this.handleEditLabelChange}
                />
              </ClickAwayListener>
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
              <div className={classes.divUtil}>
                <Typography variant="overline" color="secondary">
                  <Warning className={classes.icon} />
                  This is just a initial design of Tools and Utilities.
                  <br />
                  Until finalised you may notice some tools move, redesigned or
                  even disappear for a while
                </Typography>
                <Divider />
                <br />
                <Typography variant="overline">
                  <Build className={classes.icon} />
                  Test
                </Typography>
                <Divider />

                <TextField
                  placeholder="string"
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                  onChange=""
                />
                <Button variant="outlined" fullWidth>
                  Test
                </Button>
                <br />
                <IconButton style={{ color: "#000000" }}>
                  <SkipPrevious />
                </IconButton>
                {playing ? (
                  <IconButton
                    style={{ color: "#000000" }}
                    onClick={this.handlePlayPauseToggle}
                  >
                    <Pause />
                  </IconButton>
                ) : (
                  <IconButton
                    style={{ color: "#000000" }}
                    onClick={this.handlePlayPauseToggle}
                  >
                    <PlayArrow />
                  </IconButton>
                )}
                <IconButton style={{ color: "#000000" }}>
                  <SkipNext />
                </IconButton>
                <IconButton
                  style={{ color: "#000000" }}
                  onClick={this.handleStopClick}
                >
                  <Stop />
                </IconButton>

                <br />
                <br />
                <Typography variant="overline">
                  <Autorenew className={classes.icon} />
                  Convert
                </Typography>
                <Divider />
                <br />
                <Button variant="outlined" fullWidth>
                  Convert
                </Button>

                <br />
                <br />
                <Typography variant="overline">
                  <Share className={classes.icon} />
                  Share
                </Typography>
                <Divider />
                <br />
                <Button variant="outlined" fullWidth>
                  Export
                </Button>
                <Button variant="outlined" fullWidth>
                  Import
                </Button>

                <br />
                <br />
                <Typography variant="overline">
                  <Delete className={classes.icon} />
                  Clear Workspace
                </Typography>
                <Divider />
                <br />
                <Button variant="outlined" fullWidth>
                  Clear
                </Button>
              </div>
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
