import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";

const deleteTierId: ExpressFunction = (req, res, next) => {

    const userPermission = res.locals.permissions as UserPermission;
    
    if(userPermission.role === "ORGANIZER"){
        firebaseApp
        .firestore()
        .collection("Tiers")
        .doc(req.params.TierId)
        .delete()
        .then((document) =>{
        res.status(200).send();
        next()
    }
    ).catch((err) => {
        console.log(err);
        res.status(500).send();
        next();
    })
    } else {
        res.status(403).send();
        next();
    }
};
export default deleteTierId;
