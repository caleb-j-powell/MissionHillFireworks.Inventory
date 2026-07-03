import { useState } from "react";
import * as XLSX from "xlsx";
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

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UploadOrderExcelDialog({
  open,
  onClose,
}: Props) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [rows, setRows] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    const data = await selectedFile.arrayBuffer();

    const workbook = XLSX.read(data);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const json = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
    });

    setRows(json);
  };

  const importFile = async () => {
    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    await fetch(`${API_URL}/orders/import`, {
      method: "POST",
      body: formData,
    });

    onClose();
  };

  const reset = () => {
    setRows([]);
    setFile(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={reset}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>Import Orders</DialogTitle>

      <DialogContent dividers>

        <Button
          component="label"
          variant="contained"
        >
          Choose Excel File

          <input
            hidden
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
          />
        </Button>

        {file && (
          <Typography sx={{ mt: 2 }}>
            {file.name}
          </Typography>
        )}

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
                  {Object.keys(rows[0]).map((key) => (
                    <TableCell key={key}>
                      <strong>{key}</strong>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value, i) => (
                      <TableCell key={i}>
                        {String(value)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>
        )}

      </DialogContent>

      <DialogActions>
        <Button onClick={reset}>
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!file}
          onClick={importFile}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
}