// IMPORT MODULES
import React from "react";
import MaterialAlert from "@material-ui/lab/Alert";

export const Alert = ({ type, message, setMessage }) => {
  return (
    message && (
      <MaterialAlert
        className="alert"
        variant="filled"
        severity={type}
        onClose={() => setMessage("")}
      >
        {message}
      </MaterialAlert>
    )
  );
};
