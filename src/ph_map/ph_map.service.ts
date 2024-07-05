import { Injectable } from '@nestjs/common';
import { database, Table } from '../services';
import { PhMap } from './entities/ph_map.entity';

@Injectable()
export class PhMapService {
  async findAll(): Promise<PhMap[]> {
    const data = await database.scan<PhMap[]>({ table: Table.phMap });

    return data;
  }
}
