import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import ProtectedRoute from './Components/ProtectedRoute';
import SignIn from './Components/SignIn';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));


const appRoutes = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><App /></ProtectedRoute>
  },
  {
    path: '/signin',
    element:<SignIn/>
  },
  {
    path:'*',
    element:<ProtectedRoute><App /></ProtectedRoute>
  }
])
root.render(
  <React.StrictMode>
      <RouterProvider router={appRoutes} />
  </React.StrictMode>

);

