import { DatabaseTable } from './database';

type DatabaseParams = {
  tableName: DatabaseTable;
};

export type DatabaseScanParams = DatabaseParams;

export type DatabaseQueryParams = DatabaseParams & {
  key: Record<string, any>;
  indexName?: string;
};

export type DatabasePutParams = DatabaseParams & {
  data: Record<string, any>;
};

export type DatabasePutBatchParams = DatabaseParams & {
  data: any;
};

export type DatabaseUpdateParams = DatabaseParams & {
  key: Record<string, any>;
  data: Record<string, any>;
  condition?: Record<string, any>;
};

export type DatabaseGetParams = DatabaseParams & {
  key: Record<string, any>;
};

export type DatabaseRemoveParams = DatabaseParams & {
  key: Record<string, any>;
  condition?: Record<string, any>;
};
