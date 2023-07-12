import React from 'react';
// import Header from './components/Header';
import "react-inputs-validation/lib/react-inputs-validation.min.css";
import "./assets/bootstrap/scss/_custom_scss.scss"
import './assets/css/mystyle.scss'
import PrivateRoutes from './components/PrivateRoutes';
import Login from './views/Auth/Login';
import GuestRoutes from './components/GuestRoutes';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './views/Auth/Register';
import AdminRoutes from './components/AdminRoutes';
import AppRoutes from './components/AppRoutes';
import _routes from './_routes';
import QrCode from './views/QrCode';

function App() {
  return (
    <div className='wrapper' >
      <BrowserRouter>
        {/* <Header /> */}
        <Routes>
          <Route element={<PrivateRoutes />} >
            <Route element={<AdminRoutes />} >
              {
                _routes.admin_sidebar.routes.map((r_item, index) => (
                  <Route key={index} {...r_item} />
                ))
              }
            </Route>
            <Route element={<AppRoutes />} >
              {
                _routes.app_sidebar.routes.map((r_item, index) => (
                  <Route key={index} {...r_item} />
                ))
              }
              {
                _routes.app.routes.map((r_item, index) => (
                  <Route key={index} {...r_item} />
                ))
              }
            </Route>
          </Route>
          <Route element={<GuestRoutes />} >
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>
          <Route path='/scanme/:qr_data' element={<QrCode />} />
          <Route path='/*' element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
