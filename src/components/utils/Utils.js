import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Build, Share, ArrowDownward, ArrowUpward, Delete, Autorenew } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'

class Utils extends Component {
  render() {
    return (
      <Paper elevation={12} style={{margin: 20, padding: 20, width: "100%"}}>
        <Typography variant="subtitle1" style={{display: "inline-block", verticalAlign: "middle", margin: 5}}>
          <Build style={{ verticalAlign: "middle", margin: 5}} />
          Test
        </Typography>
        <div style={{marginLeft: 20, marginTop: 20, marginRight: 20}}>
          <TextField
            id="outlined-string-input"
            label="String"
            margin="none"
            variant="outlined"
            fullWidth
          />
        </div>
        <div style={{marginLeft: 10, marginBottom: 10}}>
          <Button variant="contained" style={{margin: 10, backgroundColor: '#42a5f5',  color: "white", width: "10em"}}>
            Test &nbsp;<Build />
          </Button>
        </div>
        <Divider />
        <Typography variant="subtitle1" style={{display: "inline-block", verticalAlign: "middle", margin: 5}}>
          <Autorenew style={{ verticalAlign: "middle", margin: 5}} />
          Convert
        </Typography>
        <div style={{margin: 10}}>
          <Button variant="contained" style={{margin: 10, backgroundColor: '#42a5f5',  color: "white", width: "10em"}}>
            Convert &nbsp;<Autorenew />
          </Button>
        </div>
        <Divider />
        <Typography variant="subtitle1" style={{display: "inline-block", verticalAlign: "middle", margin: 5}}>
          <Share style={{ verticalAlign: "middle", margin: 5}} >Share </Share>
          Share
        </Typography>
        <div style={{margin: 10}}>
          <Button variant="contained" style={{margin: 10, backgroundColor: '#42a5f5',  color: "white", width: "10em"}}>
            Export &nbsp;<ArrowDownward />
          </Button>
          <Button variant="contained" style={{margin: 10, backgroundColor: '#42a5f5', color: "white", width: "10em"}}>
            Import &nbsp;<ArrowUpward />
          </Button>
        </div>
        <Divider />
        <Typography variant="subtitle1" style={{display: "inline-block", verticalAlign: "middle", margin: 5}}>
          <Delete style={{ verticalAlign: "middle", margin: 5}} />
          Clear Workspace
        </Typography>
        <div style={{margin: 10}}>
          <Button variant="contained" style={{margin: 10, backgroundColor: '#42a5f5', color: "white", width: "10em"}}>
            Clear &nbsp;<Delete/>
          </Button>
        </div>
      </Paper>
    )
  }
}

export default Utils;
