const fs = require('fs');

fs.readFile('./src/services/database/phMapData.json', 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  try {
    // Parse JSON data into an array of objects
    const jsonData = JSON.parse(data);
    const chunkedData = chunkArray(jsonData, 25);

    chunkedData.forEach((jsonData, index) => {
      const params = { ph_map: [] };
      jsonData.forEach((data) => {
        params.ph_map.push({
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

      fs.writeFileSync(
        `./src/services/database/phMapPreData${index + 1}.json`,
        JSON.stringify(params, null, 2),
        'utf8',
      );
    });
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});
