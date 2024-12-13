import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './../node_modules/bootstrap/dist/css/bootstrap.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 // Охуеть StrictMode повторно рендерит useEffect -в проде такогоне будеь с ума можно сойти !!!
 /*
 Если ваш проект использует React.StrictMode 
 (по умолчанию включен в новых проектах React), 
 то React в режиме разработки выполняет дважды вызов жизненных циклов
 и эффектов (например, useEffect) для выявления потенциальных побочных
 эффектов. Это позволяет обнаружить неявные побочные эффекты, такие
 как использование методов, которые изменяют состояние или данные вне цикла рендеринга.
 Это поведение не происходит в production-сборке, поэтому в 
 продакшене useEffect вызовется только один раз.
 */
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
