import React, { useCallback, useMemo, useState } from "react";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
} from "@material-ui/core";
import { InsertDriveFile, Lock, LockOpen, SwapHoriz } from "@material-ui/icons";
import axios from "axios";

import { Alert } from "components";
import { API_URL } from "constant";

export default function Steganography() {
  const [swap, setSwap] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageLength, setMessageLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [value, setValue] = useState(null);

  const handleSwap = useCallback(() => setSwap(!swap), [swap]);

  const onChangeLength = useCallback(
    (e) => setMessageLength(e.target.value),
    []
  );

  const onChangeFile = useCallback((e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setValue(null);
  }, []);

  const fileExtension = useMemo(
    () => "" || file?.name.split(".").pop(),
    [file]
  );

  const onSubmit = useCallback(() => {
    setLoading(true);

    const formData = new FormData();
    formData.append("media", file);
    formData.append("hide", !swap);
    formData.append("message", message);
    formData.append("extension", fileExtension);
    formData.append("length", swap ? messageLength : message.length);
    axios
      .post(`${API_URL}/steganography`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setResult(res.data.result);
        setValue(res.data.value);
      })
      .finally(() => setLoading(false));
  }, [file, fileExtension, swap, message, messageLength]);

  return (
    <Grid item container className="steganography">
      {swap && result && value && (
        <Alert type="info" message={result} setMessage={() => null} />
      )}
      <Grid item container className="box">
        <Grid item container className="container">
          <Grid item container lg={5} className="left">
            <Grid item container wrap="nowrap" className="title-input mb">
              <h3>{swap ? "Stego Media" : "Media"}</h3>
              <input
                accept=".bmp,.avi,.png,.wav"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={onChangeFile}
              />
              <label htmlFor="raised-button-file">
                <IconButton variant="raised" component="span">
                  <InsertDriveFile />
                </IconButton>
              </label>
            </Grid>
            {file?.name && (
              <div className="error mb">{`You uploaded ${file.name}!`}</div>
            )}
          </Grid>
          <Grid item container lg={2} className="swap-btn">
            <IconButton onClick={handleSwap}>
              <SwapHoriz fontSize="large" />
            </IconButton>
          </Grid>
          <Grid item container lg={5} className="right">
            <h3>{swap ? "Media" : "Stego Media"}</h3>
            {result && value && (
              <>
                <a
                  rel="noreferrer"
                  target="_blank"
                  href={result}
                  download={file.name}
                >
                  Download result in .{fileExtension}
                </a>
                <p>PSNR: {value}</p>
              </>
            )}
          </Grid>
        </Grid>
        <Grid item container direction="column" className="submit-section">
          {swap ? (
            <input
              type="number"
              value={messageLength}
              onChange={onChangeLength}
              placeholder="Message length"
            />
          ) : (
            <TextField
              variant="filled"
              className="input num mb"
              value={message}
              label="Message"
              placeholder="Message"
              required
              onChange={(e) => setMessage(e.target.value)}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            size="large"
            className="submit-btn"
            onClick={onSubmit}
            startIcon={
              loading ? (
                <CircularProgress size={15} />
              ) : swap ? (
                <LockOpen />
              ) : (
                <Lock />
              )
            }
          >
            {loading ? "LOADING" : swap ? "EXTRACT" : "HIDE"}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
