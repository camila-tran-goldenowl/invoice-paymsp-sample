export interface IToastify {
  type?: IToastType;
  title?: string | null;
  content?: string | null;
  isShow?: boolean;
  isRead?: boolean;
  from?: "sync-invoice" | "sync-email" | null;
}

export enum IToastType {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

export interface IToastifyState {
  list: Array<IToastify>;
  current: IToastify | null;
}
