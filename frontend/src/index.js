import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import store from "./store";

import {positions, transitions, Provider as AlertProvider} from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import 'react-bootstrap';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';

const options = {
    timeout: 5000,
    position: positions.TOP_CENTER,
    transition:transitions.SCALE,
    offset: '30px',
}

ReactDOM.render(
    <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...options}>
            <App/>
        </AlertProvider>
    </Provider>,
    document.getElementById('root')
);


reportWebVitals();
