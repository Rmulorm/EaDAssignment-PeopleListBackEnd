import csvParser from 'csv-parser';
import fs from 'fs';

import Person from '../types/Person';
import AvlTree from '../AvlTree/AvlTree';
import NumberComparator from '../AvlTree/Comparators/NumberComparator';
import StringComparator from '../AvlTree/Comparators/StringComparator';
import DateComparator from '../AvlTree/Comparators/DateComparator';

class PeopleList {
  private list: Person[];
  private cpfTree: AvlTree<number>;
  private nameTree: AvlTree<string>;
  private birthDayTree: AvlTree<Date>;

  public constructor() {
    this.list = new Array<Person>();

    this.cpfTree = new AvlTree<number>(new NumberComparator());
    this.nameTree = new AvlTree<string>(new StringComparator());
    this.birthDayTree = new AvlTree<Date>(new DateComparator());
  }

  private initialize() {
    this.list = new Array<Person>();

    this.cpfTree = new AvlTree<number>(new NumberComparator());
    this.nameTree = new AvlTree<string>(new StringComparator());
    this.birthDayTree = new AvlTree<Date>(new DateComparator());
  }

  public async updateList() {
    this.initialize();

    fs.createReadStream('./public/received_csv/PeopleList.csv')
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
        this.list.push(this.parseCsvRow(row));
      })
      .on('end', () => {
        this.list.forEach((person, index) => {
          this.cpfTree.add(person.cpf, index);
          this.nameTree.add(person.name, index);
          this.birthDayTree.add(person.birthDay, index);
        });
      });
  }

  private parseCsvRow(csvRow: any): Person {
    return {
      cpf: Number(csvRow.cpf),
      rg: Number(csvRow.rg),
      name: csvRow.name,
      birthDay: this.parseDate(csvRow.birthDay),
      cityOfBirth: csvRow.cityOfBirth
    };
  }

  private parseDate(date: string): Date {
    return new Date(`${date.substring(6)}/${date.substring(3,5)}/${date.substring(0,2)}`);
  }

  public get(): Person[] {
    return this.list;
  }

  public getByCpf(cpf: number): Person[] {
    const personIndexes = this.cpfTree.find(cpf);

    if (!personIndexes) {
      throw new Error(`Person with CPF ${cpf} doesn't exist.`);
    }

    const personReturn = new Array<Person>();
    personIndexes.forEach((index) => { personReturn.push(this.list[index]) } );

    return personReturn;
  }
}

export default PeopleList;