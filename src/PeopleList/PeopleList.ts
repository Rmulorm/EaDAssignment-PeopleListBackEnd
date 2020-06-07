import csvParser from 'csv-parser';
import fs from 'fs';

import Person from '../types/Person';

const list = new Array<Person>();

fs.createReadStream('./testList.csv')
  .pipe(csvParser({
    separator: ';',
    headers: [
      "cpf",
      "rg",
      "name",
      "birthDay",
      "cityOfBirth"
    ]
  }))
  .on('data', (row) => {
    list.push(row);
  })
  .on('end', () => {
    console.log("Reading Completed");
    console.log(list);
  })