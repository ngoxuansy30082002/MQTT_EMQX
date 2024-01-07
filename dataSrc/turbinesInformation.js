const turbinesInformations = [];

const fs = require("fs");
const { parse } = require("csv-parse");
const readline = require("readline");

const readTurbinesInformation = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream("./turbinesInformation.csv")
      .pipe(parse({ columns: true, trim: true }))
      .on("data", (row) => {
        const formattedRow = formatRow(row);
        turbinesInformations.push(formattedRow);
      })
      .on("end", () => {
        console.log("Reading CSV finished");
        resolve(turbinesInformations);
      });
  });
};

function formatRow(row) {
  const formattedRow = {};

  for (const key in row) {
    if (row.hasOwnProperty(key)) {
      const keys = key.split(".");
      keys.reduce((acc, currentKey, index) => {
        if (index === keys.length - 1) {
          if (currentKey.includes("[")) {
            // Handle array notation, e.g., coordinates[0]
            const arrayKey = currentKey.substring(0, currentKey.indexOf("["));
            const arrayIndex = parseInt(currentKey.match(/\[(.*?)\]/)[1], 10);
            if (!acc[arrayKey]) {
              acc[arrayKey] = [];
            }
            acc[arrayKey][arrayIndex] = row[key];
          } else {
            acc[currentKey] = row[key];
          }
        } else {
          if (!acc[currentKey]) {
            acc[currentKey] = {};
          }
        }
        return acc[currentKey];
      }, formattedRow);
    }
  }

  return formattedRow;
}

const updateCSV = (value) => {
  // Đọc từng dòng của file
  const rl = readline.createInterface({
    input: fs.createReadStream("./turbinesInformation.csv"),
    output: process.stdout,
    terminal: false,
  });
  const lines = [];
  rl.on("line", (line) => {
    // Chia dòng thành các trường bằng dấu phẩy
    const row = line.split(",");
    // Kiểm tra nếu _id trùng khớp với idToChange
    if (row[0] === value.turbine_id) {
      // Sửa giá trị của cột operatingStatus
      row[6] = value.operatingStatus;
    }
    // Ghi lại dòng đã sửa vào mảng lines
    lines.push(row.join(","));
  });

  rl.on("close", () => {
    // Ghi mảng lines vào file hiện tại
    fs.writeFileSync("./turbinesInformation.csv", lines.join("\n"), "utf-8");
  });
};

module.exports = { readTurbinesInformation, updateCSV };
