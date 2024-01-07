async function exportToExcelPro(
  filename,
  sheetname,
  report,
  myHeader,
  myFooter,
  width
) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(sheetname);
  const columns = myHeader?.length;
  //custom style
  const title = {
    border: true,
    height: 30,
    font: { size: 20, bold: true, color: { argb: "000000" } },
    alignment: { horizontal: "center", vertical: "middle" },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "BEFF5D",
      },
    },
  };
  const header = {
    border: true,
    height: 20,
    font: { size: 15, bold: true, color: { argb: "000000" } },
    alignment: { horizontal: "center", vertical: "middle" },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "F7FC00",
      },
    },
  };
  const data = {
    border: true,
    height: 0,
    font: { size: 12, bold: false, color: { argb: "000000" } },
    alignment: null,
    fill: null,
  };
  const footer = {
    border: true,
    height: 70,
    font: { size: 15, bold: false, color: { argb: "FFFFFF" } },
    alignment: null,
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "0000FF",
      },
    },
  };

  ws.columns = width;
  let row = addRow(ws, [report], title);
  mergeCells(ws, row, 1, columns);

  addRow(ws, myHeader, header);
  allData.data.forEach((row) => {
    addRow(ws, Object.values(row), data);
  });

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `${filename}.xlsx`);
}
function addRow(ws, data, section) {
  const boderStyles = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  const row = ws.addRow(data);
  //add custom style
  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (section?.border) cell.border = boderStyles;

    if (section?.alignment) cell.alignment = section.alignment;
    else cell.alignment = { vertical: "middle" };

    if (section?.font) cell.font = section.font;

    if (section?.fill) cell.fill = section.fill;
  });
  if (section?.height > 0) {
    row.height = section.height;
  }
  return row;
}
function mergeCells(ws, row, from, to) {
  ws.mergeCells(`${row.getCell(from)._address}:${row.getCell(to)._address}`);
}
const myHeader = [
  "Time",
  "ID",
  "Pressure (hPa)",
  "ObjectID",
  "Temperature (℃)",
  "__V",
  "Performance (%)",
  "Wind Speed (m/s)",
];

$(document).ready(() => {
  $("#table-export-file").on("click", function () {
    exportToExcelPro(
      "Data",
      `${turbine._id}`,
      dateSelect,
      myHeader,
      "myfooter",
      [
        { width: 30 },
        { width: 15 },
        { width: 20 },
        { width: 30 },
        { width: 25 },
        { width: 10 },
        { width: 25 },
        { width: 25 },
      ]
    );
  });
});
