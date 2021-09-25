import React from 'react';
import { CircularProgress, Backdrop } from '@material-ui/core';

const Fallback = () => {
  return (
    <Backdrop open className="fully-loading">
      <CircularProgress color="inherit" />
    </Backdrop>
  )
};

export default Fallback;
