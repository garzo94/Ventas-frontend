import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  AlertTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { AuthContext } from "../context/authContextProvider";

export default function Login() {
  const [error, setError] = useState();
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = ({ username, password }) => {
    axios
      .post("http://127.0.0.1:8000/api/login/", {
        username: username,
        password: password,
      })
      .then((response) => {
        const auth_token = response.data.token;
        localStorage.setItem("authToken", auth_token);
        setIsAuthenticated(true);
        navigate("/");
      })
      .catch((error) => {
        console.log(error, "error");
        setError(error);
      });
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "rgba(25, 118, 210, 0.3)",
      }}
    >
      <Box
        sx={{
          width: 400,
          padding: 5,
          borderRadius: 3,
          textAlign: "center",
          bgcolor: "white",
        }}
      >
        {error && (
          <Alert
            severity="error"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <AlertTitle>Error</AlertTitle>
            Credenciales no fueron válidas
          </Alert>
        )}
        <LockOpenIcon sx={{ my: 1 }} />
        <Typography sx={{ marginBottom: 5 }}>Iniciar Sesion</Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            sx={fieldStyles}
            fullWidth
            id="username"
            name="username"
            label="Usuario"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            sx={fieldStyles}
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button color="primary" variant="contained" fullWidth type="submit">
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
}

const validationSchema = yup.object({
  username: yup.string("Enter your email").required("Email is required"),
  password: yup.string("Enter your password").required("Password is required"),
});

const fieldStyles = {
  marginBottom: 3,
};
