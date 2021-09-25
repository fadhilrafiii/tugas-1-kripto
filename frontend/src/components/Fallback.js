import React from "react";
import { CircularProgress, Backdrop } from "@material-ui/core";

export const Fallback = () => {
  return (
    <Backdrop open className="fully-loading">
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
