import React from "react";
import { Paper } from "@material-ui/core";
import "../../engine/fsm";

const Canvas = () => {
  return (
    <Paper
      elevation={12}
      style={{
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 20,
        padding: 20,
        display: "inline-block"
      }}
    >
      <div id="main" role="main">
        <div
          style={{
            border: "solid 3px #33C3F0",
            display: "inline-block",
            borderRadius: "5px"
          }}
        >
          <canvas id="canvas" width="1200" height="700">
            <p>Canvas element is not supported</p>
          </canvas>
        </div>
      </div>
    </Paper>
  );
};

export default Canvas;
