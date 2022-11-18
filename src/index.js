import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

//debugger; // TO INSPECT THE PAGE BEFORE 1ST RENDER
const rootElement = document.getElementById("root");

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



