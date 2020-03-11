import React, { useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from "@material-ui/core";
import PropTypes from "prop-types";

const DialogBox = props => {
  const {
    dialogTexts: { dialogTitle, dialogContentText, warningText },
    open,
    submit,
    close
  } = props;

  const inputRef = useRef(null);
  const [inputError, setInputError] = useState(false);

  const handleEnterButton = () => {
    const textInput = inputRef.current.value.trim();
    if (textInput === "") {
      setInputError(true);
      return;
    }
    submit(textInput);
  };

  const handleCancelButton = () => {
    close();
  };

  return (
    <Dialog open={open} onClose={close} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogContentText}</DialogContentText>
        {inputError ? (
          <DialogContentText style={{ color: "red" }}>
            {warningText}
          </DialogContentText>
        ) : (
          ""
        )}
        <TextField
          autoFocus
          autoComplete="off"
          margin="dense"
          id="label"
          inputRef={inputRef}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelButton} color="primary">
          Cancel
        </Button>
        <Button onClick={handleEnterButton} color="primary">
          Enter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogBox.propTypes = {
  dialogTexts: PropTypes.objectOf(PropTypes.string).isRequired,
  open: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};

export default DialogBox;
