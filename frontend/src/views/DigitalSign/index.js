import React, { useState, useMemo } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { TabContext, TabPanel } from '@material-ui/lab';
import { Alert } from 'components';

import GenerateKey from './GenerateKey';

const DigitalSign = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tab, setTab] = useState("0");
  const tabList = useMemo(() => ['Generate Key', 'Generate Sign', 'Verify Sign'], []);
  const handleChangeTab = (e, val) => setTab(val);
  return (
    <>
      <Alert
        type={successMessage ? "success" : "error"}
        message={successMessage || errorMessage}
        setMessage={() => {
          setErrorMessage("");
          setSuccessMessage("");
        }}
      />
      <div className="digital-sign">
        <h1 className="title-page">Digital Sign</h1>
        <p className="subtitle">Using RSA + SHA256</p>
        <TabContext value={tab}>
          <div className="tab-container">
            <Tabs
              value={tab}
              onChange={handleChangeTab}
              style={{ color: '#265158' }}
              TabIndicatorProps={{
                style: { background:'#265158' }
              }}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              {tabList.map((t, idx) => (
                <Tab key={t} label={t} value={idx.toString()} />
              ))}
            </Tabs>
          </div>
          
          <TabPanel value="0">
            <GenerateKey setSuccess={setSuccessMessage} setError={setErrorMessage} />
          </TabPanel>
          <TabPanel value="1">
            Generate Sign
          </TabPanel>
          <TabPanel value="2">
            Verify Sign
          </TabPanel>
        </TabContext>
      
      </div>
    </>
  )
}

export default DigitalSign;
