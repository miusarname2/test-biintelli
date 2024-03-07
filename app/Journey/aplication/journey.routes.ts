import { Operations } from "../infrastructure/repository/journey.js";
import { Router,Response,Request } from "express";

export const route:Router = Router();

route.get('/',async(req:Request|any,res:Response)=>{
    const oper = new Operations();
    res.send(await oper.ObtainInfo(req.body));
})