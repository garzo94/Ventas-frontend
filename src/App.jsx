import { useState } from "react";
import Root from "./routes/Root";
import Clientes from "./pages/Clientes";
import Products from "./pages/Products";
import Ventas from "./pages/Ventas";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { CssBaseline } from "@mui/material";
import AuthContextProvider from "./context/authContextProvider";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import RequireAuth from "./auth/RequireAuth";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Root />}>
            <Route index element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/ventas" element={<Ventas />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
      </>
    )
  );
  return (
    <div className="App">
      <AuthContextProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </AuthContextProvider>
    </div>
  );
}

export default App;
