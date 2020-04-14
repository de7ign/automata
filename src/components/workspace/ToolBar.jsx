import React, { useRef, useState } from "react";
import {
  Paper,
  Typography,
  Divider,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Dialog
} from "@material-ui/core";
import { Build, Share, Delete, Autorenew, Warning } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import fileDownload from "js-file-download";
import PropTypes from "prop-types";

import computeDFA from "../../engine/dfa";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing.unit,
    height: "85vh"
  },
  divUtil: {
    height: "100%"
  },
  icon: {
    margin: theme.spacing.unit,
    verticalAlign: "middle",
    fontSize: "large"
  },
  buttons: {
    marginTop: theme.spacing.unit
  }
}));

const ToolBar = props => {
  const {
    /**
     * Clears the Network except the start node
     */
    clearNetwork,
    /**
     * Accepts Network DataSet and update the Network
     *
     * @param - Object - network data, can be of type DataSet or JSON Object
     */
    updateNetwork,
    /**
     * Returns network DataSet
     *
     * @return Object - Object of node and edge DataSet <pre>{nodes: DataSet, edges: DataSet}</pre>
     */
    getNetworkDataSet,
    /**
     * Returns network canvas content as string
     *
     * @return string
     */
    getImageBlob,
    /**
     * Opens a snackbar notification
     *
     * @param string - variant ["error", "warning", "info", "success"]
     */
    snackbar
  } = props;
  const [isExportDialogOpen, setExportDialogOpen] = useState(false);
  const testInputRef = useRef();

  /**
   * Handles when clear button is clicked
   */
  const handleClearOnClick = () => {
    clearNetwork();
  };

  /**
   * Handles when a file is selected for upload
   *
   * @param target
   */
  const handleImportOnChange = ({ target }) => {
    const fileReader = new FileReader();
    const { files } = target;

    fileReader.readAsText(files[0]);
    fileReader.onload = e => {
      clearNetwork();
      const importData = JSON.parse(e.target.result);
      // TODO: verify the JSON schema
      updateNetwork(importData);
    };
    // change the file input
    // eslint-disable-next-line no-param-reassign
    target.value = null;
  };

  /**
   * Handles when export button is clicked
   */
  const handleExportOnClick = () => {
    setExportDialogOpen(true);
  };

  /**
   * Handles when export dialog close button is clicked
   */
  const handleExportDialogOnClose = () => {
    setExportDialogOpen(false);
  };

  /**
   *  Gets the network canvas data and prompts to download as PNG
   */
  const exportAsPNG = () => {
    setExportDialogOpen(false);
    const imgBlob = getImageBlob();
    const download = document.createElement("a");
    download.href = imgBlob;
    download.download = "export.png";
    download.click();
    download.remove();
  };

  /**
   * Gets the network data and prompts to download as JSON
   */
  const exportAsJSON = () => {
    const networkDataSet = getNetworkDataSet();
    const payloadJSON = {
      nodes: networkDataSet.nodes.get(),
      edges: networkDataSet.edges.get()
    };
    const payload = JSON.stringify(payloadJSON);
    fileDownload(payload, "export.json");
    setExportDialogOpen(false);
  };

  /**
   * Handles when export as PNG in export dialog is clicked
   */
  const handleExportAsPNGOnClick = () => {
    exportAsPNG();
  };

  /**
   * Handles when export as JSON in export dialog is clicked
   */
  const handleExportAsJSONOnClick = () => {
    exportAsJSON();
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
   * Handles when test button is clicked
   */
  const handleTestOnClick = () => {
    const testInput = testInputRef.current.value.trim();
    const data = getNetworkDataSet();
    if (testInput !== "") {
      try {
        const { valid, accepted, acceptedNodeLabel } = computeDFA(
          testInput,
          data
        );
        if (valid) {
          if (accepted) {
            notification("success", `Accepted! on state ${acceptedNodeLabel}`);
          } else {
            notification("error", "Rejected!");
          }
        } else {
          notification("error", "Oops! This doesn't look like a DFA");
        }
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.log(`${e.name} : ${e.message}`);
        }
      }
    }
  };

  const classes = useStyles();
  return (
    <>
      <Paper className={classes.paper} elevation={6}>
        <div className={classes.divUtil}>
          <Typography variant="overline" color="secondary">
            <Warning className={classes.icon} />
            This Toolbar is in work in progress.
            <br />
            Until finalised you may notice some tools move, redesigned or even
            disappear for a while
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
            inputRef={testInputRef}
          />
          <Button
            variant="outlined"
            fullWidth
            onClick={handleTestOnClick}
            style={{ marginTop: "4px" }}
          >
            Test
          </Button>
          {/* <br /> */}
          {/* <IconButton style={{ color: "#000000" }}> */}
          {/*  <SkipPrevious /> */}
          {/* </IconButton> */}
          {/* {playing ? ( */}
          {/*  <IconButton */}
          {/*    style={{ color: "#000000" }} */}
          {/*    onClick={this.handlePlayPauseToggle} */}
          {/*  > */}
          {/*    <Pause /> */}
          {/*  </IconButton> */}
          {/* ) : ( */}
          {/*  <IconButton */}
          {/*    style={{ color: "#000000" }} */}
          {/*    onClick={this.handlePlayPauseToggle} */}
          {/*  > */}
          {/*    <PlayArrow /> */}
          {/*  </IconButton> */}
          {/* )} */}
          {/* <IconButton style={{ color: "#000000" }}> */}
          {/*  <SkipNext /> */}
          {/* </IconButton> */}
          {/* <IconButton */}
          {/*  style={{ color: "#000000" }} */}
          {/*  onClick={this.handleStopClick} */}
          {/* > */}
          {/*  <Stop /> */}
          {/* </IconButton> */}

          <br />
          <br />

          <Typography variant="overline">
            <Autorenew className={classes.icon} />
            Convert
          </Typography>
          <Divider />
          <Button variant="outlined" fullWidth className={classes.buttons}>
            Convert
          </Button>

          <br />
          <br />

          <Typography variant="overline">
            <Share className={classes.icon} />
            Share
          </Typography>
          <Divider />
          <Button
            variant="outlined"
            fullWidth
            onClick={handleExportOnClick}
            className={classes.buttons}
          >
            Export
          </Button>

          <label htmlFor="icon-button-photo">
            <input
              accept=".json"
              id="icon-button-photo"
              onChange={handleImportOnChange}
              type="file"
              hidden
            />
            <Button
              variant="outlined"
              component="span"
              fullWidth
              className={classes.buttons}
            >
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
          <Button
            variant="outlined"
            fullWidth
            onClick={handleClearOnClick}
            className={classes.buttons}
          >
            Clear
          </Button>
        </div>
      </Paper>
      <Dialog
        open={isExportDialogOpen}
        onClose={handleExportDialogOnClose}
        aria-labelledby="export-as-dialog"
      >
        <DialogTitle id="export-as-dialog">Export</DialogTitle>

        <DialogContent>
          <DialogContentText>Please choose an export format</DialogContentText>
          <div style={{ paddingTop: 4, paddingBottom: 4 }}>
            <Button
              variant="outlined"
              fullWidth
              style={{ marginTop: 4, marginBottom: 4 }}
              onClick={handleExportAsJSONOnClick}
            >
              as JSON
            </Button>
            <Button
              variant="outlined"
              fullWidth
              style={{ marginTop: 4, marginBottom: 4 }}
              onClick={handleExportAsPNGOnClick}
            >
              as PNG
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

ToolBar.propTypes = {
  clearNetwork: PropTypes.func.isRequired,
  updateNetwork: PropTypes.func.isRequired,
  getNetworkDataSet: PropTypes.func.isRequired,
  getImageBlob: PropTypes.func.isRequired,
  snackbar: PropTypes.func.isRequired
};

export default ToolBar;
