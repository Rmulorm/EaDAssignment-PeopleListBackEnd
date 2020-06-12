import { Request, Response } from 'express';
import multer from 'multer';

import PeopleList from '../PeopleList/PeopleList';

const storage = multer.diskStorage({
  destination: function (request: Request, file: Express.Multer.File, callBack: Function) {
    callBack(null, 'public/received_csv')
  },
  filename: function (request: Request, file: Express.Multer.File, callBack: Function) {
    callBack(null, 'PeopleList.csv')
  }
});

var upload = multer({ storage: storage }).single('file');

const peopleList = new PeopleList();

export default {
  create(request: Request, response: Response) {
    upload(request, response, (error: any) => {
      if (error) {
        response.status(500).json(error);
        return;
      }
      response.status(200).send();

      peopleList.updateList();
    });
  },

  // index(request: Request, response: Response) {
    
  // }
};
