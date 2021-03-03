import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const deletePrizeId = (req: Request, res: Response, next: NextFunction) => {

    const userPermission = res.locals.permissions as UserPermission;
    
    if(userPermission.role === "ORGANIZER"){
        firebaseApp
        .firestore()
        .collection("prizeCatagories")
        .doc(req.params.PrizeId)
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
export default deletePrizeId;