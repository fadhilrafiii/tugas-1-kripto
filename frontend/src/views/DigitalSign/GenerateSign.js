import React, { useState, useCallback, useEffect } from "react";
import {
  Grid,
  TextField,
  IconButton,
  FormControl,
  CircularProgress,
  Button,
} from "@material-ui/core";
import { InsertDriveFile, Close, Create } from "@material-ui/icons";

import axios from 'axios';
import { API_URL } from 'constant';

const GenerateSign = ({ setSuccess, setError }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [file, setFile] = useState(null);
  const [publicKey, setPrivateKey] = useState("");
  const [errorOccurance, setErrorOccurance] = useState(0);
  const [isDisabled, setDisabled] = useState(true);
  const [errorKey, setErrorKey] = useState("");

  const onInputFile = (e) => {
    if (e.target.files.length) {
      setFile(e.target.files[0]);

      const reader = new FileReader();

      reader.onloadend = (e) => {
        let text = e.target.result;
        setData(text);
      };
      reader.readAsBinaryString(e.target.files[0]);
    }
  };

  const onDeleteFile = () => {
    setFile(null);
  };

  const onSign = async () => {
    await axios
      .post(`${API_URL}/digital-sign`, {'message': data, 'prikey': publicKey})
      .then((res) => {
        setLoading(false);
        setData(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const onChangeKey = (e) => {
    setPrivateKey(e.target.value);
  };

  const validateKeyFormat = useCallback(() => {
    try {
      const splittedKey = publicKey.split(",");
      splittedKey.forEach((k) => {
        if (!parseInt(k.trim()))
          throw new Error("There is invalid key components!");
      });
      setErrorOccurance(0);
      return true;
    } catch (err) {
      setErrorOccurance((prev) => prev++);
      setError(err?.message || "Wrong key format!");
      return false;
    }
  }, [publicKey, setError]);

  const setButtonDisabled = useCallback(() => {
    if (data || publicKey) {
      setDisabled(!(data && publicKey && validateKeyFormat()));
    } else setDisabled(true);
  }, [data, publicKey, setDisabled, validateKeyFormat]);

  const generateErrorKey = useCallback(() => {
    if (!publicKey) return setErrorKey("Private key is still empty!");
    if (!validateKeyFormat(publicKey))
      return setErrorKey("Invalid public key format!");

    return setErrorKey("");
  }, [publicKey, validateKeyFormat]);

  useEffect(() => {
    const checkButtonDisabled = setTimeout(() => setButtonDisabled(), 1500);
    return () => clearTimeout(checkButtonDisabled);
  }, [setButtonDisabled]);

  useEffect(() => {
    const errorKeyTimeout = setTimeout(() => generateErrorKey(), 1500);
    return () => clearTimeout(errorKeyTimeout);
  }, [generateErrorKey]);

  return (
    <Grid container direction="column" alignItems="center">
      <Grid container spacing={4} alignItems="flex-start">
        <Grid item container md={8}>
          <h3 className="subtitle">Input Message</h3>
          <TextField
            value={data}
            onChange={(e) => setData(e.target.value)}
            fullWidth
            style={{ background: "white", borderRadius: 4 }}
            variant="outlined"
            multiline
            minRows={12}
            maxRows={12}
            autoFocus
            placeholder="Type your text"
          />
          <Grid container justifyContent="center">
            <Grid item>
              <input
                accept="text/plain"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={onInputFile}
              />
              <label htmlFor="raised-button-file">
                {file ? (
                  <Grid container spacing={1}>
                    <Grid item className="file-name">
                      {file?.name}
                    </Grid>
                    <Grid item>
                      <Close onClick={onDeleteFile} />
                    </Grid>
                  </Grid>
                ) : (
                  <>
                    <IconButton variant="raised" component="span">
                      <InsertDriveFile className="icon" />
                    </IconButton>
                    <div className="input-file-label">Input text file</div>
                  </>
                )}
              </label>
            </Grid>
          </Grid>
          <div className="error-key">
            {errorOccurance && !data ? "Your message is still empty!" : ""}
          </div>
        </Grid>
        <Grid item container md={4} direction="column" justifyContent="center">
          <h3 className="subtitle">Input Key</h3>
          <Grid container spacing={2} justifyContent="center">
            <Grid item md={12}>
              <FormControl className="dropdown fullwidth">
                <TextField
                  style={{ background: "white", borderRadius: "6px 6px 0 0" }}
                  variant="filled"
                  value={publicKey}
                  label="Private Key"
                  name="public"
                  placeholder="Separate with comma"
                  onFocus={(e) => e.target.select()}
                  onChange={onChangeKey}
                />
              </FormControl>
            </Grid>
          </Grid>
          <div className="error-key">
            {errorOccurance && errorKey ? errorKey : <br />}
          </div>
        </Grid>
      </Grid>

      <br />
      <Button
        variant="contained"
        color="primary"
        disabled={isDisabled}
        onClick={onSign}
        size="large"
        className="submit-btn"
        startIcon={
          loading ? (
            <CircularProgress size={15} />
          ) : (
            <Create fontSize="medium" />
          )
        }
      >
        ADD SIGN
      </Button>
    </Grid>
  );
};

export default GenerateSign;
