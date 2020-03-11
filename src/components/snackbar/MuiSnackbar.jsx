import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const MuiSnackbar = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [alertData, setAlertData] = useState({
    variant: "",
    message: ""
  });

  useImperativeHandle(ref, () => ({
    openSnackbar: (variant, message) => {
      if (open) return;
      setAlertData({
        variant,
        message
      });
      setOpen(true);
    }
  }));

  const handleOnClose = reason => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleOnClose}
      anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
    >
      <Alert variant="filled" severity={alertData.variant}>
        {alertData.message}
      </Alert>
    </Snackbar>
  );
});

export default MuiSnackbar;
