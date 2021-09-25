// IMPORT MODULES
import React from 'react';
import Alert from '@material-ui/lab/Alert';

const CustomAlert = (props) => {
  const {
    type,
    message,
    setMessage,
  } = props;

  if (message) {
    return (
      <Alert
        className="alert"
        variant="filled"
        severity={type}
        onClose={() =>  setMessage('') }
      >
        {message}
      </Alert>
    );
  }

  return <></>
}

export default CustomAlert;
