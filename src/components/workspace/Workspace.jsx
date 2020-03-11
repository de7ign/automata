/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { useRef, useState, useLayoutEffect } from "react";
import keycharm from "keycharm";
import { Network, DataSet } from "vis-network";
import { randomUUID } from "vis-util";
import PropTypes from "prop-types";
import { Paper, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DialogBox from "./DialogBox";
import createTestData from "./prepareDevNetwork";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing.unit * 2
  },
  paper: {
    padding: theme.spacing.unit
  },
  canvas: {
    height: "85vh"
  }
}));

const NODES = new DataSet([
  { id: "1", title: "title asd", label: "start", final: false, x: -184, y: -41 }
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
  const { notifcation } = props;

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

  const currentNode = useRef({
    id: "",
    label: "",
    x: "",
    y: ""
  });

  const selectedNode = useRef();
  const selectedEdge = useRef();

  const [disableEditLabel, setDisableEditLabel] = useState(true);
  const editLabelTextBoxRef = useRef();

  const currentEdge = useRef();

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
   * add a new node to network
   *
   * @param {String} nodeLabel - label of node
   * @param {Number} xCoOrdinate - x coordinate of number w/ respect to canvas
   * @param {Number} yCoOrdinate - y coordinate of number w/ respect to canvas
   */
  const addNode = (nodeLabel, xCoOrdinate, yCoOrdinate) => {
    currentNode.current.id = randomUUID();
    currentNode.current.label = nodeLabel || "node";
    currentNode.current.x = xCoOrdinate;
    currentNode.current.y = yCoOrdinate;

    NODES.add({
      id: currentNode.current.id,
      label: nodeLabel,
      x: xCoOrdinate,
      y: yCoOrdinate
    });
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
        currentEdge.current = edgeData;
        if (!isEdgePresent(edgeData)) {
          // TODO: by default edge will be straight, I don't know how I should create a edge
          // if(edgeData.to !== edgeData.from)
          //   edgeData.smooth = { type: "curvedCW", roundness: 0.2 }
          callback(edgeData);
          setViewEdgeDialog(true);
        } else {
          notifcation("error", "There's already a edge");
        }
      }
    },
    interaction: {
      selectConnectedEdges: false
    }
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
    selectedNode.current = NODES.get(nodeID);
    setDisableEditLabel(false);
    editLabelTextBoxRef.current.value = selectedNode.current.label;
    editLabelTextBoxRef.current.focus();
  };

  /**
   * handles when a edge is selected in network
   *
   * @param {Object} params
   */
  const onNetworkEdgeSelect = params => {
    const { edges } = params;

    const edgeID = edges[0];
    selectedEdge.current = EDGES.get(edgeID);
    setDisableEditLabel(false);
    editLabelTextBoxRef.current.value = selectedEdge.current.label;
    editLabelTextBoxRef.current.focus();
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
      if (nodesSelected[0] === 1) {
        notifcation("error", "cannot delete start node");
        return;
      }
      automataNetwork.deleteSelected();
      return;
    }

    if (edgesSelected.length) {
      automataNetwork.deleteSelected();
    }
  };

  /**
   * Handles onBlur event of edit label text box
   */
  const handleEditLabelTextBoxOnBlur = () => {
    const newLabel = editLabelTextBoxRef.current.value;
    if (selectedNode.current) {
      NODES.update({ id: selectedNode.current.id, label: newLabel });
      selectedNode.current = null;
    }
    if (selectedEdge.current) {
      EDGES.update({ id: selectedEdge.current.id, label: newLabel });
      selectedEdge.current = null;
    }
    editLabelTextBoxRef.current.value = "";
    setDisableEditLabel(true);
  };

  useLayoutEffect(() => {
    // for Dev environment
    if (process.env.NODE_ENV === "development") {
      createTestData(NODES, EDGES, "TD1");
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

    automataNetwork.on("beforeDrawing", ctx => {
      // creating arrow for start state

      /**
       *  TODO
       *  make changes in nodes dataset for dynamic start node
       *  or no need for maintaining any new datastructure if default start node will be there.
       *  currently thinking of making a default start state so no need for new datastructure/dataset
       */
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

  const closeNodeDialogBox = () => {
    const node = currentNode.current;
    NODES.remove(node.id);
    setViewNodeDialog(false);
  };

  const submitNodeDialogBox = value => {
    setViewNodeDialog(false);
    if (value === "") return;
    const node = currentNode.current;
    NODES.update({ id: node.id, label: value });
  };

  const closeEdgeDialogBox = () => {
    const edge = currentEdge.current;
    EDGES.remove(edge.id);
    setViewEdgeDialog(false);
  };

  const submitEdgeDialogBox = value => {
    setViewEdgeDialog(false);
    if (value === "") return;
    const edge = currentEdge.current;
    EDGES.update({ id: edge.id, label: value });
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
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
  notifcation: PropTypes.func.isRequired
};

export default Workspace;
