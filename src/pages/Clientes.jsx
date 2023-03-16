import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Skeleton,
  Typography,
  Box,
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  Slide,
  TextField,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Clientes() {
  // snackbar
  const [openSnack, setOpenSnack] = React.useState(false);

  const handleClickSnack = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };
  // create cliente
  const formik = useFormik({
    initialValues: {
      nombre: "",
      telefono: "",
      direccion: "",
      correo_electronico: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleAddClient(values);
    },
  });
  // client form
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // usestates
  const [clients, setClients] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  function getClientes() {
    setLoading(true);
    const token = localStorage.getItem("authToken"); // Obtener el token de almacenamiento local
    const config = {
      headers: { Authorization: `Token ${token}` }, // Pasar el token en el encabezado Authorization
    };
    axios
      .get("https://agenciasway.up.railway.app/api/clientes/", config)
      .then((response) => {
        setClients(response.data);
        setLoading(True);
      })
      .catch((error) => {
        setError(error);
      });
  }

  // Actualizar cliente
  const handleProcessRowUpdate = (newRow, oldRow) => {
    const token = localStorage.getItem("authToken");
    axios
      .put(
        `https://agenciasway.up.railway.app/api/clientes/${newRow.id}/`,
        newRow,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((response) => {})
      .catch((error) => {
        console.log(error);
        // handle error
      });
  };

  // Delete cliente
  const handleDeleteCliente = (params) => {
    const token = localStorage.getItem("authToken");
    axios
      .delete(`https://agenciasway.up.railway.app/api/clientes/${params.id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        getClientes();
      })
      .catch((error) => {
        console.log(error);
        // handle error
      });
  };

  // Agregar cliente
  const handleAddClient = (data) => {
    const token = localStorage.getItem("authToken");
    axios
      .post(`https://agenciasway.up.railway.app/api/clientes/`, data, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        handleClose();
        getClientes();
        handleClickSnack();
      })
      .catch((error) => {
        console.log(error);
        // handle error
      });
  };

  // Get clientes
  useEffect(() => {
    getClientes();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nombre", headerName: "Nombre", width: 100, editable: true },
    {
      field: "telefono",
      headerName: "Teléfono",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "correo_electronico",
      headerName: "Correo Electrónico",
      width: 150,
      editable: true,
    },
    { field: "direccion", headerName: "Dirección", width: 250, editable: true },
    { field: "fecha_registro", headerName: "Fecha de Registro", width: 150 },
    { field: "tipo_cliente", headerName: "Tipo de Cliente", width: 125 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      renderCell: (params) => (
        <Tooltip title="Eliminar cliente">
          <IconButton
            onClick={() => {
              handleDeleteCliente({ ...params.row });
            }}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    // <Box sx={{ width: "100%", bgcolor: "red" }}>
    //   <Typography sx={{ fontSize: 30, my: 5, mx: 6 }}>Mis Clientes</Typography>
    <div style={{ width: "100%", overflowX: "scroll" }}>
      <Typography
        sx={{ fontSize: 30, marginTop: 5, marginBottom: 5, marginLeft: 2 }}
      >
        Mis Clientes
      </Typography>
      <Button
        variant="contained"
        sx={{ position: "absolute", right: "2%", top: "22%" }}
        onClick={handleClickOpen}
      >
        Agregar Cliente
      </Button>
      {clients.length > 0 ? (
        <div style={{ height: 400, width: "100%", overflow: "scroll" }}>
          <DataGrid
            rows={clients}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            processRowUpdate={handleProcessRowUpdate}
            onProcessRowUpdateError={(error) => error}
            hideFooter
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
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={formik.handleSubmit} style={{ padding: 40 }}>
          <Typography sx={{ textAlign: "center", my: 2 }}>
            Agregar Cliente
          </Typography>
          <TextField
            sx={{ marginBottom: 2 }}
            fullWidth
            id="nombre"
            name="nombre"
            label="nombre"
            value={formik.values.nombre}
            onChange={formik.handleChange}
            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
            helperText={formik.touched.nombre && formik.errors.nombre}
          />
          <TextField
            sx={{ marginBottom: 2 }}
            fullWidth
            id="telefono"
            name="telefono"
            label="telefono"
            type="telefono"
            value={formik.values.telefono}
            onChange={formik.handleChange}
            error={formik.touched.telefono && Boolean(formik.errors.telefono)}
            helperText={formik.touched.telefono && formik.errors.telefono}
          />

          <TextField
            sx={{ marginBottom: 2 }}
            fullWidth
            id="correo_electronico"
            name="correo_electronico"
            label="correo_electronico"
            type="correo_electronico"
            value={formik.values.correo_electronico}
            onChange={formik.handleChange}
            error={
              formik.touched.correo_electronico &&
              Boolean(formik.errors.correo_electronico)
            }
            helperText={
              formik.touched.correo_electronico &&
              formik.errors.correo_electronico
            }
          />

          <TextField
            sx={{ marginBottom: 2 }}
            fullWidth
            id="direccion"
            name="direccion"
            label="direccion"
            type="direccion"
            value={formik.values.direccion}
            onChange={formik.handleChange}
            error={formik.touched.direccion && Boolean(formik.errors.direccion)}
            helperText={formik.touched.direccion && formik.errors.direccion}
          />

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button color="primary" variant="contained" type="submit">
              Agregar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
      >
        <Alert
          onClose={handleCloseSnack}
          severity="success"
          sx={{ width: "100%" }}
        >
          Cliente agregado exitosamente!
        </Alert>
      </Snackbar>
    </div>

    // </Box>
  );
}

const validationSchema = yup.object({
  nombre: yup.string("Ingresa tu nombre").required("Campo requerido"),
  telefono: yup.string("Ingresa tu telefono").required("Campo requerido"),
  correo_electronico: yup
    .string("Ingresa tu telefono")
    .required("Campo requerido"),
  direccion: yup.string("Ingresa tu telefono").required("Campo requerido"),
});
