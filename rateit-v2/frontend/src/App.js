import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar        from './components/Navbar';
import Home          from './pages/Home';
import Login         from './pages/Login';
import Register      from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import AddProduct    from './pages/AddProduct';
import EditProduct   from './pages/EditProduct';
import Dashboard     from './pages/Dashboard';
import Profile       from './pages/Profile';

export default function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                 element={<Home />} />
        <Route path="/login"            element={<Login />} />
        <Route path="/register"         element={<Register />} />
        <Route path="/product/:id"      element={<ProductDetail />} />
        <Route path="/profile"          element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/add-product"      element={user?.role === 'admin' ? <AddProduct />  : <Navigate to="/" />} />
        <Route path="/edit-product/:id" element={user?.role === 'admin' ? <EditProduct /> : <Navigate to="/" />} />
        <Route path="/dashboard"        element={user?.role === 'admin' ? <Dashboard />   : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
