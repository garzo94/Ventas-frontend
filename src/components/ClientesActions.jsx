import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
export default function ClientesActions({ params }) {
  return (
    <Box>
      <Tooltip title="Eliminar cliente">
        <IconButton onClick={() => {}}>
          <Delete />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
