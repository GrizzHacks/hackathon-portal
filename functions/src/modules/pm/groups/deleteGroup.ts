import { ExpressFunction } from "../../../@types";

const replaceMe: ExpressFunction = (req, res, next) => { 
    res.status(200).send();
};

export default replaceMe;
