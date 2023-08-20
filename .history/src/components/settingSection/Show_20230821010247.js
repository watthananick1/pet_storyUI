import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";


export default function Show() {
  return (
    <div>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={12} lg={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
              
            }}
          >
            {/* <Chart /> */}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
