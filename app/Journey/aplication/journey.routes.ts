import { JourneyController } from "./journey.controller.js";
import { Router,Response,Request } from "express";

export const route:Router = Router();

route.get('/',async(req:Request|any,res:Response)=>{
    const resp = new JourneyController();
    res.send(await resp.GetController(req.body));
})