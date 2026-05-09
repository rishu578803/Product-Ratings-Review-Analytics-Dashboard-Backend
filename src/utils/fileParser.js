import csv from "csv-parser";
import xlsx from "xlsx";
import stream from "stream";

export const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];

    const readable = new stream.Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);

    readable
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
};

export const parseExcel = (buffer) => {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];


  const raw = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const headers = raw[0];

  return raw.slice(1).map((row) => {
    let obj = {};
    headers.forEach((key, i) => {
      obj[key] = row[i];
    });
    return obj;
  });
};
