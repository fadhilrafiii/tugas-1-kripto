import React from 'react';
import { Grid, TextField } from '@material-ui/core';

const MatrixInput = (props) => {
  const { matrix, handleChangeMatrix } = props;

  return (
    <Grid item container spacing={1} className="matrix-input" wrap="nowrap" direction="column">
      {matrix.map((row, i) => (
        <Grid key={i} item container spacing={1} className="matrix-input-row" wrap="nowrap" justifyContent="center">
          {row.map((col, j) => (
            <Grid key={j} item className="matrix-input-cell">
              <TextField
                type="number"
                variant="outlined"
                className="input"
                value={col}
                onChange={(e) => handleChangeMatrix(e.target.value, i, j)}
                onFocus={(e) => e.target.select()}
              />
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  )
}

export default MatrixInput;
