// IMPORT MODULES
import React, { useEffect } from "react";
import MaterialAlert from "@material-ui/lab/Alert";

export const Alert = ({ type, message, setMessage, timeout = 3000 }) => {
  useEffect(() => {
    if (timeout > 0) {
      if (message) setTimeout(() => setMessage(), timeout);
    }
  }, [message, timeout, setMessage]);

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
