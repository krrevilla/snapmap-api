import { Injectable } from '@nestjs/common';
import { type PhMap } from './ph_map.interface';
import { databaseClient, tableNames } from '../services';

@Injectable()
export class PhMapService {
  private readonly tableName = tableNames.phMap;

  async findAll(): Promise<PhMap[]> {
    const result = await databaseClient()
      .scan({ TableName: this.tableName })
      .promise();

    return result.Items as PhMap[];
  }
}
