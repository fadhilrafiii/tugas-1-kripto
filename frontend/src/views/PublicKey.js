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
  const [myKey, setMyKey] = useState({
    public: null,
    private: null,
  });
  const [elGamalK, setElGamalK] = useState(1)
  const [ECCkey, setECCkey] = useState({
    a: '',
    b: '',
    p: '',
    k: '',
    basePoint: ''
  })

  const [eccPoints, setEccPoints] = useState({});
  const [selectedBasePoint, setSelectedBasePoints] = useState('');
  const [displayEccEnc, setDisplayEccEnc] = useState(false);
  const [eccEncoding, setEccEncoding] = useState('');

  const [data, setData] = useState("");
  const [result, setResult] = useState("");

  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorKey, setErrorKey] = useState('');
  const [errorK, setErrorK] = useState('');

  const handleSwap = () => {
    
    if (result) setData(result);
    if (cipher === 3 && swap && result) {
      setData(eccEncoding);
      setEccEncoding('')
    }

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

  const resetKey = () => {
    setKey({
      public: '',
      private: '',
    })
    setMyKey({
      public: '',
      private: '',
    })
    setElGamalK('')
    setEccPoints({})
    setECCkey({
      a: '',
      b: '',
      p: '',
      k: '',
      basePoint: ''
    })
  }

  const handleCipherChange = (e) => {
    setData('');
    setResult('');
    resetKey();
    setCipher(e.target.value);
    if (e.target.value === 0) {
      setCipherKey({
        e: 7,
        p: 11,
        q: 13,
      });
    }
    else if (e.target.value === 1) {
      setCipherKey({
        p: 7,
        q: 11,
        g: 5652,
      })
    }
    else if (e.target.value === 2) {
      setCipherKey({
        p: 7,
        g: 3,
        x: 5,
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
          setSuccessMessage('Success generate points on the curve!')
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
        setSuccessMessage('Generate key success!');
        const data = res.data;
        Object.keys(data).forEach((key) => {
          if (key !== 'string') {
            data[key] = data[key].join(', ')
          }
        })
        setKey(data)
        setMyKey(data)
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
    else if (cipher === 1){
      const{ p, q, g } = cipherKey;
      const n = p * q;
      if (g > n*n) return setErrorKey('g should be lower than n^2!')
    }
    else if (cipher === 2) {
      const { p, g, x} = cipherKey;
      if (!isPrime(p) || p < 127) return setErrorKey('P should be prime number more than 127, so text can be convert to ASCII!');
      if (g >= p) return setErrorKey('G should be less than P!');
      if (x > p - 2 || x < 1) return setErrorKey('X should be natural number less than P - 1!');
    }
    else if (cipher === 3) {
      if (!isPrime(cipherKey.p)) return setErrorKey(`P should be prime!`);
      if (cipherKey.m < 2) return setErrorKey(`M should be greater than 1!`);
      if (cipherKey.m > eccPoints.count) {
        return setErrorKey(`Max value for M is ${eccPoints.count} because there's only ${eccPoints.count} points`);
      }
    }

    return setErrorKey('');
  }, [cipherKey, cipher, eccPoints.count]);

  const generateErrorK = useCallback(() => {
    if (cipher === 2) {
      if (elGamalK < 1 || elGamalK > cipherKey.p - 2) {
        return setErrorK('K should be natural number less than P - 1!')
      }
    }

    return setErrorK('')
  }, [elGamalK, cipherKey.p, cipher]);

  const generateECCEq = useCallback((key) => {
    const { a, b, p } = key;
    const firstEl = <span>x<sup>3</sup></span>
    const secondEl = a
      ? <span>{a > 0 ? ` + ${a > 1 ? a : ''}x` : ` ${a > 1 ? a : ''}x`}<sup>2</sup></span>
      : ''
    const thirdEl = b ? <span>{b > 0 ? ` + ${b}` : ` ${b}`}</span> : ''

    return <span>{firstEl}{secondEl}{thirdEl} mod {p}</span>
  }, []);

  const encrypt = async () => {
    if (!data) return setErrorMessage('Plaintext is still empty!'); 
    const query = querystring.stringify({
      type: cipherOpt[cipher],
      method: 'encrypt'
    });
    let payload = {
      pubkey: key.public.toString().split(',').map((val) => parseInt(val.trim())),
      plaintext: data,
    };
    if (cipher === 2) {
      payload.k = parseInt(elGamalK);
    }
    if (cipher === 3) {
      payload.a = parseInt(ECCkey.a);
      payload.b = parseInt(ECCkey.b);
      payload.p = parseInt(ECCkey.p);
      payload.k = parseInt(ECCkey.k);
      payload.base_point = ECCkey.basePoint.split(',').map((val) => parseInt(val.trim()));
    }

    setLoading(true)
    await axios
      .post(`${API_URL}/public-key?${query}`, payload)
      .then((res) => {
        setLoading(false);
        setSuccessMessage('Encryption success!');
        if (cipher === 3)
          setEccEncoding(res.data.data.encoding);
        setResult(cipher === 3 ? res.data.data.text : res.data.data)
      })
      .catch((err) => {
        setLoading(false);
        setErrorMessage(
          err.response?.data?.error
            ? err.response?.data?.error.split('"')[1] || err.response?.data?.error
            : "Encryption failed!"
        );
      });
  }

  const parseEccText = (arr) => {
    return arr.map(val => {
      switch(val) {
        case 0:
          return 'x00';
        case 1:
          return 'x01';
        case 2:
          return 'x02';
        case 3:
          return 'x03';
        case 4:
          return 'x04';
        case 5:
          return 'x05';
        case 6:
          return 'x06';
        case 7:
          return 'x07';
        case 8:
          return 'x08';
        case 9:
          return 'x09';
        case 10:
          return 'x0a';
        case 11:
          return 'x0b';
        case 12:
          return 'x0c';
        case 13:
          return 'x0d';
        case 14:
          return 'x0e';
        case 15:
          return 'x0f';
        case 16:
          return 'x00';
        case 17:
          return 'x01';
        case 18:
          return 'x02';
        case 19:
          return 'x13';
        case 20:
          return 'x14';
        case 21:
          return 'x15';
        case 22:
          return 'x16';
        case 23:
          return 'x17';
        case 24:
          return 'x18';
        case 25:
          return 'x19';
        case 26:
          return 'x1a';
        case 27:
          return 'x1b';
        case 28:
          return 'x1c';
        case 29:
          return 'x1d';
        case 30:
          return 'x1e';
        case 31:
          return 'x1f';
        default:
          return String.fromCharCode(val);
      }
    }).join('')
  };

  const decrypt = async () => {
    if (!data) return setErrorMessage('Ciphertext is still empty!'); 
    const query = querystring.stringify({
      type: cipherOpt[cipher],
      method: 'decrypt'
    });
    let priv = myKey.private;
    let pub = myKey.public;
    if (cipher === 0 || cipher === 2) {
      priv = priv.split(',').map((val) => parseInt(val.trim()))
    }
    if (cipher === 1) {
      priv = priv.split(',').map((val) => parseInt(val.trim()))
      pub = pub.toString().split(',').map((val) => parseInt(val.trim()))
    }
    else if (cipher === 3) {
      priv = parseInt(priv)
    }
    const payload = {
      prikey: priv,
      pubkey: pub,
      ciphertext: data
    };

    if (cipher === 3) {
      payload.a = parseInt(ECCkey.a);
      payload.b = parseInt(ECCkey.b);
      payload.p = parseInt(ECCkey.p);
      payload.base_point = ECCkey.basePoint.split(',').map((val) => parseInt(val.trim()));
    }

    setLoading(true)
    await axios
      .post(`${API_URL}/public-key?${query}`, payload)
      .then((res) => {
        setLoading(false);
        setSuccessMessage('Decryption success!');
        setResult(res.data.data)
      })
      .catch((err) => {
        setLoading(false);
        setErrorMessage(
          err.response?.data?.error
            ? err.response?.data?.error.split('"')[1] || err.response?.data?.error
            : "Decryption failed!"
        );
      });
  }

  const handleChangeMyKey = (e) => {
    let { name, value } = e.target;

    setMyKey((prev) => ({
      ...prev,
      [name]: value
    }))
  };

  const handleChangeECCkey = (e) => {
    let { name, value } = e.target;

    setECCkey((prev) => ({
      ...prev,
      [name]: value
    }));

    if ((name === 'a' || name === 'b' || name === 'p') && cipher === 3) {
      setCipherKey((prev) => ({ ...prev, [name]: parseInt(value) }));
    }
  }

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

  useEffect(() => {
    const interval = setTimeout(() => {
      generateErrorK()
    }, 1000)
    return () => clearTimeout(interval)
  }, [generateErrorK]);

  const generateCustomPlaceholder = useMemo(() => {
    if (!swap) {
      if (cipher === 0) {
        return 'You should input the encoding of the ciphertext, example: 123456 789123 xxxxxx'
      } else if (cipher === 2) {
        return 'You should input the encoding of the ciphertext in the form of "27,124 27,2050 27,124 ..." for (27,124), (27,2050), (27,124), ...'
      } else if (cipher === 3) {
        return 'You should input the encoding of the ciphertext in the form of "74,11,126,20 74,11,14,12 ..." for ((74,11),(126,20), ((74,11),(14,12)), ...'
      }
    } else {
      return 'Type your plaintext here';
    }

    return ''
  }, [swap, cipher])

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
            Choose Algorithm
          </InputLabel>
          <Select
            defaultValue=''
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
            <MenuItem value='' disabled>
              Choose Algorithm
            </MenuItem>
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
                return <React.Fragment key={val}></React.Fragment>
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
          {(cipher === 3 && eccPoints.count && eccPoints.count < 128) && (
            <div className="warning-key" style={{ marginBottom: 5 }}>
             Warning: Curve only has less than 128 points! It can't be use to encrypt/decrypt below
            </div>
          )}
          <div className="error-key" style={{ marginBottom: 25 }}>{errorKey}</div>
        </Grid>
        {cipher === 3 && isPrime(cipherKey.p) && (
          <Grid container direction="column" alignItems="center">
            <div>Elliptic Curve: {generateECCEq(cipherKey)}</div>
            <FormControl variant="filled" className="dropdown center">
              <InputLabel id="demo-simple-select-filled-label">
                Available Points
              </InputLabel>
              <Select
                defaultValue=''
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                className="points-dropdown"
                value={selectedBasePoint}
                disabled={loadingDropdown}
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
                {(!loadingDropdown && eccPoints.points?.length) && (
                  <MenuItem value='' disabled>
                    Available Points
                  </MenuItem>
                )}
                {(!loadingDropdown && eccPoints.points?.length) &&
                  eccPoints.points.map((label, index) => (
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
              {`Download ${cipher === 3 ? 'sender' : ''} public key in .txt`}
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
          data={Array.isArray(data) ? data.join(' ') : data}
          setData={setData}
          result={(cipher === 3 && displayEccEnc && eccEncoding) 
            ? eccEncoding.join(' ')
            : Array.isArray(result) 
              ? (cipher === 3 ? parseEccText(result) : result.join(' '))
              : result
          }
          customPlaceholder={generateCustomPlaceholder}
          onSwap={handleSwap}
          onDownload={downloadTxtFile}
        />
        <Grid container justifyContent="flex-end">
          {(eccEncoding && cipher === 3) && (
            <div className="show-encoding" onClick={() => setDisplayEccEnc((prev) => !prev)}>
              Show ciphertext in {displayEccEnc ? 'ASCII' : 'Encoding'} mode
            </div>
          )}
        </Grid>
        <Grid item container direction="column" className="submit-section">
          {cipher === 2 && (
            <>
              <FormControl className="dropdown" style={{ marginBottom: 0 }}>
                <TextField
                  variant="filled"
                  value={elGamalK}
                  type="number"
                  name='k'
                  label= 'K'
                  placeholder={`Choose K (1 <= k <= P - 2)`}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setElGamalK(e.target.value)}
                  InputLabelProps={{ shrink: elGamalK ? true : false }}
                />
              </FormControl>
              <div className="error-key" style={{ marginBottom: 15 }}>{errorK}</div>
            </>
          )}
          {cipher === 3 && (
            <>
              <h3 className="title-page" style={{ width: 'unset' }}>Curve Equation</h3>
              <Grid container spacing={2} justifyContent="center">
                {Object.keys(ECCkey).map((key) => {
                  if (key === 'a' || key === 'b' || key === 'p') {
                    return (
                      <Grid item md={3} key={key}>
                        <FormControl className="dropdown" style={{ width: 'unset' }}>
                          <TextField
                            variant="filled"
                            value={ECCkey[key] || ''}
                            type="string"
                            name={key}
                            label={key.toUpperCase()}
                            placeholder={`Choose ${key.toUpperCase()}`}
                            onFocus={(e) => e.target.select()}
                            onChange={handleChangeECCkey}
                          />
                        </FormControl>
                      </Grid>
                    );
                  }

                  return <React.Fragment key={key}></React.Fragment>
                })}
              </Grid>
              <div className="error-key" style={{ fontSize: 12, margin: '-15px auto 25px', textAlign: 'center'}}>
                {(eccPoints.count < 128) || !isPrime(parseInt(ECCkey.p))
                  ? 'P should be prime number and produce > 128 points on curve so ciphertext can be encoded to ASCII'
                  : null}
              </div>
              {(ECCkey.a && ECCkey.b && ECCkey.p) && (
                <h3 className="title-page" style={{ width: 'unset', margin: '0 auto', borderBottom: '1px solid black' }}>
                  {generateECCEq(ECCkey)}
                </h3>
              )}
              <h3 className="title-page" style={{ width: 'unset', marginBottom: 5 }}>Key</h3>
              {Object.keys(ECCkey).map((key) => {
                if ((key === 'basePoint' && !swap) || key === 'a' || key === 'b' || key === 'p') {
                  return <React.Fragment key={key}></React.Fragment>
                }

                return (
                  <FormControl className="dropdown" key={key}>
                    <TextField
                      variant="filled"
                      value={ECCkey[key] || ''}
                      type="string"
                      name={key}
                      label={key.slice(0,1).toUpperCase() + key.slice(1)}
                      placeholder={key === 'k' ? 'Make sure this is a valid K' : 'abs, ord (Point must be on curve)'}
                      onFocus={(e) => e.target.select()}
                      onChange={handleChangeECCkey}
                    />
                  </FormControl>
                );
              })}
            </>
          )}
          {cipher === 3 && (
            <div style={{ textAlign: 'center', fontSize: 12, margin: '-10px auto 20px' }}>
              To make sure K, Base Point and Curve Equation has more than 127 points, Please check on the Generate Key section
            </div>
          )}
          <FormControl className="dropdown">
            {!swap ? (
              <TextField
                variant="filled"
                value={myKey?.private || ''}
                type="string"
                name='private'
                label= 'Private Key'
                placeholder={`separate with comma if multivalue`}
                onFocus={(e) => e.target.select()}
                onChange={handleChangeMyKey}
              />
            ) : (
              <TextField
                variant="filled"
                value={myKey?.public}
                type="string"
                name='public'
                label= 'Public Key'
                placeholder={`separate with comma if multivalue`}
                onFocus={(e) => e.target.select()}
                onChange={handleChangeMyKey}
                InputLabelProps={{ shrink: myKey?.public ? true : false }}
              />
            )}
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={swap ? () => encrypt() : () => decrypt()}
            size="large"
            disabled={Boolean((cipher === 2 && !elGamalK) 
              || (swap ? !myKey.public : !myKey.private)
              || (cipher === 3 && (Object.keys(ECCkey).find(key => !ECCkey[key]) || eccPoints.count < 128))
              || !(cipher || cipher === 0)
            )}
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
