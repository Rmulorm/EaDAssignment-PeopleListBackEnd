import csvParser from 'csv-parser';
import fs from 'fs';

import Person from '../types/Person';

class PeopleList {
  private list: Person[];

  public constructor() {
    this.list = new Array<Person>();
  }

  public updateList(filePath: string) {
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
        this.list.push(row);
      })
      .on('end', () => {
        console.log("Reading Completed");
        console.log(this.list);
      });
  }
}

export default PeopleList;