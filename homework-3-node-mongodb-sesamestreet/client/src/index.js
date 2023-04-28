import React from 'react'
import ReactDOM from 'react-dom'
// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRoute } from 'react-router-dom';
import './index.css'
import App from './App'

// const root = createRoot(document.getElementById("root"));

// root.render(
//   <StrictMode>
//     <BrowserRoute>
//       <App />
//     </BrowserRoute>
//   </StrictMode>
// );

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
