export interface ImportRowError {
  row: number;
  error: string;
}

export interface ImportSummary {
  total: number;
  imported: number;
  failed: ImportRowError[];
}
