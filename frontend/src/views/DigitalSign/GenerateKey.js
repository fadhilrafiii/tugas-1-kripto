import React, { useState, useCallback, useEffect } from 'react';
import {
  Grid,
  FormControl,
  TextField,
  CircularProgress,
  Button
} from '@material-ui/core';
import { VpnKey } from "@material-ui/icons";
import axios from 'axios';

import { isPrime, isCoprime, downloadTxtFile } from 'utils/helper'; 

import { API_URL } from 'constant';

const GenerateKey = ({ setSuccess, setError }) => {
  const [loading, setLoading] = useState(false);
  const [rsaKey, setRsaKey] = useState({
    e: '',
    p: '',
    q: '',
  });
  const [errorKey, setErrorKey] = useState('');
  const [generatedKey, setGeneratedKey] = useState({
    public: '',
    private: '',
  });

  const handleChangeKey = (e) => {
    const { name, value } = e.target;

    setRsaKey((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isButtonDisabled = () => {
    return Object.keys(rsaKey).find((key) => !key);
  };

  const generateErrorKey = useCallback(async () => {
    const { e, p, q } = rsaKey;
    const psi = (p - 1) * (q - 1);
    if (p && !isPrime(p)) return setErrorKey('P should be prime number!')
    if (q && !isPrime(q)) return setErrorKey('Q should be prime number!')
    if (p && q) {
      const isCoprimePQ = await isCoprime(p, q);
      if (!isCoprimePQ) return setErrorKey('P & Q should be coprime!');
    }
    if (e && p && q) {
      if (e < 1 || e > psi) return setErrorKey(`E should be between 1 and Psi = ${psi}`)
      const isCoprimePPsi = await isCoprime(e, psi);
      if (!isCoprimePPsi) return setErrorKey(`E should be coprime with Psi = ${psi}`);
      const isCoprimeEPQ = await isCoprime(e, p * q)
      if (!isCoprimeEPQ) return setErrorKey(`E should be coprime with P*Q = ${p*q}`);
    }

    return setErrorKey('');
  }, [rsaKey]);

  useEffect(() => {
    const interval = setTimeout(() => {
      generateErrorKey();
    }, 500);
    return () => clearTimeout(interval);
  }, [generateErrorKey]);

  const fetchGenerateKey = async () => {
    setLoading(true);
    await axios
      .post(`${API_URL}/generate-key?type=RSA`, rsaKey)
      .then((res) => {
        setLoading(false);
        setSuccess('Generate key success!');
        const data = res.data;
        Object.keys(data).forEach((key) => {
          if (key !== 'string') {
            data[key] = data[key].join(', ')
          }
        });
        setGeneratedKey(data)
      })
      .catch((err) => {
        setLoading(false);
        setError(
          err.response?.data?.error
            ? err.response?.data?.error.split('"')[1] || err.response?.data?.error
            : "Unknown error has occured!"
        );
      });
  };

  return (
    <Grid container direction="column" alignItems="center" className="generate-key">
      <h3 className="subtitle">Input RSA Key</h3>
      <Grid container spacing={2} justifyContent="center">
        {Object.keys(rsaKey).map((key) => (
          <Grid item md={3} key={key}>
            <FormControl className="dropdown unset-width">
              <TextField
                style={{ background: 'white' }}
                variant="filled"
                value={rsaKey[key]}
                type="number"
                name={key}
                label={key.toUpperCase()}
                placeholder={`Type value for ${key.toUpperCase()}`}
                onFocus={(e) => e.target.select()}
                onChange={handleChangeKey}
              />
            </FormControl>
          </Grid>
        ))}
      </Grid>
      <div className="error-key" style={{ margin: '10 auto 25' }}>{errorKey || <br />}</div>
      <Button
        variant="contained"
        color="primary"
        disabled={isButtonDisabled()}
        onClick={fetchGenerateKey}
        size="large"
        className="submit-btn"
        startIcon={
          loading 
          ? <CircularProgress size={15} />
          : <VpnKey fontSize="medium" />
        }
      >
        GENERATE KEY
      </Button>
      {generatedKey.public && (
        <div className="download" onClick={() => downloadTxtFile(generatedKey.public)}>
          Download public key in .txt
        </div>
      )}
      {generatedKey.private && (
        <div className="download" onClick={() => downloadTxtFile(generatedKey.private)}>
          Download private key in .txt
        </div>
      )}
    </Grid>
  )
};

export default GenerateKey;
