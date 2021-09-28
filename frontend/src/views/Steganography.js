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

import { API_URL } from "constant";

export default function Steganography() {
  const [swap, setSwap] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSwap = useCallback(() => setSwap(!swap), [swap]);
  const onChangeFile = useCallback((e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files);
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
    axios
      .post(`${API_URL}/steganography`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        /*
        setResult(
          new File(
            res.data.result,
            `${swap ? "Stego Media" : "Media"}.${fileExtension}`
          )
        );
        */
      })
      .finally(() => setLoading(false));
  }, [file, fileExtension, swap, message]);

  const download = useCallback(() => {
    const element = document.createElement("a");
    element.href = URL.createObjectURL(result);
    element.download = result.name;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }, [result]);

  return (
    <Grid item container className="steganography">
      <Grid item container className="box">
        <Grid item container className="container">
          <Grid item container lg={5} className="left">
            <Grid item container wrap="nowrap" className="title-input mb">
              <h3>{swap ? "Stego Media" : "Media"}</h3>
              <input
                accept=".bmp,.wav,.avi,.png"
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
            {result && (
              <div className="download" onClick={download}>
                Download result in .{fileExtension}
              </div>
            )}
          </Grid>
        </Grid>
        <Grid item container direction="column" className="submit-section">
          <TextField
            variant="filled"
            className="input num mb"
            value={message}
            label="Message"
            placeholder="Message"
            required
            onChange={(e) => setMessage(e.target.value)}
          />
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
