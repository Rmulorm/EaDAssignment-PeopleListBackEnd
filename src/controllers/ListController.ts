import { Request, Response } from 'express';
import multer from 'multer';

import PeopleList from '../PeopleList/PeopleList';
import Person from '../types/Person';

const peopleList = new PeopleList();

const storage = multer.diskStorage({
  destination: function (request: Request, file: Express.Multer.File, callBack: Function) {
    callBack(null, 'public/received_csv')
  },
  filename: function (request: Request, file: Express.Multer.File, callBack: Function) {
    callBack(null, 'PeopleList.csv')
  }
});
const upload = multer({ storage: storage }).single('file');

const queryByCPf = (queriedCpf: string): Promise<Person[]> => {
  return new Promise((resolve, reject) => {
    const cpf = Number(queriedCpf);
    if (isNaN(cpf)) {
      reject(new ReferenceError("Filter 'cpf' must be a number"));
    }
    try {
      const people = peopleList.getByCpf(cpf);
      resolve(people);
    } catch (error) {
      reject(error);
    }
  })
}

export default {
  create(request: Request, response: Response) {
    upload(request, response, (error: any) => {
      if (error) {
        response.status(500).json(error);
        return;
      }
      response.status(200).send();

      peopleList.updateList();
      console.log('List Updated');
    });
  },

  index(request: Request, response: Response) {
    if (request.query.cpf && typeof request.query.cpf === 'string') {
      queryByCPf(request.query.cpf)
      .then((people) => {
        response.status(200).json(people);
      })
      .catch((error) => {
        if (error instanceof ReferenceError)
          response.status(400).send("Filter 'cpf' must be a number");

          response.status(404).send(error);
      });
    } else if (request.query.name && typeof request.query.name === 'string') {
      // Insert here code to queryByName
    } else if (request.query.beginDate && typeof request.query.beginDate === 'string' && request.query.endDate && typeof request.query.endDate === 'string') {
      // Insert here code to queryDateRage
    } else {
      response.status(200).json(peopleList.get());
    }
  }
};
