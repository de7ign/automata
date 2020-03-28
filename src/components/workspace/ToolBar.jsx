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

const useStyles = makeStyles(theme => ({
  paper: {
    display: "flex",
    alignItems: "stretch",
    padding: theme.spacing.unit,
    height: "85vh"
  },
  divUtil: {
    flex: 1
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
  const { clearNetwork, updateNetwork, getNetworkData, getImageBlob } = props;
  const [isExportDialogOpen, setExportDialogOpen] = useState(false);
  const testInput = useRef();

  const handleClearOnClick = () => {
    clearNetwork();
  };

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

  const handleExportOnClick = () => {
    setExportDialogOpen(true);
  };

  const handleExportDialogOnClose = () => {
    setExportDialogOpen(false);
  };

  const exportAsPNG = () => {
    setExportDialogOpen(false);
    const imgBlob = getImageBlob();
    const download = document.createElement("a");
    download.href = imgBlob;
    download.download = "export.png";
    download.click();
    download.remove();
  };

  const exportAsJSON = () => {
    const payloadJSON = getNetworkData();
    const payload = JSON.stringify(payloadJSON);
    fileDownload(payload, "export.json");
    setExportDialogOpen(false);
  };

  const handleExportAsPNGOnClick = () => {
    exportAsPNG();
  };

  const handleExportAsJSONOnClick = () => {
    exportAsJSON();
  };

  const handleTestOnClick = () => {
    // TODO: complete the method
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
            inputRef={testInput}
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
  getNetworkData: PropTypes.func.isRequired,
  getImageBlob: PropTypes.func.isRequired
};

export default ToolBar;
