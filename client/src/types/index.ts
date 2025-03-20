export interface SheetData {
  values: string[][];
}

export interface ConnectionStatus {
  connected: boolean;
  authenticated: boolean;
  spreadsheetId: string;
  range: string;
}

export interface Configuration {
  spreadsheetId: string;
  range: string;
}
