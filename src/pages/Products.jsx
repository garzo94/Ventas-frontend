import React, { useEffect, useState } from "react";
import { Skeleton, Typography, Button } from "@mui/material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

export default function Products() {
  const [products, setProducts] = useState([]);

  function getProducts() {
    const token = localStorage.getItem("authToken"); // Obtener el token de almacenamiento local
    const config = {
      headers: { Authorization: `Token ${token}` }, // Pasar el token en el encabezado Authorization
    };
    axios
      .get("http://127.0.0.1:8000/api/productos/", config)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getProducts();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nombre", headerName: "Nombre", width: 200 },
    {
      field: "descripcion",
      headerName: "Descripcion",
      width: 250,
    },
    {
      field: "precio",
      headerName: "Precio",
      type: "number",
      width: 150,
      editable: true,
    },
  ];
  return (
    <div style={{ width: "100%", overflowX: "scroll" }}>
      <Typography
        sx={{ fontSize: 30, marginTop: 5, marginBottom: 5, marginLeft: 2 }}
      >
        Mis Productos
      </Typography>
      {products.length > 0 ? (
        <div style={{ height: 400, width: "100%", overflow: "scroll" }}>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      ) : (
        <div
          style={{
            height: 400,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Skeleton width={"100%"} height={1000} />
        </div>
      )}
    </div>
  );
}
