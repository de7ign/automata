/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { useRef, useState, useEffect, useCallback } from "react";
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
const LABEL_INPUT_COMMA_WARNING = "Label can't have a comma";
const LABEL_INPUT_BACKSLASH_WARNING = "Label can't have a backslash";
const LABEL_INPUT_SPECIAL_CHARACTERS_WARNING = "Label can't have a , or \\";

const Workspace = props => {
  const { snackbar } = props;

  const _networkRef = useRef(null);
  const getNetworkRef = () => {
    return _networkRef.current;
  };

  const [viewNodeDialog, setViewNodeDialog] = useState(false);
  const [viewEdgeDialog, setViewEdgeDialog] = useState(false);
  const nodeDialogTexts = {
    dialogTitle: NODE_TITLE,
    dialogContentText: NODE_CONTENT_TEXT,
    warningText: {
      emptyStringWarning: LABEL_INPUT_EMPTY_WARNING,
      specialCharacterWarning: LABEL_INPUT_SPECIAL_CHARACTERS_WARNING
    }
  };
  const edgeDialogTexts = {
    dialogTitle: EDGE_TITLE,
    dialogContentText: EDGE_CONTENT_TEXT,
    warningText: {
      emptyStringWarning: LABEL_INPUT_EMPTY_WARNING,
      specialCharacterWarning: LABEL_INPUT_SPECIAL_CHARACTERS_WARNING
    }
  };

  const _automataNetwork = useRef(null);
  const getAutomataNetwork = () => {
    return _automataNetwork.current;
  };
  const setAutomataNetwork = automataNetwork => {
    _automataNetwork.current = automataNetwork;
  };

  const _automataNetworkKeyCharm = useRef(null);
  const getAutomataNetworkKeyCharm = () => {
    return _automataNetworkKeyCharm.current;
  };
  const setAutomataNetworkKeyCharm = automataNetworkKeyCharm => {
    _automataNetworkKeyCharm.current = automataNetworkKeyCharm;
  };

  const _nodeObject = useRef({
    id: "",
    label: "",
    x: "",
    y: ""
  });
  const getNodeObject = () => {
    return _nodeObject.current;
  };
  const setNodeObject = nodeObject => {
    if (
      /* checking for {} */ Object.keys(nodeObject).length === 0 ||
      nodeObject === null ||
      nodeObject === undefined
    ) {
      _nodeObject.current = {
        id: "",
        label: "",
        x: "",
        y: ""
      };
    } else {
      _nodeObject.current = nodeObject;
    }
  };

  const _edgeObject = useRef({ id: "", from: "", to: "", label: "" });
  const getEdgeObject = () => {
    return _edgeObject.current;
  };
  const setEdgeObject = edgeObject => {
    if (
      /* checking for {} */ Object.keys(edgeObject).length === 0 ||
      edgeObject === null ||
      edgeObject === undefined
    ) {
      _edgeObject.current = { id: "", from: "", to: "", label: "" };
    } else {
      _edgeObject.current = edgeObject;
    }
  };

  const [disableEditLabel, setDisableEditLabel] = useState(true);

  const _editLabelTextBoxRef = useRef();
  const getEditLabelTextBoxRef = () => {
    return _editLabelTextBoxRef.current.value;
  };
  const setEditLabelTextBoxRef = editLabelTextBoxRef => {
    _editLabelTextBoxRef.current.value = editLabelTextBoxRef;
  };

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
   * add a new node to network
   *
   * @param {String} nodeLabel - label of node
   * @param {Number} xCoOrdinate - x coordinate of number w/ respect to canvas
   * @param {Number} yCoOrdinate - y coordinate of number w/ respect to canvas
   */
  const addNode = (nodeLabel, xCoOrdinate, yCoOrdinate) => {
    const nodeObject = {
      id: randomUUID(),
      label: nodeLabel || "nodeObject",
      x: xCoOrdinate,
      y: yCoOrdinate
    };

    setNodeObject(nodeObject);
    NODES.add({
      id: nodeObject.id,
      label: nodeLabel,
      x: xCoOrdinate,
      y: yCoOrdinate
    });
  };

  /**
   * Disable the node/edge label edit box
   */
  const disableEditLabelTextBox = useCallback(() => {
    setEditLabelTextBoxRef("");
    setDisableEditLabel(true);
  }, []);

  /**
   * Handles onBlur event of edit label text box
   */
  const handleEditLabelTextBoxOnBlur = () => {
    const nodeObject = getNodeObject();
    const edgeObject = getEdgeObject();
    const newLabel = getEditLabelTextBoxRef().trim();

    if (newLabel === "") {
      snackbar("warning", LABEL_INPUT_EMPTY_WARNING);
      return;
    }

    if (newLabel.includes("\\")) {
      snackbar("warning", LABEL_INPUT_BACKSLASH_WARNING);
      return;
    }

    if (nodeObject.id !== "") {
      if (newLabel.includes(",")) {
        snackbar("warning", LABEL_INPUT_COMMA_WARNING);
        return;
      }
      NODES.update({ id: nodeObject.id, label: newLabel });
      setNodeObject({});
    }

    if (edgeObject.id !== "") {
      let labelArr = newLabel.split(",").map(item => item.trim());
      for (let labelArrIndex = 0; labelArrIndex < labelArr.length; ) {
        if (labelArr[labelArrIndex] === "") {
          labelArr.splice(labelArrIndex, 1);
        } else {
          labelArrIndex += 1;
        }
      }

      labelArr = [...new Set(labelArr)];
      const edgeLabel = labelArr.join(", ");

      EDGES.update({ id: edgeObject.id, label: edgeLabel });
      setEdgeObject({});
    }

    disableEditLabelTextBox();
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
      smooth: { type: "curvedCW", roundness: 0.5 }
    },
    physics: {
      enabled: false // should I enable it or add a functionality user can enable/disable physics ?
    },
    manipulation: {
      enabled: false,
      addEdge: (edgeData, callback) => {
        // eslint-disable-next-line no-param-reassign
        edgeData.smooth = { type: "curvedCW", roundness: 0.2 };
        const edge = getEdge(edgeData);
        if (edge == null) {
          setEdgeObject(edgeData);
          callback(edgeData);
        } else {
          setEdgeObject(edge);
        }
        setViewEdgeDialog(true);
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
    } else {
      /*
        FIXME: wasted re-render
        if dialogTexts is not updated, then don't set Dialog Text once again
      */
      setViewNodeDialog(true);
      addNode("", x, y);
    }
  };

  /**
   * handles when a node is selected in network
   *
   * @param {Object} params
   */
  const onNetworkNodeSelect = params => {
    const { nodes } = params;

    const nodeID = nodes[0];
    const nodeObject = NODES.get(nodeID);
    setDisableEditLabel(false);
    setEditLabelTextBoxRef(nodeObject.label);
    setNodeObject(nodeObject);
  };

  /**
   * handles when a edge is selected in network
   *
   * @param {Object} params
   */
  const onNetworkEdgeSelect = params => {
    const { edges } = params;

    const edgeID = edges[0];
    const edgeObject = EDGES.get(edgeID);
    setDisableEditLabel(false);
    setEditLabelTextBoxRef(edgeObject.label);
    setEdgeObject(edgeObject);
  };

  /**
   * Handles when a node is deselected
   */
  const onNetworkNodeDeselect = () => {
    disableEditLabelTextBox();
    setNodeObject({});
  };

  /**
   * Handles when an edge is deselected
   */
  const onNetworkEdgeDeselect = () => {
    disableEditLabelTextBox();
    setEdgeObject({});
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

  /**
   * Deletes the selected node/edge
   */
  const networkDeleteSelected = () => {
    const automataNetwork = getAutomataNetwork();
    const {
      nodes: nodesSelected,
      edges: edgesSelected
    } = automataNetwork.getSelection();

    if (nodesSelected.length) {
      if (nodesSelected[0] === "1") {
        snackbar("error", "cannot delete start node");
        return;
      }
      const connectedEdges = automataNetwork.getConnectedEdges(
        nodesSelected[0]
      );
      EDGES.remove(connectedEdges);
      automataNetwork.deleteSelected();
      disableEditLabelTextBox();
      setNodeObject({});
      return;
    }

    if (edgesSelected.length) {
      automataNetwork.deleteSelected();
      disableEditLabelTextBox();
      setEdgeObject({});
    }
  };

  useEffect(() => {
    // for Dev environment
    if (process.env.NODE_ENV === "development") {
      createTestData(NODES, EDGES, "TD1");
    } else {
      createTestData(NODES, EDGES, "TD2");
    }

    const networkRef = getNetworkRef();

    // create network
    setAutomataNetwork(new Network(networkRef, data, OPTIONS));

    // create key binding
    setAutomataNetworkKeyCharm(
      keycharm({
        container: networkRef,
        preventDefault: true
      })
    );

    const automataNetwork = getAutomataNetwork();
    const automataNetworkKeyCharm = getAutomataNetworkKeyCharm();

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

    /**
     * Ah, this useEffect and ESLint rules are shit
     * It asks for adding all the dependencies in the dependency array.
     *
     * Adding the methods in dependency array will lead to recurring useCallback till the bottom level methods
     *
     * Even if I add useCallback to every required methods.
     * However it can be very misleading because if I'm using this useEffect to run once when component is mounted
     * so keeping an empty dependency array makes sense. Now If I put all the dependencies in the array.
     * In future, if someone give it a read, It will look like this useEffect reruns every time this
     * functions(dependencies) are changed. :/
     *
     * There are several solutions to this
     * 1. Disable the warning (undesirable)
     * 2. Bring all the dependency method inside useEffect (what if method is also used somewhere else, it will
     *    be out of scope)
     * 3. Memoize the methods using useCallback
     *
     *
     * So I'll be suppressing the warning for now, but it's temporary. It will be like this until a proper solution
     * is revised for this kind of use case.
     *
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Hook to detect if the tab is changed.
   * If user changes tab with ctrl + shift + tab, shift key press triggers the add Edge mode.
   * However add Edge mode stays ON after user come back to the tab.
   */
  useEffect(() => {
    // eslint-disable-next-line consistent-return
    const getBrowserVisibilityProp = () => {
      if (typeof document.hidden !== "undefined") {
        // Opera 12.10 and Firefox 18 and later support
        return "visibilitychange";
      }
      if (typeof document.msHidden !== "undefined") {
        return "msvisibilitychange";
      }
      if (typeof document.webkitHidden !== "undefined") {
        return "webkitvisibilitychange";
      }
    };

    // eslint-disable-next-line consistent-return
    const getBrowserDocumentHiddenProp = () => {
      if (typeof document.hidden !== "undefined") {
        return "hidden";
      }
      if (typeof document.msHidden !== "undefined") {
        return "msHidden";
      }
      if (typeof document.webkitHidden !== "undefined") {
        return "webkitHidden";
      }
    };

    const getIsDocumentHidden = () => {
      return document[getBrowserDocumentHiddenProp()];
    };

    const onVisibilityChange = () => {
      if (getIsDocumentHidden()) {
        getAutomataNetwork().disableEditMode();
      }
    };

    window.addEventListener(getBrowserVisibilityProp(), onVisibilityChange);

    return () => {
      window.removeEventListener(
        getBrowserVisibilityProp(),
        onVisibilityChange
      );
    };
  }, []);

  /**
   * Handles when Node DialogBox components is closed
   */
  const closeNodeDialogBox = () => {
    const node = getNodeObject();
    NODES.remove(node.id);
    setViewNodeDialog(false);
  };

  /**
   * Handles when Node DialogBox components is closed
   *
   * @param value - Label for the node
   */
  const submitNodeDialogBox = value => {
    const node = getNodeObject();
    NODES.update({ id: node.id, label: value });
    setViewNodeDialog(false);
  };

  /**
   * Handles when Edge DialogBox is closed
   */
  const closeEdgeDialogBox = () => {
    const edge = getEdgeObject();
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
    const edge = getEdgeObject();
    const existingEdge = EDGES.get(edge.id);
    let edgeLabel = value;
    if (existingEdge.label !== undefined) {
      edgeLabel = `${existingEdge.label}, ${value}`;
      let edgeLabelArr = edgeLabel.split(",").map(item => item.trim());
      edgeLabelArr = [...new Set(edgeLabelArr)];
      edgeLabel = edgeLabelArr.join(", ");
    }
    EDGES.update({ id: edge.id, label: edgeLabel });
    setViewEdgeDialog(false);
  };

  /**
   * clear node object when add node dialog box is closed
   */
  useEffect(() => {
    if (!viewNodeDialog) {
      setNodeObject({});
    }
  }, [viewNodeDialog]);

  /**
   * clear edge object when add edge dialog box is closed
   */
  useEffect(() => {
    if (!viewEdgeDialog) {
      setEdgeObject({});
      setNodeObject({});
      disableEditLabelTextBox();
    }
  }, [viewEdgeDialog, disableEditLabelTextBox]);

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
    const automataNetwork = getAutomataNetwork();
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
              inputRef={_editLabelTextBoxRef}
              disabled={disableEditLabel}
              onBlur={handleEditLabelTextBoxOnBlur}
            />
            <div tabIndex={0} ref={_networkRef} className={classes.canvas} />
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
