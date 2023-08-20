import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from '@mui/material/Typography';

export default function SetInformation() {
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
              width: "100%",
            }}
          >
          <Typography variant="h6" gutterBottom>
        h6. Heading
      </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
