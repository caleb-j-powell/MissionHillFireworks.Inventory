import * as XLSX from "xlsx";

export type RowModel = {
  stockNumber: string;
  orderedQuantity?: number;
};

export const extractRowsFromXlsx = (file: File): Promise<RowModel[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);

        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet → JSON
        const json = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

        const result: RowModel[] = json.map((row) => {

          return {
            stockNumber: row["WINCO FIREWORKS INTERNATIONAL LLC "],
            orderedQuantity: row["__EMPTY"]
              ? Number(row["__EMPTY"])
              : undefined,
          };
        });

        resolve(result);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
};
