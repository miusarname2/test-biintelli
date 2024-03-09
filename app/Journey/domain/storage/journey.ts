import { Response, Request } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Journey } from "../dto/journey.dto.js";

export var data: object;

export async function validateUser(req: Request, res: Response, next: any) {
  try {
    data = plainToClass(Journey, req.body, {
      excludeExtraneousValues: true,
    });
    await validate(data);
    req.body = data;
    next();
    return data;
  } catch (error) {
    console.error("Error de validación:", error);
    res.status(500).send(JSON.stringify(error));
    return error;
  }
}
