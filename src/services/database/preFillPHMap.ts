import { database, Table } from './database';
import phMapData from './phMapData.json';

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

const chunkedData = chunkArray(phMapData, 25);

chunkedData.forEach((jsonData) => {
  const preData = [];
  jsonData.forEach((data) => {
    preData.push({
      PutRequest: {
        Item: {
          id: {
            S: data.id,
          },
          name: {
            S: data.name,
          },
          svg_path: {
            S: data.svg_path,
          },
        },
      },
    });
  });

  database.putBatch({ table: Table.phMap, data: preData });
});
