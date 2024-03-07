import { prismaConnection } from "../database/connection.js";
import { data } from './data.js';
import axios from 'axios';
import fs from 'fs'
import path from 'path'

export class Operations {
    db:any;
    fetchLink:string;

    constructor() {
        this.db = prismaConnection;
        this.fetchLink = "https://bitecingcom.ipage.com/testapi/avanzado.js";
    }

    async createDataFile (arrayDeObjetos: any): Promise<void>{
    const dataArchive = "export const data: any =" + arrayDeObjetos;
    const NombreArchivo = 'data.ts';
    const nombreDirectorio = "app/Journey/infrastructure/repository";
    const rutaDirectorio = path.join(process.cwd(), nombreDirectorio);
    const rutaArchivo = path.join(rutaDirectorio, NombreArchivo);
    fs.mkdirSync(rutaDirectorio, { recursive: true });
    fs.writeFileSync(rutaArchivo, dataArchive);
    console.log('El archivo ha sido creado exitosamente!');
    }

    async ObtainInfo(info: any): Promise<any> {
        try {
            const viajes = await this.db.journey.findMany({
                where: {
                    OR: [
                        {
                            Origin: info.Destination,
                            Destination: info.Origin
                        },
                        {
                            Origin: info.Origin,
                            Destination: info.Destination,
                        }
                    ]
                }
            });
    
            if (viajes.length <= 0) {
                throw new Error('No se encontraron viajes');
            }
    
            console.log(viajes);
            return viajes;
        } catch (error) {
            const findFlight = await this.db.flight.findMany({
                where: {
                    OR: [
                        {
                            Origin: info.Destination,
                            Destination: info.Origin
                        },
                        {
                            Origin: info.Origin,
                            Destination: info.Destination,
                        }
                    ]
                }
            });
    
            if (findFlight.length >= 1) {
                const results = [];
                const journeyFlightData = [];
    
                for (let i = 0; i < findFlight.length; i++) {
                    const result = await this.db.journey.create({
                        data: {
                            Origin: findFlight[i].Origin,
                            Destination: findFlight[i].Destination,
                            price: findFlight[i].price,
                        }
                    });
    
                    results.push(result);
    
                    journeyFlightData.push({
                        flightId: findFlight[i].id,
                        journeyId: result.id,
                    });
                }
    
                await Promise.all(journeyFlightData.map(data => this.db.journey_Flight.create({ data })));
    
                // Esperar a que la llamada recursiva se complete antes de continuar
                return await this.ObtainInfo(info);
            } else {
                console.log(findFlight);
                const apiUrl = 'https://bitecingcom.ipage.com/testapi/avanzado.js';

                axios.get(apiUrl)
                .then(response => {
                    const arrayDeObjetos = response.data;
                    this.createDataFile(arrayDeObjetos);
                })
                .catch(error => {
                    console.error('Error al obtener los datos:', error);
                });
                
                const filteredFlights = data.filter((flight:any) =>
                    (flight.DepartureStation === "CUC" && flight.ArrivalStation === "STA") ||
                    (flight.DepartureStation === "STA" && flight.ArrivalStation === "CUC")
                );
                
                console.log(filteredFlights);

                

                return filteredFlights
            }
        }
    }    

    async CreateInfo(datas:object|any):Promise<void>{
        try {
            await this.db.journey.create({
            data: datas,
            });
            console.log('Created')
        } catch (error) {
            console.error("Exception Ocurred");
        }
    }
}


