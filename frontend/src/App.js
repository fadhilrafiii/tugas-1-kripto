import React, { useState } from 'react';
import {
  IconButton,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button
} from '@material-ui/core'
import './index.scss';
import { SwapHoriz, Lock, LockOpen } from '@material-ui/icons'
import './index.scss';

function App() {
  const cipherOpt = [
    'Standard Vigenere',
    'Autokey Vigenere',
    'Full Vigenere',
    'Extended Vigenere',
    'Playfair',
    'Affine',
    'Hill'
  ];
  const [swap, setSwap] = useState(true);
  const [cipher, setCipher]= useState('');

  const handleCipherChange = (e) => {
    setCipher(e.target.value);
  };

  return (
    <Grid item container className="App">
      <header className="header">
        <div>Cipher Algorithm</div>
      </header>
      <Grid item container className="box">
        <Grid item container className="container">
          <Grid item container lg={5} className="left">
            <h3>{swap ? 'Plain Text' : 'Cipher Text'}</h3>
            <TextField
              fullWidth
              className="input"
              variant="outlined"
              multiline
              minRows={8}
              maxRows={12}
              autoFocus
            />
          </Grid>
          <Grid item container lg={2} className="swap-btn">
            <IconButton aria-label="delete" onClick={() => setSwap((prev) => !prev)}>
              <SwapHoriz fontSize="large" />
            </IconButton>
          </Grid>
          <Grid item container lg={5} container className="right">
            <h3>{swap ? 'Cipher Text' : 'Plain Text'}</h3>
            <TextField
              className="input"
              variant="outlined"
              multiline
              readOnly
              minRows={8}
              maxRows={12}
            />
          </Grid>
        </Grid>
        <Grid item container direction="column" className="submit-section">
          <FormControl variant="filled" className="dropdown">
            <InputLabel id="demo-simple-select-filled-label">Cipher Algorithm</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={cipher}
              onChange={handleCipherChange}
            >
              {cipherOpt.map((label, index) => (
                <MenuItem value={index}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={swap ? <Lock /> : <LockOpen />}
          >
            {swap ? 'ENCRYPT' : 'DECRYPT'}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
