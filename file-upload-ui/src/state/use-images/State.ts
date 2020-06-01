import { ApiStatus } from './ApiStatus'

export type State = {
  apiStatus: ApiStatus
  images: Image[];
  filterPattern: string;
};
