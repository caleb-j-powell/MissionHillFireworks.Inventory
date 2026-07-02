import { useState } from "react";
import * as XLSX from "xlsx";

export default function UploadOrderExcel() {
  const [rows, setRows] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    // Read first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    setRows(json);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Upload Order Sheet</h1>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        style={{ marginTop: "1rem" }}
      />

      {fileName && <p>Uploaded: {fileName}</p>}

      {rows.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Preview</h2>
          <table border={1} cellPadding={6}>
            <thead>
              <tr>
                {Object.keys(rows[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((value, j) => (
                    <td key={j}>{String(value)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
