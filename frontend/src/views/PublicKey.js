// IMPORT MODULES
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import { Lock, LockOpen, VpnKey, ArrowDropDown } from "@material-ui/icons";
import axios from "axios";
import querystring from "querystring";

//  IMPORT COMPONENT
import { PairTextArea, Alert } from "components";

// BACKEND BASE URL
import { API_URL } from "constant";

// IMPORT UTILS
import { isLongInteger, isPrime, isCoprime } from 'utils/helper'; 

function Cryptography() {
  const cipherOpt = [
    "RSA",
    "Paillier",
    "El-Gamal",
    "ECC",
  ];
  const [swap, setSwap] = useState(true);
  const [cipher, setCipher] = useState('');
  const [cipherKey, setCipherKey] = useState({});
  const [key, setKey] = useState({
    public: null,
    private: null,
  });
  const [eccPoints, setEccPoints] = useState([]);
  const [selectedBasePoint, setSelectedBasePoints] = useState('');

  const [data, setData] = useState("");
  const [result, setResult] = useState("");

  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorKey, setErrorKey] = useState('')

  const handleSwap = () => {
    if (result) setData(result);
    setResult("");

    setSwap(!swap);
  };

  const handleChangeKey = (e) => {
    const { name, value } = e.target;
    setCipherKey((prev) => ({ 
      ...prev, 
      [name]: !value 
        ? 0 
        : parseInt(value.toString().replace(/^0/, ""))
    }));
  }

  const handleCipherChange = (e) => {
    setCipher(e.target.value);
    if (e.target.value === 0) {
      setCipherKey({
        e: 7,
        p: 11,
        q: 13,
      });
    }
    else if (e.target.value === 1) {
      setCipherKey({})
    }
    else if (e.target.value === 2) {
      setCipherKey({
        p: 7,
        g: 11,
        x: 13,
        k: 17,
      });
    }
    else if (e.target.value === 3) {
      setCipherKey({
        a: 1,
        b: 6,
        p: 11,
        m: null,
      });
    }
  };

  const handlePointChange = (e) => {
    setSelectedBasePoints(e.target.value)
  }

  const getAvailableECCPoints = useCallback(async () => {
    if (cipher === 3 && cipherKey.a && cipherKey.b && cipherKey.p) {
      const payload = {
        a: cipherKey.a,
        b: cipherKey.b,
        p: cipherKey.p,
      }
  
      setLoadingDropdown(true);
      await axios
        .post(`${API_URL}/available-ecc-points`, payload)
        .then((res) => {
          setLoadingDropdown(false);
          setEccPoints(res.data);
        })
        .catch((err) => {
          setLoadingDropdown(false);
          setErrorMessage(
            err.response?.data?.error
              ? err.response?.data?.error.split('"')[1] || err.response?.data?.error
              : "Fetching available ECC points failed!"
          );
        });
    }
  }, [cipher, cipherKey.a, cipherKey.b, cipherKey.p]);

  const fetchGenerateKey = async () => {
    const query = querystring.stringify({
      type: cipherOpt[cipher],
    });

    const payload = cipherKey;
    if (cipher === 3) {
      payload.P = selectedBasePoint
    }
    setLoading(true)
    await axios
      .post(`${API_URL}/generate-key?${query}`, payload)
      .then((res) => {
        setLoading(false);
        setSuccessMessage('Generate key success!')
        setKey(res.data)
      })
      .catch((err) => {
        setLoading(false);
        setErrorMessage(
          err.response?.data?.error
            ? err.response?.data?.error.split('"')[1] || err.response?.data?.error
            : "Unknown error has occured!"
        );
      });
  }

  const downloadTxtFile = (content = result) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    const fileName = prompt('Give filename to downloaded file: ')
    element.download = `${fileName}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 5000);
    }
  }, [successMessage, errorMessage]);

  const generateErrorKey = useCallback(async () => {
    if (cipher === 0) {
      const { e, p, q } = cipherKey;
      const psi = (p - 1) * (q - 1);
      if (!isLongInteger(p) || p === 0) return setErrorKey('P should be non zero long integer!');
      if (!isLongInteger(q) || q === 0) return setErrorKey('Q should be non zero long integer!');
      if (!isPrime(p)) return setErrorKey('P should be prime number!')
      if (!isPrime(q)) return setErrorKey('Q should be prime number!')
      const isCoprimePQ = await isCoprime(p, q);
      if (!isCoprimePQ) return setErrorKey('P & Q should be coprime!');
      if (e < 1 || e > psi) return setErrorKey(`E should be between 1 and Psi = ${psi}`)
      const isCoprimePPsi = await isCoprime(e, psi);
      if (!isCoprimePPsi) return setErrorKey(`E should be coprime with Psi = ${psi}`);
      const isCoprimeEPQ = await isCoprime(e, p * q)
      if (!isCoprimeEPQ) return setErrorKey(`E should be coprime with P*Q = ${p*q}`);
    }
    else if (cipher === 2) {

    }
    else if (cipher === 3) {
      if (!isPrime(cipherKey.p)) return setErrorKey(`P should be prime!`);
      if (cipherKey.m < 2) return setErrorKey(`M should be greater than 1!`);
    }

    return setErrorKey('');
  }, [cipherKey, cipher]);

  const generateECCEq = useMemo(() => {
    const { a, b, p } = cipherKey;
    const firstEl = <span>x<sup>3</sup></span>
    const secondEl = a
      ? <span>{a > 0 ? ` + ${a > 1 ? a : ''}x` : ` ${a > 1 ? a : ''}x`}<sup>2</sup></span>
      : ''
    const thirdEl = b ? <span>{b > 0 ? ` + ${b}` : ` ${b}`}</span> : ''

    return <span>{firstEl}{secondEl}{thirdEl} mod {p}</span>
  }, [cipherKey])

  useEffect(() => {
    const interval = setTimeout(() => {
      generateErrorKey()
    }, 500)
    return () => clearTimeout(interval)
  }, [generateErrorKey])

  useEffect(() => {
    const interval = setTimeout(() => {
      getAvailableECCPoints()
    }, 1000)
    return () => clearTimeout(interval)
  }, [getAvailableECCPoints])

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
            value={eccPoints[0]}
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
          {(typeof cipher === 'number' && cipher <= 3 && cipher >= 0) && (
            <h2 style={{ color: '#265158' }}>Key</h2>
          )}
          <Grid container spacing={2} style={{ width: '60%', margin: '10px auto' }} justifyContent="center">
            {(typeof cipher === 'number' && cipher <= 3 && cipher >= 0) && Object.keys(cipherKey).map((val) => {
              if (val === 'P') {
                return <></>
              }
              
              return (
                <Grid item md={3} key={val}>
                  <FormControl className="dropdown unset-width">
                    <TextField
                      variant="filled"
                      value={cipherKey[val]}
                      type="number"
                      name={val}
                      label={val.toUpperCase()}
                      placeholder={`Type value for ${val.toUpperCase()}`}
                      onFocus={(e) => e.target.select()}
                      onChange={handleChangeKey}
                    />
                  </FormControl>
                </Grid>
              )
            })}
          </Grid>
          {(cipher === 3 && cipherKey.p > 1021) && (
            <div className="warning-key" style={{ marginBottom: 5 }}>
              Warning: it will be lag or error if you choose too large value for P!
            </div>
          )}
          <div className="error-key" style={{ marginBottom: 25 }}>{errorKey}</div>
        </Grid>
        {cipher === 3 && isPrime(cipherKey.p) && (
          <Grid container direction="column" alignItems="center">
            <div>Elliptic Curve: {generateECCEq}</div>
            <FormControl variant="filled" className="dropdown center">
              <InputLabel id="demo-simple-select-filled-label">
                Available Points
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                className="points-dropdown"
                value={selectedBasePoint}
                onChange={handlePointChange}
                IconComponent={loadingDropdown ? CircularProgress : ArrowDropDown}
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
                {loadingDropdown && <CircularProgress />}
                {(!loadingDropdown && !eccPoints.points?.length) && (
                  <MenuItem value={null}>
                    No points found!
                  </MenuItem>
                )}
                {(!loadingDropdown && eccPoints.points?.length) && eccPoints.points.map((label, index) => (
                  <MenuItem key={index} value={label}>
                    {`(${label.join(',')})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}      
        <Grid container direction="column" alignItems="center">
          {(typeof cipher === 'number' && cipher <= 3 && cipher >= 0) && (
            <Button
              variant="contained"
              color="primary"
              disabled={Boolean(
                !Object.keys(cipherKey).length 
                || errorKey
                || (cipher === 3 && !selectedBasePoint)
              )}
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
          )}
          <br />
          {key.public && (
            <div className="download" onClick={() => downloadTxtFile(key.public)}>
              {`Download ${cipher === 3 ? 'Sender' : ''} public key in .txt`}
            </div>
          )}
          {key.private && (
            <div className="download" onClick={() => downloadTxtFile(key.private)}>
              Download private key in .txt
            </div>
          )}
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
                : swap 
                  ? <Lock />
                  : <LockOpen />
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
