// IMPORT MODULES
import React, { useState, useEffect } from 'react';
import {
  IconButton,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  CircularProgress,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { SwapHoriz, Lock, LockOpen, InsertDriveFile } from '@material-ui/icons'
import axios from 'axios';
import isCoprime from 'is-coprime';
import querystring from 'querystring';
import determinant from 'ndarray-determinant';
import pack from 'ndarray-pack';

//  IMPORT COMPONENT
import MatrixInput from './MatrixInput';

//  IMPORT STYLING
import './index.scss';

// BACKEND BASE URL
const BASE_URL = 'http://127.0.0.1:5000';

function App() {
  const cipherOpt = [
    'Standard Vigenere',
    'Autokey Vigenere',
    'Full Vigenere',
    'Extended Vigenere',
    'Playfair',
    'Affine',
    'Hill',
  ];
  const [swap, setSwap] = useState(true);
  const [cipher, setCipher]= useState('');
  const [num, setNum]= useState(2);
  const [matrix, setMatrix] = useState([[]]);
  const [m, setM] = useState(7);
  const [b, setB] = useState(10);
  const [key, setKey] = useState('');
  const [file, setFile] = useState(null);

  const [data, setData] = useState('');
  const [result, setResult] = useState('');
  const [usedKey, setUsedKey] = useState(null);
  const [conversion, setConversion] = useState(null);

  const [numError, setNumError] = useState('');
  const [matrixError, setMatrixError] = useState('');
  const [errorMB, setErrorMB] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSwap = () => {
    if (result) setData(result); setResult('');
    
    setSwap(!swap);
  }

  const handleCipherChange = (e) => {
    setCipher(e.target.value);
  };

  const handleChangeNum = (e) => {
    setNum(e.target.value);
  }

  const handleChangeMatrix = async (val, i, j) => {
    let newMatrix = [...matrix]
    newMatrix[i][j] = isNaN(parseInt(val)) ? 0 : parseInt(val);
    setMatrix(newMatrix);

    if (determinant(pack(newMatrix)) === 0) {
      setMatrixError('Matrix shouldn\'t have 0 determinant');
    } else {
      setMatrixError('')
    }
  }

  const submitData = async () => {
    const query =  querystring.stringify({
      method: swap ? 'encrypt' : 'decrypt',
      cipher,
    });

    if (data === '') return (setErrorMessage('Text still empty!'));
    if (cipher === '') return (setErrorMessage('Choose algorithm first'));
    if (cipher !== 5 && cipher !== 6 && key === '') return (setErrorMessage('Key still empty!'));
    // if (cipher !== 3 && !/^[a-zA-Z ]+$/.test(data)) return (setErrorMessage(`For ${cipherOpt[cipher]}, text can only contains alphabets!`));
    const payload = {
      data,
      key: cipher === 6 ? matrix : key,
      m: parseInt(m),
      b: parseInt(b),
      usedKey: !swap && cipher === 1 ? usedKey : '',
      conversion: !swap && cipher === 2 ? conversion : '',
    };

    setLoading(true);
    await axios.post(`${BASE_URL}?${query}`, payload)
      .then((res) => {
        setLoading(false);
        setSuccessMessage(`${swap ? 'Encrypt' : 'Decrypt'} success!`);
        if (res.data?.usedKey) setUsedKey(res.data.usedKey);
        if (res.data?.conversion) setConversion(res.data.conversion);
        setResult(res.data.result);
        setErrorMessage(res.data?.message ? res.data?.message : '');
      }).catch((err) => {
        setLoading(false);
        console.log(err);
        setErrorMessage(err.response?.data?.message ? err.response?.data?.message :'Unknown error has occured!');
      })
  }

  const handleInputFile = (e) => {
    if (e.target.files.length) {
      setFile(e.target.files[0]);
      const formatFile = e.target.files[0].name.slice(-4);

      const reader = new FileReader()

      reader.onload = async (e) => { 
        let text = (e.target.result)

        if (formatFile !== '.txt') {
          text = btoa(unescape(encodeURIComponent(text)));
        console.log(text);

        }
        console.log(text);
        setData(text);
      };
      reader.readAsText(e.target.files[0])
    }
  }

  const  downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([result], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${swap ? 'encrypt' : 'decrypt'}-${cipherOpt[cipher]}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }
  
  useEffect(() => {
    if (successMessage || errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
        setSuccessMessage('');
      }, 4000);
    }
  }, [successMessage, errorMessage])

  useEffect(() => {
    if (num < 1) {
      setNumError('Must be a positive number!');
    } else {
      setNumError('');
      const newMatrix = [];
      for (let i = 0; i < num; i++) {
        newMatrix[i] = [];
        for (let j = 0; j < num; j++) {
          newMatrix[i][j] = 0;
        }
      }
      
      setTimeout(() => {
        setMatrix(newMatrix);
      }, 500)
    }
  }, [num]);

  useEffect(() => {
    if (!isNaN(parseInt(m)) && !isNaN(parseInt(b))) {
      if (!isCoprime(parseInt(m), parseInt(b))) setErrorMB('M and B should be coprime!');
      else setErrorMB('');
    } else {
      setErrorMB('');
    }
  }, [m, b]);

  return (
    <Grid item container className="App">
      {(Boolean(successMessage) || Boolean(errorMessage)) && (
        <Alert
          className="alert"
          variant="filled"
          severity={successMessage ? 'success' : 'error'}
          onClose={() => {
            setSuccessMessage('');
            setErrorMessage('');
          }}
        >
          {successMessage || errorMessage}
        </Alert>
      )}
      <header className="header">
        <div>Cipher Algorithm</div>
      </header>
      <Grid item container className="box">
        <Grid item container className="container">
          <Grid item container lg={5} className="left">
            <Grid item container wrap="nowrap" className="title-input mb">
              <h3>
                {swap ? 'Plain Text' : 'Cipher Text'}
              </h3>
              <input
                valu={file}
                accept={cipher === 3 ? '' : "text/plain"}
                style={{ display: 'none' }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleInputFile}
              />
              <label htmlFor="raised-button-file">
                <IconButton variant="raised" component="span">
                  <InsertDriveFile />
                </IconButton>
              </label> 
            </Grid>
            <TextField
              value={data}
              onChange={(e) => setData(e.target.value)}
              fullWidth
              className="input mb"
              variant="outlined"
              multiline
              minRows={10}
              maxRows={10}
              autoFocus
            />
            {file?.name && <div className="error mb">{`You uploaded ${file.name}!`}</div>}
          </Grid>
          <Grid item container lg={2} className="swap-btn">
            <IconButton onClick={handleSwap}>
              <SwapHoriz fontSize="large" />
            </IconButton>
          </Grid>
          <Grid item container lg={5} className="right">
            <h3>{swap ? 'Cipher Text' : 'Plain Text'}</h3>
            <TextField
              value={result}
              className="input mb"
              variant="outlined"
              multiline
              minRows={10}
              maxRows={10}
              InputProps={{
                readOnly: true
              }}
            />
          {result && <div className="download" onClick={downloadTxtFile}>Download result in .txt</div>}
          </Grid>
        </Grid>
        <Grid item container direction="column" className="submit-section">
          {cipher === 3 && <div className="mb error">Now you can upload other than .txt files</div>}
          <FormControl variant="filled" className="dropdown">
            <InputLabel id="demo-simple-select-filled-label">Cipher Algorithm</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={cipher}
              onChange={handleCipherChange}
            >
              {cipherOpt.map((label, index) => (
                <MenuItem key={index} value={index}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {cipher !== '' && cipher !== 5 && cipher !== 6 && (
            <TextField
              variant="filled"
              className="input num mb"
              value={key}
              label="Key"
              placeholder="Key"
              required
              onChange={(e) => setKey(e.target.value)}
            />
          )}
          {cipher === 5 && (
            <>
              <Grid item container spacing={2} justifyContent="center">
                <Grid item>
                  <TextField
                    variant="filled"
                    className="input num"
                    type="number"
                    value={m}
                    label="M"
                    placeholder="M"
                    required
                    onChange={(e) => setM(e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    variant="filled"
                    className="input num"
                    type="number"
                    value={b}
                    label="B"
                    placeholder="B"
                    required
                    onChange={(e) => setB(e.target.value)}
                  />
                </Grid>
              </Grid>
              <div className="error mb">{errorMB}</div>
            </>
          )} 
          {cipher === 6 && (
            <>
              <TextField
                variant="filled"
                className="input num"
                type="number"
                value={num}
                label="Matrix Dimension"
                placeholder="Matrix Dimension"
                required
                onChange={handleChangeNum}
                helperText={<div className="error">{numError}</div>}
              />
              <h3>Input Key Matrix</h3>
              <Grid item container className="matrix-input-container">
                <MatrixInput matrix={matrix} handleChangeMatrix={handleChangeMatrix} />
              </Grid>
              <div className="error mb">{matrixError}</div>
            </>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={submitData}
            size="large"
            className="submit-btn"
            startIcon={loading ? <CircularProgress size={15} /> : swap ? <Lock /> : <LockOpen />}
          >
            {swap ? 'ENCRYPT' : 'DECRYPT'}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
