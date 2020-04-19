/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { useRef, useState, useLayoutEffect } from "react";
import keycharm from "keycharm";
import { Network } from "vis-network/peer/esm/vis-network";
import { DataSet } from "vis-data/peer/esm/vis-data";
import { v4 as randomUUID } from "uuid";
import PropTypes from "prop-types";
import { Paper, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Warning } from "@material-ui/icons";
import DialogBox from "./DialogBox";
import createTestData from "./prepareDevNetwork";
import ToolBar from "./ToolBar";

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing.unit * 2
  },
  paper: {
    padding: theme.spacing.unit,
    height: "85vh"
  },
  canvas: {
    height: "calc(100% - 40px - 8px - 4px)"
  },
  icon: {
    margin: theme.spacing.unit,
    verticalAlign: "middle",
    fontSize: "large"
  }
}));

const NODES = new DataSet([
  { id: "1", label: "start", final: false, x: -184, y: -41 }
]);

const EDGES = new DataSet([]);

const data = {
  nodes: NODES,
  edges: EDGES
};

const NODE_TITLE = "Node";
const NODE_CONTENT_TEXT = "Please enter a label for your new node";

const EDGE_TITLE = "Edge";
const EDGE_CONTENT_TEXT = "Please enter a label for your new edge";

const LABEL_INPUT_EMPTY_WARNING = "Label can't be empty";

