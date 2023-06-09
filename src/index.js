import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Components/App';
import {LoginPage} from './Components/LoginPage.js'
import {RegisterPage} from './Components/RegisterPage.js'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div>
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  </BrowserRouter>
</div>
);