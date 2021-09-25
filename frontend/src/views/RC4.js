// IMPORT MODULES
import React, { useState } from 'react';
import { Grid, TextField, CircularProgress, Button } from '@material-ui/core';
import { Lock, LockOpen } from '@material-ui/icons';
 
// IMPORT COMPONENTS
import PairTextArea from 'components/PairTextArea';

const RC4 = () => {
  const [loading, setLoading] = useState(false);
  const [swap, setSwap] = useState(false);
  const [data, setData] = useState('');
  const [result, setResult] = useState('');
  const [key, setKey] = useState('');

  const handleSwap = () => {
    setSwap(prev => !prev)
  };

  return (
    <div className="rc4">
      <Grid item container className="box">
        <PairTextArea
          type="crypto"
          swap={swap}
          // cipher={cipher}
          data={data}
          setData={setData}
          result={result}
          onSwap={handleSwap}
          // onDownload={downloadTxtFile}
        />
        <Grid item container direction="column" className="submit-section">
          <TextField
            variant="filled"
            className="input num mb"
            value={key}
            label="Key"
            placeholder="Key"
            required
            onChange={(e) => setKey(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={console.log}
            size="large"
            className="submit-btn"
            startIcon={loading ? <CircularProgress size={15} /> : swap ? <Lock /> : <LockOpen />}
          >
            {swap ? 'ENCRYPT' : 'DECRYPT'}
          </Button>
        </Grid>
      </Grid>
    </div>
  )
};

export default RC4;
