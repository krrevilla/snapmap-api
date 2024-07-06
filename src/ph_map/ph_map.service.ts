import { Injectable } from '@nestjs/common';
import { database, DatabaseTable } from '../services';
import { PhMap } from './entities/ph_map.entity';

@Injectable()
export class PhMapService {
  private tableName = DatabaseTable.phMap;

  async findAll(): Promise<PhMap[]> {
    const data = await database.scan<PhMap[]>({ tableName: this.tableName });

    return data;
  }
}
