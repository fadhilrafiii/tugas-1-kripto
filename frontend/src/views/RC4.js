// IMPORT MODULES
import React, { useState } from "react";
import { Grid, TextField, CircularProgress, Button } from "@material-ui/core";
import { Lock, LockOpen } from "@material-ui/icons";
import querystring from "querystring";
import axios from "axios";

// IMPORT COMPONENTS
import { PairTextArea, Alert } from "components";

// BACKEND BASE URL
import { API_URL } from "constant";

const RC4 = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [swap, setSwap] = useState(true);

  const [data, setData] = useState("");
  const [result, setResult] = useState("");
  const [key, setKey] = useState("");

  const handleSwap = () => {
    if (result) setData(result);
    setResult("");

    setSwap((prev) => !prev);
  };

  const submitData = async () => {
    const query = querystring.stringify({
      method: swap ? "encrypt" : "decrypt",
      cipher: 7,
    });

    if (!key) {
      setErrorMessage("Set key first!");
      return;
    }

    const payload = {
      data,
      key,
    };

    setLoading(true);
    await axios
      .post(`${API_URL}?${query}`, payload)
      .then((res) => {
        setLoading(false);
        setSuccessMessage(`${swap ? "Encrypt" : "Decrypt"} success!`);
        setResult(res.data.result);
        setErrorMessage(res.data?.message ? res.data?.message : "");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setErrorMessage(
          err.response?.data?.message
            ? err.response?.data?.message
            : "Unknown error has occured!"
        );
      });
  };

  return (
    <div className="rc4">
      <Alert
        type={successMessage ? "success" : "error"}
        message={successMessage || errorMessage}
        setMessage={() => {
          setErrorMessage("");
          setSuccessMessage("");
        }}
      />
      <Grid item container className="box">
        <h1 className="title-page">RC4 Algorithm</h1> 
        <PairTextArea
          type="rc4"
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
            onClick={submitData}
            size="large"
            className="submit-btn"
            startIcon={
              loading ? (
                <CircularProgress size={25} color="inherit" thickness={6} />
              ) : swap ? (
                <Lock />
              ) : (
                <LockOpen />
              )
            }
          >
            {swap ? "ENCRYPT" : "DECRYPT"}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default RC4;
