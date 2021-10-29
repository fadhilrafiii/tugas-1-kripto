// IMPORT MODULES
import React, { useState, useEffect, useMemo } from "react";
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { Lock, LockOpen, VpnKey } from "@material-ui/icons";
import axios from "axios";
import isCoprime from "is-coprime";
import querystring from "querystring";

//  IMPORT COMPONENT
import { PairTextArea, Alert } from "components";

// BACKEND BASE URL
import { API_URL } from "constant";

// IMPORT UTILS
import { isLongInteger, isPrime } from 'utils/helper'; 

function Cryptography() {
  const cipherOpt = [
    "RSA",
    "Paillier",
    "El-Gamall",
    "ECC",
  ];
  const [swap, setSwap] = useState(true);
  const [cipher, setCipher] = useState("");
  const [key, setKey] = useState({
    e: 7,
    p: 11,
    q: 13,
  });

  const [data, setData] = useState("");
  const [result, setResult] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSwap = () => {
    if (result) setData(result);
    setResult("");

    setSwap(!swap);
  };

  const handleChangeKey = (e) => {
    const { name, value } = e.target;
    console.log(parseInt(value.toString().replace(/^0/, "")))
    setKey((prev) => ({ 
      ...prev, 
      [name]: !value 
        ? 0 
        : parseInt(value.toString().replace(/^0/, ""))
    }));
  }

  const handleCipherChange = (e) => {
    setCipher(e.target.value);
  };

  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([result], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${swap ? "encrypt" : "decrypt"}-${
      cipherOpt[cipher]
    }.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 4000);
    }
  }, [successMessage, errorMessage]);

  const errorKey = useMemo(() => {
    const { e, p, q } = key;
    const psi = (p - 1) * (q - 1);
    if (!isLongInteger(p) || p === 0) return 'P should be non zero long integer!';
    if (!isLongInteger(q) || q === 0) return 'Q should be non zero long integer!';
    if (!isPrime(p)) return 'P should be prime number!'
    if (!isPrime(q)) return 'Q should be prime number!'
    if (!isCoprime(p, q)) return 'P & Q should be coprime!';
    if (e < 1 || e > psi) return `E should be between 1 and Psi = ${psi}`
    if (!isCoprime(e, psi)) return `E should be coprime with Psi = ${psi}`;
    if (!isCoprime(e, p * q)) return `E should be coprime with P*Q = ${p*q}`;

    return '';
  }, [key])

  return (
    <Grid item container className="cryptography">
      <Alert
        type={successMessage ? "success" : "error"}
        message={successMessage || errorMessage}
        setMessage={() => {
          setErrorMessage("");
          setSuccessMessage("");
        }}
      />
      <Grid item container className="box">
        <h1 className="title-page">Public-Key Algorithm</h1>
        <FormControl variant="filled" className="dropdown center">
          <InputLabel id="demo-simple-select-filled-label">
            Algorithm
          </InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={cipher}
            onChange={handleCipherChange}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              getContentAnchorEl: null,
            }}
          >
            {cipherOpt.map((label, index) => (
              <MenuItem key={index} value={index}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Grid container direction="column" alignItems="center">
          <h2 style={{ color: '#265158' }}>Key</h2>
          <Grid container spacing={2} style={{ width: '60%', margin: '10px auto' }}>
            <Grid item md={4}>
              <FormControl className="dropdown unset-width">
                <TextField
                  variant="filled"
                  value={key.p}
                  type="number"
                  name="p"
                  label="P"
                  placeholder="Type value for P"
                  onFocus={(e) => e.target.select()}
                  onChange={handleChangeKey}
                />
              </FormControl>
            </Grid>
            <Grid item md={4}>
              <FormControl className="dropdown unset-width">
                <TextField
                  variant="filled"
                  value={key.q}
                  type="number"
                  name="q"
                  label="Q"
                  placeholder="Type value for Q"
                  onFocus={(e) => e.target.select()}
                  onChange={handleChangeKey}
                />
              </FormControl>
            </Grid>
            <Grid item md={4}>
              <FormControl className="dropdown unset-width">
                <TextField
                  variant="filled"
                  value={key.e}
                  type="number"
                  label="E"
                  name="e"
                  placeholder="Type value for E"
                  onFocus={(e) => e.target.select()}
                  onChange={handleChangeKey}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <div className="error-key">{errorKey}</div>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            onClick={console.log}
            size="large"
            className="submit-btn"
            startIcon={
              loading ? (
                <CircularProgress size={15} />
              ) : swap ? (
                <VpnKey fontSize="16" />
              ) : (
                <LockOpen />
              )
            }
          >
            GENERATE KEY
          </Button>
        </Grid>
        <PairTextArea
          type="crypto"
          swap={swap}
          cipher={cipher}
          data={data}
          setData={setData}
          result={result}
          onSwap={handleSwap}
          onDownload={downloadTxtFile}
        />
        <Grid item container direction="column" className="submit-section">
          <Button
            variant="contained"
            color="primary"
            onClick={console.log}
            size="large"
            className="submit-btn"
            startIcon={
              loading 
                ? <CircularProgress size={15} />
                : <Lock />
            }
          >
            {swap ? "ENCRYPT" : "DECRYPT"}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Cryptography;
