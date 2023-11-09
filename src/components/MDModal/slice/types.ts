export interface IModalState {
  name: string | null;
  data?: any;
  action?: () => void;
  isRefresh?: boolean;
}
