import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// ➕ استدعاء المزود من المكتبة اللي نزلناها
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ➕ حط الكود الطويل مالك داخل الـ clientId هني بالضبط */}
    <GoogleOAuthProvider clientId="1024770560325-89uafhgvao08eqn8rau758c7qfqdk4bk.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)