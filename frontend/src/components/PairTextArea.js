import React, { useState } from "react";
import { Grid, IconButton, TextField } from "@material-ui/core";
import { SwapHoriz, InsertDriveFile } from "@material-ui/icons";

export const PairTextArea = ({
  type,
  swap,
  cipher,
  data,
  setData,
  result,
  onSwap,
  onDownload,
}) => {
  const [file, setFile] = useState(null);

  const onInput = (e) => {
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

  return (
    <Grid item container className="container">
      <Grid item container lg={5} className="left">
        <Grid item container wrap="nowrap" className="title-input mb">
          <h3>{swap ? "Plain Text" : "Cipher Text"}</h3>
          <input
            accept={
              (type === "crypto" && cipher === 3) || type !== "crypto"
                ? ""
                : "text/plain"
            }
            style={{ display: "none" }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={onInput}
          />
          <label htmlFor="raised-button-file">
            <IconButton variant="raised" component="span">
              <InsertDriveFile />
            </IconButton>
          </label>
        </Grid>
        <TextField
          value={data}
          onChange={(e) => setData(e.target.value)}
          fullWidth
          className="input mb"
          variant="outlined"
          multiline
          minRows={12}
          maxRows={12}
          autoFocus
        />
        {file?.name && (
          <div className="error mb">{`You uploaded ${file.name}!`}</div>
        )}
      </Grid>
      <Grid item container lg={2} className="swap-btn">
        <IconButton onClick={onSwap}>
          <SwapHoriz fontSize="large" />
        </IconButton>
      </Grid>
      <Grid item container lg={5} className="right">
        <h3>{swap ? "Cipher Text" : "Plain Text"}</h3>
        <TextField
          value={result}
          className="input mb"
          variant="outlined"
          multiline
          minRows={12}
          maxRows={12}
          InputProps={{
            readOnly: true,
          }}
        />
        {result && onDownload && (
          <div className="download" onClick={onDownload}>
            Download result in .txt
          </div>
        )}
      </Grid>
    </Grid>
  );
};
