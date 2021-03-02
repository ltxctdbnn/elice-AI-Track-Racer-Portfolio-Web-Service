import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import reportWebVitals from './reportWebVitals';



ReactDOM.render(
    <React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

serviceWorker.unregister();
reportWebVitals();