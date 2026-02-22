import "server-only";

export interface PortfolioCsvRecord {
  category: string;
  label: string;
  amount: string;
  snapshotDate: string;
}

const REQUIRED_COLUMNS = ["category", "label", "amount", "snapshotDate"];

const MAX_ROWS = 100;

export class PortfolioCsvLoader {
  load(csvContent: string): PortfolioCsvRecord[] {
    if (!csvContent.trim()) {
      return [];
    }

    const lines = csvContent.trim().split("\n");

    if (lines.length === 0) {
      return [];
    }

    const headerLine = lines[0];
    const headers = this.parseCSVLine(headerLine);

    if (headers.length === 0) {
      throw new Error("Invalid CSV format: no headers found");
    }

    const missingColumns = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
    if (missingColumns.length > 0) {
      throw new Error(`Invalid CSV format: missing required columns: ${missingColumns.join(", ")}`);
    }

    const dataLines = lines.slice(1).filter((line) => line.trim());

    if (dataLines.length > MAX_ROWS) {
      throw new Error(`CSVの行数が上限（${MAX_ROWS}行）を超えています`);
    }

    return dataLines.map((line) => {
      const values = this.parseCSVLine(line);
      return this.createRecord(headers, values);
    });
  }

  private parseCSVLine(line: string): string[] {
    const chars = Array.from(line.replace(/\r$/, ""));

    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      if (char === '"') {
        if (inQuotes && chars[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  private createRecord(headers: string[], values: string[]): PortfolioCsvRecord {
    const record: Partial<PortfolioCsvRecord> = {};

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i] as keyof PortfolioCsvRecord;
      if (REQUIRED_COLUMNS.includes(header)) {
        record[header] = values[i] || "";
      }
    }

    return {
      category: record.category || "",
      label: record.label || "",
      amount: record.amount || "",
      snapshotDate: record.snapshotDate || "",
    };
  }
}
