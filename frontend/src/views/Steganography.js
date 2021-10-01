import React, { useCallback, useMemo, useState } from "react";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { InsertDriveFile, Lock, LockOpen, SwapHoriz } from "@material-ui/icons";
import axios from "axios";

import { Alert } from "components";
import { API_URL } from "constant";



export default function Steganography() {
  const typeOpt = [
    "Image",
    "Audio",
    "Video",
  ];

  const [swap, setSwap] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageLength, setMessageLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [value, setValue] = useState(null);
  const [type, setType] = useState(0);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const formatType = () => {
    if (type === 0) return "image/png";
    if (type === 1) return "audio/wav";
    if (type === 2) return ".avi,.bmp";

    return "image/*";
  }

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
        setSuccessMessage('Success hiding message in image!')
      })
      .catch((err) => {
        setErrorMessage(err.error || 'Invalid file format!');
      })
      .finally(() => setLoading(false));
  }, [file, fileExtension, swap, message, messageLength]);

  return (
    <Grid item container className="steganography">
      <Alert
        type={successMessage ? "success" : "error"}
        message={successMessage || errorMessage}
        setMessage={() => {
          setErrorMessage("");
          setSuccessMessage("");
        }}
      />
      <Grid item container className="box">
        <Grid item container className="container">
        <FormControl variant="filled" className="dropdown-type">
            <InputLabel id="demo-simple-select-filled-label">
              File type
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={type}
              onChange={(e) => {
                setResult(null);
                setType(e.target.value)
              }}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left"
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left"
                },
                getContentAnchorEl: null
              }}
            >
              {typeOpt.map((label, index) => (
                <MenuItem key={index} value={index}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid item container lg={5} className="left">
            <Grid item container wrap="nowrap" className="title-input mb">
              <h3>{swap ? "Stego Media" : "Media"}</h3>
              <input
                accept={formatType()}
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
            {file && <div className="preview-media">
              {type === 0 && (
                <img src={URL.createObjectURL(file) } alt="Uploaded Media" />
              )}
              {type === 1 && (
                <audio src={URL.createObjectURL(file) } type="audio/*" controls>
                  Your browser does not support the audio element.
                </audio>
              )}
              {type === 2 && (
                <video src={URL.createObjectURL(file) } type="video/*" controls>
                  Your browser does not support the video element.
                </video>
              )}
            </div>}
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
                {result && <div className="preview-media">
                  {type === 0 && (
                    <img src={result} alt="Uploaded Media" />
                  )}
                  {type === 1 && (
                    <audio src={result} type="audio/*" controls>
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  {type === 2 && (
                    <video src={result} type="video/*" controls>
                      Your browser does not support the video element.
                    </video>
                  )}
                </div>}
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
