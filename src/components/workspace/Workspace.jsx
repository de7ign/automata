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
import fileDownload from "js-file-download";
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
    // height: window.innerHeight * 0.862,
    // [theme.breakpoints.down("md")]: {
    //   height: window.innerHeight * 0.3
    // }
    height: "100%"
  },
  icon: {
    margin: theme.spacing.unit,
    verticalAlign: "middle",
    fontSize: "large"
  }
});

const nodes = new DataSet([
  { id: 1, label: "start", x: -184, y: -41 },
  { id: 2, label: "Node 1", x: 11, y: -40 },
  { id: 3, label: "Node 2", x: 215, y: -37 }
]);

/*
  all the edges will have the property `smooth: {type: "curvedCW", roundness: 0.0 }` except the node with self edge
  `roundnes: 0.0` gives the edges a straight line.
  increasing the roundness factor will help in the case of where two distinct edges are connecting two same node with different direction
  otherwise edges and its labels will overlap
*/
const edges = new DataSet([
  { from: 1, to: 2, label: "1", smooth: { type: "curvedCW", roundness: 0.2 } },
  { from: 1, to: 1, label: "0" },
  { from: 2, to: 1, label: "1", smooth: { type: "curvedCW", roundness: 0.2 } },
  { from: 2, to: 3, label: "0", smooth: { type: "curvedCW", roundness: 0.2 } },
  { from: 3, to: 2, label: "0", smooth: { type: "curvedCW", roundness: 0.2 } },
  { from: 3, to: 3, label: "1" }
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
    playing: false,
    exportDialogOpen: false,
    inputString: ""
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
          if (!this.isEdgePresent(edgeData)) {
            this.handleEdgeDialogOpen();
            callback(edgeData);
          } else {
            // give a alert/notification there's already a edge
            this.handleSnackbarOpen("warning", "There's already a edge");
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
      this.onNetworkSingleClick(params);
    });

    /**
     * create a node when double clicked in canvas
     */
    this.network.on("doubleClick", params => {
      this.onNetworkDoubleClick(params);
    });

    /**
     * when canvas is out of focus, and any object is tried to drag it works
     * and selected object is dragged, but the canvas stay out of focus.
     * this will take care of the problem
     */
    this.network.on("dragStart", params => {
      this.onNetworkDragStart(params);
    });

    /**
     *  If clicked on a node then it's label is displayed on edit label text box
     *  and user can change the label of selected node.
     */
    this.network.on("selectNode", params => {
      // made a separate function as it will be used by the network.on("dragStart",(){}) too.
      this.onNetworkNodeSelected(params);
    });

    /**
     *  If clicked on a node then it's label is displayed on edit label text box
     *  and user can change the label of selected node.
     */
    this.network.on("selectEdge", params => {
      this.onNetworkEdgeSelected(params);
    });

    /**
     * delete key will delete the selected node/edges
     */
    keys.bind("delete", () => {
      this.onNetworkDeleteKeyPress();
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

  onNetworkDeleteKeyPress = () => {
    const selection = this.network.getSelection();

    // if any node is selected then proceed
    if (selection.nodes.length) {
      // if selected node is start state
      if (selection.nodes[0] === 1) {
        this.handleSnackbarOpen("error", "start state can't be removed");
        return;
      }

      // if selected element is a final state
      for (let i = 0; i < this.finalStates.length; i += 1) {
        if (this.finalStates[i] === selection.nodes[0]) {
          this.finalStates.splice(i, 1);
        }
      }

      // remove the edges connected to it
      edges.remove(this.network.getConnectedEdges(selection.nodes[0]));
    }

    // delete the selected element
    this.network.deleteSelected();

    // disable the edit label mode
    this.setState({ editLabel: "", disableEditLabelMode: true });
  };

  /** checks if there's already a edge with same from and to as new proposed edge */
  isEdgePresent = edgeData => {
    const edgesData = edges.get();
    for (let i = 0; i < edgesData.length; i += 1) {
      if (
        edgesData[i].from === edgeData.from &&
        edgesData[i].to === edgeData.to
      ) {
        return true;
      }
    }
    return false;
  };

  /**
   *
   */

  onNetworkSingleClick = params => {
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
  };

  /**
   * Called when double click is done
   * a new node is created if double clicked on canvas
   * a node is made final/non-final node if double clicked on that node.
   */

  onNetworkDoubleClick = params => {
    const selectedNodes = this.network.getSelectedNodes();

    if (selectedNodes.length === 0) {
      nodes.add({
        label: "",
        x: params.pointer.canvas.x,
        y: params.pointer.canvas.y
      });
      this.handleAddNodeDialogOpen();
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
  };

  onNetworkDragStart = params => {
    this.visRef.focus();
    if (params.nodes[0] !== undefined) {
      this.onNetworkNodeSelected(params);
    }
    // no need to do the same for edges, as dragStart doesn't select a edge.
    // params.edges[] remains empty
  };

  /**
   * When a node is selected
   * activate the edit label textbox
   * and autofill with edge label
   */
  onNetworkNodeSelected = params => {
    this.edgeSelected = {};
    this.nodeSelected = nodes.get(params.nodes[0]);

    // enable the edit label mode
    this.currentElementLabel = this.nodeSelected.label;
    this.setState({
      editLabel: this.nodeSelected.label,
      disableEditLabelMode: false
    });
  };

  /**
   * When an edge is selected
   * activate the edit label textbox
   * and autofill with edge label
   */
  onNetworkEdgeSelected = params => {
    this.nodeSelected = {};
    this.edgeSelected = edges.get(params.edges[0]);

    // enable the edit label mode
    this.currentElementLabel = this.edgeSelected.label;
    this.setState({
      editLabel: this.edgeSelected.label,
      disableEditLabelMode: false
    });
  };

  handleAddNodeDialogOpen = () => {
    this.setState({ nodeDialogOpen: true });
  };

  handleAddNodeDialogClose = () => {
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

  handleWorkspaceClickAway = () => {
    this.network.disableEditMode();
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

  handleClearWorkspace = () => {
    this.finalStates = [];
    nodes.remove(nodes.getIds().slice(1));
    edges.clear();
  };

  handleExportDialogToggle = () => {
    this.setState(prevState => ({
      exportDialogOpen: !prevState.exportDialogOpen
    }));
  };

  handleExportAsJSON = () => {
    let payload = {
      nodes: nodes.get(),
      edges: edges.get(),
      finalStates: this.finalStates
    };
    payload = JSON.stringify(payload);
    fileDownload(payload, "export.json");
    this.handleExportDialogToggle();
  };

  handleExportAsPNG = () => {
    let imgBlob;

    this.handleExportDialogToggle();

    this.network.once("afterDrawing", ctx => {
      imgBlob = ctx.canvas.toDataURL();
    });
    this.network.redraw();

    const download = document.createElement("a");
    download.href = imgBlob;
    download.download = "export.png";
    download.click();
    download.remove();
  };

  handleImport = ({ target }) => {
    const fileReader = new FileReader();
    const { files } = target;

    fileReader.readAsText(files[0]);
    fileReader.onload = e => {
      this.handleClearWorkspace();
      const importData = JSON.parse(e.target.result);

      /**
       * try to include start node, or else update the coordinates
       */
      nodes.add(importData.nodes.splice(1));
      edges.add(importData.edges);
      this.finalStates = importData.finalStates;

      // change the file input
      e.target.value = null;
    };
  };

  handleInputStringChange = event => {
    this.setState({ inputString: event.target.value });
  };

  testDFA = () => {
    const machine = {
      nodes: nodes.get(),
      edges: edges.get(),
      finalStates: this.finalStates
    };

    const { inputString } = this.state;

    /**
     * SANITIZATION
     * 1. No isolated nodes should be present
     * 2. There can be only one final state in DFA mode.
     */

    for (let index = 0; index < machine.nodes.length; index += 1) {
      const node = machine.nodes[index];
      let found = false;
      for (let index1 = 0; index1 < machine.edges.length; index1 += 1) {
        const edge = machine.edges[index1];
        if (edge.from === node.id || edge.to === node.id) {
          found = true;
          break;
        }
      }
      if (!found) {
        this.handleSnackbarOpen("error", "isolated nodes found");
        return;
      }
    }

    if (machine.finalStates.length > 1) {
      this.handleSnackbarOpen("error", "only one final state is allowed");
      return;
    }

    if (machine.finalStates.length < 1) {
      this.handleSnackbarOpen("error", "please provide one final state");
      return;
    }

    // compute dfa
    let state = 1;

    for (let index = 0; index < inputString.length; index += 1) {
      let toContinue = false;
      const alphabet = inputString[index];
      for (let index2 = 0; index2 < machine.edges.length; index2 += 1) {
        const edge = machine.edges[index2];
        if (edge.from === state && edge.label === alphabet) {
          state = edge.to;
          toContinue = true;
          break;
        }
      }
      if (!toContinue) {
        this.handleSnackbarOpen("error", "not accepted");
        return;
      }
    }

    for (let index = 0; index < this.finalStates.length; index += 1) {
      const element = this.finalStates[index];
      if (element === state) {
        this.handleSnackbarOpen("success", "accepted");
        return;
      }
    }

    this.handleSnackbarOpen("error", "not accepted");
  };

  render() {
    const { classes } = this.props;
    const {
      edgeDialogOpen,
      labelError,
      nodeDialogOpen,
      editLabel,
      disableEditLabelMode,
      playing,
      exportDialogOpen
    } = this.state;
    return (
      <div className={classes.root}>
        <Grid container spacing={16}>
          <Grid item lg={9} xs={12}>
            <Paper className={classes.paper} elevation={6}>
              <ClickAwayListener onClickAway={this.handleWorkspaceClickAway}>
                <div>
                  <ClickAwayListener
                    onClickAway={this.handleEditLabelClickAway}
                  >
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
                </div>
              </ClickAwayListener>
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
                  <br />
                  <Typography variant="caption" color="primary">
                    Updates
                    <br />
                    1. Share is now available with JSON and PNG format
                    <br />
                    2. Clear Workspace is now available
                  </Typography>
                </Typography>
                <Divider />
                <br />
                <Grid container spacing={16}>
                  <Grid item xs={6} lg={12}>
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
                      onChange={this.handleInputStringChange}
                    />
                    <Button variant="outlined" fullWidth onClick={this.testDFA}>
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
                  </Grid>

                  <br />
                  <br />

                  <Grid item xs={6} lg={12}>
                    <Typography variant="overline">
                      <Share className={classes.icon} />
                      Share
                    </Typography>
                    <Divider />
                    <br />
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={this.handleExportDialogToggle}
                    >
                      Export
                    </Button>

                    <label htmlFor="icon-button-photo">
                      <input
                        accept=".json"
                        id="icon-button-photo"
                        onChange={this.handleImport}
                        type="file"
                        hidden
                      />
                      <Button variant="outlined" component="span" fullWidth>
                        Import
                      </Button>
                    </label>

                    <br />
                    <br />

                    <Typography variant="overline">
                      <Delete className={classes.icon} />
                      Clear Workspace
                    </Typography>
                    <Divider />
                    <br />
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={this.handleClearWorkspace}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Paper>
          </Grid>
        </Grid>

        <Dialog
          open={exportDialogOpen}
          onClose={this.handleExportDialogToggle}
          aria-labelledby="export-as-dialog"
        >
          <DialogTitle id="export-as-dialog">Export</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Please choose an export format
            </DialogContentText>
            <div style={{ paddingTop: 4, paddingBottom: 4 }}>
              <Button
                variant="outlined"
                fullWidth
                style={{ marginTop: 4, marginBottom: 4 }}
                onClick={this.handleExportAsJSON}
              >
                as JSON
              </Button>
              <Button
                variant="outlined"
                fullWidth
                style={{ marginTop: 4, marginBottom: 4 }}
                onClick={this.handleExportAsPNG}
              >
                as PNG
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={nodeDialogOpen}
          onClose={this.handleAddNodeDialogClose}
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
            <Button onClick={this.handleAddNodeDialogClose} color="primary">
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
