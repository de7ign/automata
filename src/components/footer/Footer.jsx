import React from "react";
import { AppBar, Typography, Grid } from "@material-ui/core";

const Footer = () => {
  return (
    <AppBar
      position="static"
      style={{ background: "#eceff1", boxShadow: "none" }}
    >
      <Grid container style={{ marginTop: 80, marginBottom: 80 }}>
        <Grid item xs={3} />
        <Grid item xs={9} style={{ marginBottom: 20 }}>
          <Typography variant="title">Quick Links</Typography>
        </Grid>
        <Grid item xs={3} />
        <Grid item xs={2}>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            <li>
              <a href="https://github.com/nihalmurmu/Automata">
                <Typography variant="subtitle1">Github</Typography>
              </a>
            </li>
            <li>
              <a href="https://github.com/nihalmurmu/Automata">
                <Typography variant="subtitle1">Examples</Typography>
              </a>
            </li>
          </ul>
        </Grid>
        <Grid item>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            <li>
              <a href="https://github.com/nihalmurmu/Automata">
                <Typography variant="subtitle1">Tutorial</Typography>
              </a>
            </li>
            <li>
              <a href="https://github.com/nihalmurmu/Automata">
                <Typography variant="subtitle1">Any Suggestion ?</Typography>
              </a>
            </li>
          </ul>
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default Footer;
