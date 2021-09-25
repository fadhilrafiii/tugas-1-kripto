import React, { Suspense } from "react";

//  IMPORT ROUTER
import Route from "router/index";

// IMPORT COMPONENT
import { Navbar, Fallback } from "components";

// IMPORT STYLES
import "./index.scss";

function App() {
  return (
    <div className="App">
      <Suspense fallback={<Fallback />}>
        <Navbar />
        <Route />
      </Suspense>
    </div>
  );
}

export default App;
