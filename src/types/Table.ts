export interface IColumn {
  Header: string;
  accessor: string;
  width?: string;
  Cell?: any;
}

export interface IRow {
  [key: string]: any;
}

export interface ITable {
  columns: { [key: string]: any }[];
  rows: { [key: string]: any }[];
}

export type PageSizeType = 5 | 10 | 15 | 20 | 25 | 100;
