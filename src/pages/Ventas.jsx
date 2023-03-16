import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { DataGridPro } from "@mui/x-data-grid-pro";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import axios from "axios";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  Slide,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  Select,
  Stack,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useFormik } from "formik";
import * as yup from "yup";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// snackbar

function DetailPanelContent({ row: rowProp }) {
  const [ventas, setVentas] = useState([]);

  return (
    <Stack
      sx={{ py: 2, height: "100%", boxSizing: "border-box" }}
      direction="column"
    >
      <Paper sx={{ flex: 1, mx: "auto", width: "90%", p: 1 }}>
        <Stack direction="column" spacing={1} sx={{ height: 1 }}>
          <Typography variant="h6">{`Venta #${rowProp.id}`}</Typography>
          <Grid container>
            <Grid item md={6}>
              <Typography variant="body2" color="textSecondary">
                Informacion del cliente
              </Typography>
              <Typography variant="body1">{rowProp.nombre}</Typography>
              <Typography variant="body1">
                {rowProp.correo_electronico}
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Typography variant="body2" align="right" color="textSecondary">
                Direccion y Telefono
              </Typography>
              <Typography noWrap variant="body1" align="right">
                {rowProp.direccion}
              </Typography>
              <Typography variant="body1" align="right">
                {rowProp.telefono}
              </Typography>
            </Grid>
          </Grid>
          <DataGridPro
            density="compact"
            columns={[
              { field: "id", headerName: "Id" },
              { field: "nombre", headerName: "Product", flex: 1 },
              {
                field: "cantidad",
                headerName: "Cantidad",
                align: "center",
                type: "number",
              },
              { field: "precio", headerName: "Precio", type: "number" },
              {
                field: "precio_total",
                headerName: "Total",
                type: "number",
                // valueGetter: ({ row }) => row.quantity * row.unitPrice,
              },
            ]}
            rows={rowProp.products}
            sx={{ flex: 1 }}
            hideFooter
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

DetailPanelContent.propTypes = {
  row: PropTypes.object.isRequired,
};

const columns = [
  { field: "id", headerName: "Venta Id" },
  { field: "nombre", headerName: "Cliente", width: 175 },
  { field: "fecha_venta", headerName: "Fecha de la Venta", width: 150 },
  { field: "precio_total", headerName: "Total", type: "number" },
];

export default function Ventas() {
  const [cliente, setCliente] = React.useState();
  const [clientes, setClientes] = React.useState([]);
  const [productos, setProductos] = React.useState([]);
  const [producto, setProducto] = React.useState();
  const [openSnack, setOpenSnack] = React.useState(false);
  const [productosVenta, setProductosVenta] = useState([]);

  const handleClickSnack = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  // get clientes
  function getClientes() {
    const token = localStorage.getItem("authToken"); // Obtener el token de almacenamiento local
    const config = {
      headers: { Authorization: `Token ${token}` }, // Pasar el token en el encabezado Authorization
    };
    axios
      .get("http://127.0.0.1:8000/api/cli/", config)
      .then((response) => {
        setClientes(response.data.clientes);
        setProductos(response.data.productos);
      })
      .catch((error) => {});
  }

  // client form
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [ventas, setVentas] = useState([]);
  const [ventasFormato, setVentasFormato] = useState([]);

  function getVentas() {
    const token = localStorage.getItem("authToken"); // Obtener el token de almacenamiento local
    const config = {
      headers: { Authorization: `Token ${token}` }, // Pasar el token en el encabezado Authorization
    };
    axios
      .get("http://127.0.0.1:8000/api/ventas/", config)
      .then((response) => {
        setVentas(response.data);
      })
      .catch((error) => {});
  }

  useEffect(() => {
    getVentas();
    getClientes();
  }, []);

  // producto venta
  useEffect(() => {
    if (
      productos.length > 0 &&
      !productosVenta.some((item) => item.id === producto)
    ) {
      const productoEncontrado = productos.find(
        (producto) => producto === producto
      );
      setProductosVenta([...productosVenta, productoEncontrado]);
    }
  }, [producto]);

  useEffect(() => {
    if (ventas.length > 0) {
      const rows = ventas.map((obj) => {
        const { id, venta_detalle, cliente, fecha_venta, precio_total } = obj;
        return {
          id,
          cliente: cliente.nombre,
          fecha_venta: fecha_venta,
          precio_total: precio_total,
          nombre: cliente.nombre,
          correo_electronico: cliente.correo_electronico,
          direccion: cliente.direccion,
          telefono: cliente.telefono, // replace with randomCountry() or any other logic to generate a random country
          products: venta_detalle.map((detail) => {
            const { id, producto, cantidad, precio_unitario, precio_total } =
              detail;
            return {
              id,
              nombre: producto.nombre,
              cantidad: cantidad,
              precio: parseFloat(precio_unitario),
              precio_total: parseFloat(precio_total),
            };
          }),
        };
      });
      setVentasFormato(rows);
    }
  }, [ventas]);

  const getDetailPanelContent = React.useCallback(
    ({ row }) => <DetailPanelContent row={row} />,
    []
  );

  const getDetailPanelHeight = React.useCallback(() => 400, []);

  const handleChangeClient = (event) => {
    setCliente(event.target.value);
  };
  const handleChangeProducto = (event) => {
    setProducto(event.target.value);
  };

  return (
    <>
      <Box>
        <Typography
          sx={{ fontSize: 30, marginTop: 5, marginBottom: 5, marginLeft: 2 }}
        >
          Mis Ventas
        </Typography>
        <Button
          variant="contained"
          sx={{ position: "absolute", right: "2%", top: "22%" }}
          onClick={handleClickOpen}
        >
          Agregar Venta
        </Button>

        {ventas.length > 0 && (
          <Box sx={{ width: 800, height: 400, zIndex: -1 }}>
            <DataGridPro
              columns={columns}
              rows={ventasFormato}
              rowThreshold={0}
              getDetailPanelHeight={getDetailPanelHeight}
              getDetailPanelContent={getDetailPanelContent}
            />
          </Box>
        )}
      </Box>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .css-1t1j96h-MuiPaper-root-MuiDialog-paper": {
            maxWidth: 900,
          },
        }}
      >
        <Box sx={{ width: 800, height: 500, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ p: 2, fontSize: 25 }}>Cliente:</Typography>
            <Box sx={{ minWidth: 250 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Cliente</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Cliente"
                  onChange={handleChangeClient}
                >
                  {clientes.map((cliente) => {
                    return (
                      <MenuItem key={cliente.id} value={cliente.id}>
                        {cliente.nombre}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>

            <Typography sx={{ p: 2, fontSize: 25 }}>Producto:</Typography>
            <Box sx={{ minWidth: 250 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Producto</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Producto"
                  onChange={handleChangeProducto}
                >
                  {productos.map((producto) => {
                    return (
                      <MenuItem key={producto.id} value={producto.id}>
                        {producto.nombre}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "column",
              mt: 2,
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Typography sx={{ fontSize: 20 }}>Producto</Typography>
              <Typography sx={{ fontSize: 20 }}>Cantidad</Typography>
              <Typography sx={{ fontSize: 20 }}>Precio Unitario</Typography>
              <Typography sx={{ fontSize: 20 }}>Total</Typography>
            </Box>

            {productosVenta.map((producto) => {
              return (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-around",
                    marginBottom: "10px",
                  }}
                >
                  <Typography>{producto.nombre}</Typography>
                  <Typography>Cantidad</Typography>
                  <Typography>{producto.precio}</Typography>
                  <Typography>Total</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
