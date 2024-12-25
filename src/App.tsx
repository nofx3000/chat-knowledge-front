import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "mobx-react";
import store from "./mobx/mobx";
import Router from "./routers";

function App() {
  return (
    <BrowserRouter>
      <Provider {...store}>
        <Router />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