const Workspace = props => {
  const { snackbar } = props;

  const networkRef = useRef(null);
  const [viewNodeDialog, setViewNodeDialog] = useState(false);
  const [viewEdgeDialog, setViewEdgeDialog] = useState(false);
  const nodeDialogTexts = {
    dialogTitle: NODE_TITLE,
    dialogContentText: NODE_CONTENT_TEXT,
    warningText: LABEL_INPUT_EMPTY_WARNING
  };
  const edgeDialogTexts = {
    dialogTitle: EDGE_TITLE,
    dialogContentText: EDGE_CONTENT_TEXT,
    warningText: LABEL_INPUT_EMPTY_WARNING
  };
  let automataNetwork = null;
  let automataNetworkKeyCharm = null;

  const nodeObject = useRef({
    id: "",
    label: "",
    x: "",
    y: ""
  });

  const edgeObject = useRef({ id: "", from: "", to: "", label: "" });

  const [disableEditLabel, setDisableEditLabel] = useState(true);
  const editLabelTextBoxRef = useRef();

  // eslint-disable-next-line no-unused-vars
  const isEdgePresent = edge => {
    const edgesList = EDGES.get();
    const { length } = edgesList;
    for (let i = 0; i < length; i += 1) {
      if (edgesList[i].from === edge.from && edgesList[i].to === edge.to)
        return true;
    }
    return false;
  };

  /**
   * It checks if there's already a edge with same "from" and "to"
   *
   * @param edge
   * @return {Object|null} - if edge is found returns the the edge object, null otherwise
   */
  const getEdge = edge => {
    const edgesList = EDGES.get();
    const { length } = edgesList;
    for (let i = 0; i < length; i += 1) {
      if (edgesList[i].from === edge.from && edgesList[i].to === edge.to)
        return edgesList[i];
    }
    return null;
  };

  /**
   * Displays the snackbar notification
   *
   * @param {String} variant - error, warning, info, success
   * @param {String} message - The notification message
   */
  const notification = (variant, message) => {
    try {
      snackbar(variant, message);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error(e);
      }
    }
  };

  /**
   * add a new node to network
   *
   * @param {String} nodeLabel - label of node
   * @param {Number} xCoOrdinate - x coordinate of number w/ respect to canvas
   * @param {Number} yCoOrdinate - y coordinate of number w/ respect to canvas
   */
  const addNode = (nodeLabel, xCoOrdinate, yCoOrdinate) => {
    nodeObject.current.id = randomUUID();
    nodeObject.current.label = nodeLabel || "nodeObject";
    nodeObject.current.x = xCoOrdinate;
    nodeObject.current.y = yCoOrdinate;

    NODES.add({
      id: nodeObject.current.id,
      label: nodeLabel,
      x: xCoOrdinate,
      y: yCoOrdinate
    });
  };

  /**
   * handles when network is double clicked
   *
   * @param {Object} params
   */
  const onNetworkDoubleClick = params => {
    const {
      pointer: {
        canvas: { x, y }
      },
      nodes
    } = params;

    const nodeID = nodes[0];
    if (nodeID) {
      const nodeSelected = NODES.get(nodeID);
      NODES.update({ id: nodeID, final: !nodeSelected.final });
      return;
    }

    // create node
    /*
      FIXME: wasted re-render
      if dialogTexts is not updated, then don't set Dialog Text once again
    */
    setViewNodeDialog(true);
    addNode("", x, y);
  };

  /**
   * handles when a node is selected in network
   *
   * @param {Object} params
   */
  const onNetworkNodeSelect = params => {
    const { nodes } = params;

    const nodeID = nodes[0];
    nodeObject.current = NODES.get(nodeID);
    setDisableEditLabel(false);
    editLabelTextBoxRef.current.value = nodeObject.current.label;
  };

  /**
   * handles when a edge is selected in network
   *
   * @param {Object} params
   */
  const onNetworkEdgeSelect = params => {
    const { edges } = params;

    const edgeID = edges[0];
    edgeObject.current = EDGES.get(edgeID);
    setDisableEditLabel(false);
    editLabelTextBoxRef.current.value = edgeObject.current.label;
  };

  /**
   * Disable the node/edge label edit box
   */
  const disableEditLabelTextBox = () => {
    editLabelTextBoxRef.current.value = "";
    setDisableEditLabel(true);
  };

  /**
   * Deletes the selected node/edge
   */
  const networkDeleteSelected = () => {
    const {
      nodes: nodesSelected,
      edges: edgesSelected
    } = automataNetwork.getSelection();

    if (nodesSelected.length) {
      if (nodesSelected[0] === "1") {
        notification("error", "cannot delete start node");
        return;
      }
      const connectedEdges = automataNetwork.getConnectedEdges(
        nodesSelected[0]
      );
      EDGES.remove(connectedEdges);
      automataNetwork.deleteSelected();
      disableEditLabelTextBox();
      nodeObject.current = {
        id: "",
        label: "",
        x: "",
        y: ""
      };
      return;
    }

    if (edgesSelected.length) {
      automataNetwork.deleteSelected();
      disableEditLabelTextBox();
      edgeObject.current = {
        id: "",
        from: "",
        to: "",
        label: ""
      };
    }
  };

  /**
   * Handles onBlur event of edit label text box
   */
  const handleEditLabelTextBoxOnBlur = () => {
    const newLabel = editLabelTextBoxRef.current.value;
    if (newLabel.trim() === "") {
      notification("warning", "label can't be empty");
      return;
    }

    if (nodeObject.current.id !== "") {
      NODES.update({ id: nodeObject.current.id, label: newLabel });
      nodeObject.current = {
        id: "",
        label: "",
        x: "",
        y: ""
      };
    }

    if (edgeObject.current.id !== "") {
      const labels = newLabel.split(",").map(item => item.trim());
      for (let labelsIndex = 0; labelsIndex < labels.length; ) {
        if (labels[labelsIndex] === "") {
          labels.splice(labelsIndex, 1);
        } else {
          labelsIndex += 1;
        }
      }

      const edgeLabel = labels.join(", ");

      EDGES.update({ id: edgeObject.current.id, label: edgeLabel });
      edgeObject.current = {
        id: "",
        from: "",
        to: "",
        label: ""
      };
    }

    disableEditLabelTextBox();
  };

  /**
   * Handles when a node is deselected
   */
  const onNetworkNodeDeselect = () => {
    disableEditLabelTextBox();
    nodeObject.current = {
      id: "",
      label: "",
      x: "",
      y: ""
    };
  };

  /**
   * Handles when an edge is deselected
   */
  const onNetworkEdgeDeselect = () => {
    disableEditLabelTextBox();
    edgeObject.current = {
      id: "",
      from: "",
      to: "",
      label: ""
    };
  };

  /**
   * Handles when network is dragged,
   * triggered once in the start of dragging event
   *
   * @param params
   */
  const onNetworkDragStart = params => {
    // edge dragging is not supported
    const { nodes } = params;
    if (nodes.length) {
      onNetworkNodeSelect(params);
    }
  };

  const OPTIONS = {
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
      enabled: false,
      addEdge: (edgeData, callback) => {
        // eslint-disable-next-line no-param-reassign
        edgeData.smooth = { type: "curvedCW", roundness: 0.2 };
        edgeObject.current = edgeData;
        const edge = getEdge(edgeData);
        if (edge == null) {
          callback(edgeData);
        } else {
          edgeObject.current = edge;
        }
        setViewEdgeDialog(true);
      }
    },
    interaction: {
      selectConnectedEdges: false
    }
  };

  useLayoutEffect(() => {
    // for Dev environment
    if (process.env.NODE_ENV === "development") {
      createTestData(NODES, EDGES, "TD1");
    } else {
      createTestData(NODES, EDGES, "TD2");
    }

    // create network
    automataNetwork = new Network(networkRef.current, data, OPTIONS);

    // create key binding
    automataNetworkKeyCharm = keycharm({
      container: networkRef.current,
      preventDefault: true
    });

    // add double click event to network
    automataNetwork.on("doubleClick", params => {
      onNetworkDoubleClick(params);
    });

    // add select node event to network
    automataNetwork.on("selectNode", params => {
      onNetworkNodeSelect(params);
    });

    // add select edge event to network
    automataNetwork.on("selectEdge", params => {
      onNetworkEdgeSelect(params);
    });

    automataNetwork.on("deselectNode", () => {
      onNetworkNodeDeselect();
    });

    automataNetwork.on("deselectEdge", () => {
      onNetworkEdgeDeselect();
    });

    automataNetwork.on("dragStart", params => {
      onNetworkDragStart(params);
    });

    automataNetwork.on("beforeDrawing", ctx => {
      // creating arrow for start state

      // to make arrow on node 1 to represent it as start node
      const startNode = 1;
      const startNodePosition = automataNetwork.getPositions([startNode]);
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

      // creating outer circles for final states

      const finalNodesIds = NODES.getIds({
        filter: node => {
          return node.final;
        }
      });

      ctx.save();

      const finalNodePositions = automataNetwork.getPositions(finalNodesIds);
      ctx.strokeStyle = "#2B7CE9";
      finalNodesIds.forEach(value => {
        ctx.beginPath();
        ctx.arc(
          finalNodePositions[value].x,
          finalNodePositions[value].y,
          36,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      });

      ctx.save();
    });

    automataNetworkKeyCharm.bind("delete", () => {
      networkDeleteSelected();
    });

    automataNetworkKeyCharm.bind(
      "shift",
      () => {
        automataNetwork.addEdgeMode();
      },
      "keydown"
    );

    automataNetworkKeyCharm.bind(
      "shift",
      () => {
        automataNetwork.disableEditMode();
      },
      "keyup"
    );
  }, []);

  /**
   * Handles when Node DialogBox components is closed
   */
  const closeNodeDialogBox = () => {
    const node = nodeObject.current;
    NODES.remove(node.id);
    setViewNodeDialog(false);
  };

  /**
   * Handles when Node DialogBox components is closed
   *
   * @param value - Label for the node
   */
  const submitNodeDialogBox = value => {
    setViewNodeDialog(false);
    if (value === "") return;
    const node = nodeObject.current;
    NODES.update({ id: node.id, label: value });
  };

  /**
   * Handles when Edge DialogBox is closed
   */
  const closeEdgeDialogBox = () => {
    const edge = edgeObject.current;
    if (edge.label === undefined) {
      EDGES.remove(edge.id);
    }
    setViewEdgeDialog(false);
  };

  /**
   * Handles when Edge DialogBox submit is clicked
   *
   * @param value - Label for the edge
   */
  const submitEdgeDialogBox = value => {
    setViewEdgeDialog(false);
    if (value === "") return;
    if (value.includes(",")) {
      notification("warning", "Edge label cannot contain comma");
      return;
    }
    const edge = edgeObject.current;
    const existingEdge = EDGES.get(edge.id);
    let edgeLabel = value;
    console.log(existingEdge.label);
    if (existingEdge.label !== undefined) {
      edgeLabel = `${existingEdge.label}, ${value}`;
    }
    EDGES.update({ id: edge.id, label: edgeLabel });
  };

  /**
   * Removes all the nodes and edges except the start node
   */
  const clearNetwork = () => {
    NODES.remove(NODES.getIds().slice(1));
    EDGES.clear();
  };

  /**
   * Accepts a JSON, and create a new network based on the JSON
   *
   * @param networkData - Object in the form of <pre>{nodes: DataSet, edges: DataSet}</pre>
   */
  const createNetworkWithJSON = networkData => {
    clearNetwork();
    NODES.add(networkData.nodes.splice(1));
    EDGES.add(networkData.edges);
  };

  /**
   * Returns all the nodes and edges as a DataSet
   *
   * @returns Object - Object in the form of <pre>{nodes: DataSet, edges: DataSet}</pre>
   */
  const getNetworkDataSet = () => {
    return {
      nodes: NODES,
      edges: EDGES
    };
  };

  /**
   * Returns image blob of the network
   *
   * @return string
   */
  const getImageBlob = () => {
    let imgBlob = null;
    automataNetwork.on("afterDrawing", ctx => {
      imgBlob = ctx.canvas.toDataURL();
    });
    automataNetwork.redraw();
    return imgBlob;
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="overline" color="secondary">
        <Warning className={classes.icon} />
        This application is in WIP. Currently we don&apos;t support Mobile and
        Touch devices.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Paper elevation={6} className={classes.paper}>
            <TextField
              placeholder="Nodes/Edges label"
              fullWidth
              margin="dense"
              variant="outlined"
              InputLabelProps={{
                shrink: true
              }}
              inputRef={editLabelTextBoxRef}
              disabled={disableEditLabel}
              onBlur={handleEditLabelTextBoxOnBlur}
            />
            <div tabIndex={0} ref={networkRef} className={classes.canvas} />
          </Paper>
        </Grid>
        <Grid item xs>
          <ToolBar
            clearNetwork={clearNetwork}
            updateNetwork={createNetworkWithJSON}
            getNetworkDataSet={getNetworkDataSet}
            getImageBlob={getImageBlob}
            snackbar={snackbar}
          />
        </Grid>
      </Grid>

      <DialogBox
        dialogTexts={nodeDialogTexts}
        open={viewNodeDialog}
        submit={submitNodeDialogBox}
        close={closeNodeDialogBox}
      />
      <DialogBox
        dialogTexts={edgeDialogTexts}
        open={viewEdgeDialog}
        submit={submitEdgeDialogBox}
        close={closeEdgeDialogBox}
      />
    </div>
  );
};

Workspace.propTypes = {
  snackbar: PropTypes.func.isRequired
};

export default Workspace;
