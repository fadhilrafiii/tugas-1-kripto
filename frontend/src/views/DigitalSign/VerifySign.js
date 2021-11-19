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

const GenerateSign = ({ setSuccess, setError }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [file, setFile] = useState(null);
  const [sign, setSign] = useState("");
  const [publicKey, setPublicKey] = useState("");
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

  const onSign = () => {
    setLoading(false);
    console.log("SIGNING...");
    setLoading(true);
  };

  const onChangeKey = (e) => {
    setPublicKey(e.target.value);
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
    if (data || publicKey || sign) {
      setDisabled(!(data && publicKey && sign && validateKeyFormat()));
    } else setDisabled(true);
  }, [sign, data, publicKey, setDisabled, validateKeyFormat]);

  const generateErrorKey = useCallback(() => {
    if (!publicKey) return setErrorKey("Public key is still empty!");
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
      <Grid container  spacing={4} alignItems="flex-start">
        <Grid container item md={8} direction="column">
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
        <Grid container item md={4} direction="column">
          <h3 className="subtitle">Sign</h3>
          <Grid container spacing={2} justifyContent="center">
            <Grid item md={12}>
              <FormControl className="dropdown fullwidth">
                <TextField
                  style={{ background: "white", borderRadius: "6px 6px 0 0" }}
                  variant="filled"
                  value={sign}
                  label="Sign"
                  fullWidth
                  placeholder="Input sign to verify"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setSign(e.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>
          <div className="error-key">
            {errorOccurance && !sign ? "Sign is still empty!" : <br />}
          </div>
          <h3 className="subtitle">Input Key</h3>
          <Grid container spacing={2} justifyContent="center">
            <Grid item md={12}>
              <FormControl className="dropdown fullwidth">
                <TextField
                  style={{ background: "white", borderRadius: "6px 6px 0 0" }}
                  variant="filled"
                  value={publicKey}
                  label="Public Key"
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
        VERIFY SIGN
      </Button>
    </Grid>
  );
};

export default GenerateSign;
