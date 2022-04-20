import React from 'react';
import { render } from 'react-dom';
import App from "./App"
import "./App.scss"

const container = document.getElementById('root');
render(<App />, container);

if (module.hot) {
    module.hot.accept();
  }