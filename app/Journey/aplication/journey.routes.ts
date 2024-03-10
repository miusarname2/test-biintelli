import { JourneyController } from "./journey.controller.js";
import { Router,Response,Request } from "express";
import { validateUser } from "../domain/storage/journey.js";
import { limitGrt } from "../infrastructure/config/rateLimit.js";

export const journeyRoute:Router = Router();

/**
 * @swagger
 * /journey:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtiene y consulta los vuelos o las rutas para hacer un viaje.
 *     description: Obtiene y consulta los vuelos o las rutas para hacer un viaje, tiene un limite de 50000 consultas/hora.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Origin:
 *                 type: string
 *                 description: Aeropuerto de origen.
 *               Destination:
 *                 type: string
 *                 description: Aeropuerto de destino.
 *     responses:
 *       200:
 *         description: Precios de viaje obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID único del viaje.
 *                   Origin:
 *                     type: string
 *                     description: Aeropuerto de origen.
 *                   Destination:
 *                     type: string
 *                     description: Aeropuerto de destino.
 *                   price:
 *                     type: string
 *                     description: Precio del viaje.
 *       400:
 *         description: Datos de entrada inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Datos de entrada inválidos.
 *       500:
 *         description: Error interno del servidor al obtener precios de viaje.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Error al obtener precios de viaje.
 */

journeyRoute.post('/',limitGrt(),validateUser,async(req:Request|any,res:Response)=>{
    try {
      const resp = new JourneyController();
      res.send(await resp.GetController(req.body));
    } catch (e:any) {
        const errorMessage = e.message;
        const startIndex = errorMessage.indexOf('{');
        const endIndex = errorMessage.lastIndexOf('}');
        const jsonErrorString = errorMessage.substring(startIndex, endIndex + 1);
        const parsedError = JSON.parse(jsonErrorString);
        res.status(parsedError.status).json(parsedError)
    }
})