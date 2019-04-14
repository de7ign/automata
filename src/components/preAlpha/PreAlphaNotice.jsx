import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const PreAlphaNotice = () => {
  return (
    <Card
      style={{ marginLeft: 20, marginRight: 20, marginBottom: 20, padding: 20 }}
      id="notice"
      elevation={12}
    >
      <CardContent>
        <Typography variant="title" gutterBottom>
          Pre-Alpha Release
        </Typography>
        <Typography variant="body1">
          Application is in pre-alpha phase
          <br />
          This web application is currently in the stages of its development.
          <br />
          It has some quirks and many parts are not yet available.
          <br />
          We are working hard to finalize the Application&apos;s structure, and
          roughly once every two weeks we roll out new functionality towards
          this goal.
          <br />
          Until then you may notice that some resources move or even disappear
          for a while.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PreAlphaNotice;
