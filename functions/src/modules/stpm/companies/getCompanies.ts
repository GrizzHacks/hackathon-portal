import type { NextFunction, Request, Response } from "express";
//import { document } from "firebase-functions/lib/providers/firestore";
//import { document } from "firebase-functions/lib/providers/firestore";
import { firebaseApp } from "../../../config/firebaseConfig";


const getCompanies = (req: Request, res: Response, next: NextFunction) => {
    const userPermission = res.locals.permissions as UserPermission;
    if(userPermission.role === "ORGANIZER"){
    firebaseApp
    .firestore()
    .collection("sponsorCompany")
    .doc(req.params.sponsorCompany)
    .get().
    then((document) => {
        console.log(req.params.sponsorCompany);
        // document.data().forEach(element => {
        //     console.log(element);
        // });
        res.status(200).send(document.data()); //unsure on how to add the foreach loop here
    }).catch((err) => {
        console.log(err);
        res.status(500).send();
        next();
    });

    } else {
        res.status(403).send();
        next();
        }

};

export default getCompanies;
