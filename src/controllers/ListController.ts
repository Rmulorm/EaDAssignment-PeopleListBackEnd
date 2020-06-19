import { Request, Response } from 'express';
import multer from 'multer';

import PeopleList from '../PeopleList/PeopleList';
import Person from '../types/Person';
import AvlTreeNode from '../AvlTree/AvlTreeNode';

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

const defaultQuery = (): Promise<Person[]> => {
  return new Promise((resolve, reject) => {
    try {
      resolve(peopleList.get());
    } catch (error) {
      reject(error);
    }
  });
}

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


const queryByName = (queriedName: string): Promise<Person[]> => {
  return new Promise((resolve, reject) => {
    const name = queriedName;
    if (!name) {
      reject(new ReferenceError("Filter 'name' must be a string"));
    }
    try {
      const people = peopleList.getByName(name);
      resolve(people);
    } catch (error) {
      reject(error);
    }
  })
}
      
const queryDateRange = (queriedDateBegin: string, queriedDateEnd: string): Promise<Person[]> => {
  return new Promise((resolve, reject) => {
    const beginDate = new Date(queriedDateBegin);
    const endDate = new Date(queriedDateEnd);
    if (!beginDate || !endDate) {
      reject(new ReferenceError("Filter 'begin date' and 'end date' must be filled"));
    }
    try {
      const people = peopleList.getByDateRange(beginDate, endDate);
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
      queryByName(request.query.name)
      .then((people) => {
        response.status(200).json(people);
      })
      .catch((error) => {
        if (error instanceof ReferenceError)
          response.status(400).send("Filter 'name' must be a string");

          response.status(404).send(error);
      });
    } else if (request.query.beginDate && typeof request.query.beginDate === 'string' && request.query.endDate && typeof request.query.endDate === 'string') {
      queryDateRange(request.query.beginDate, request.query.endDate)
      .then((people) => {
        response.status(200).json(people);
      })
      .catch((error) => {
        if (error instanceof ReferenceError)
          response.status(400).send("Filter 'beginDate' and 'endDate' must be dates");

          response.status(404).send(error);
      });
    } else {
      defaultQuery()
      .then((people) => { response.status(200).json(people) } )
      .catch((error) => { response.status(404).send(error) });
    }
  }
};
