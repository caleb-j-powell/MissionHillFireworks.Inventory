import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { Order } from "../types/order";
import { extractRowsFromXlsx, type RowModel } from "../helpers/excel-helper";

interface Props {
  open: boolean;
  onClose: () => void;
  order: Order;
}

export default function UploadOrderExcelDialog({
  open,
  onClose,
  order,
}: Props) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [rows, setRows] = useState<RowModel[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    const rows = await extractRowsFromXlsx(selectedFile);

    console.log(rows);

    const filteredRows = rows.filter((r) => r.orderedQuantity);

    setRows(filteredRows);
  };

  const importFile = async () => {
    if (!file) return;

    const request = {
      items: rows,
    };

    await fetch(`${API_URL}/order/${order.id}/import`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    onClose();
  };

  const reset = () => {
    setRows([]);
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={reset} fullWidth maxWidth="lg">
      <DialogTitle>Import Orders</DialogTitle>

      <DialogContent dividers>
        <Button component="label" variant="contained">
          Choose Excel File
          <input
            hidden
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
          />
        </Button>

        {file && <Typography sx={{ mt: 2 }}>{file.name}</Typography>}

        {rows.length > 0 && (
          <TableContainer
            component={Paper}
            sx={{
              mt: 3,
              maxHeight: 450,
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell key="Stock #">
                    <strong>Stock #</strong>
                  </TableCell>
                  <TableCell key="Ordered Quantity">
                    <strong>Ordered Quantity</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell key={`sn-${index}`}>{row.stockNumber}</TableCell>
                    <TableCell key={`oq-${index}`}>
                      {row.orderedQuantity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={reset}>Cancel</Button>

        <Button variant="contained" disabled={!file} onClick={importFile}>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
}
