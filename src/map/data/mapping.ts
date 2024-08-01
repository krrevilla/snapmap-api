import { Map, MapCode } from '../map.entity';
import PH from './ph.map.json';

export const codeMapping: Record<MapCode, Map[]> = {
  ph: PH,
};
