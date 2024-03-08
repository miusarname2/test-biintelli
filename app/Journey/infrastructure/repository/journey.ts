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

    async ObtainInfos(info:object | any ): Promise<any> {
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
    }

    async SearchFlights(info:object | any) : Promise<any>{
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

        return findFlight
    }

    async createJourneysWithTheirFlights(findFlight:Array<object | any>,info:object | any){
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
        return await Promise.all(journeyFlightData.map(data => this.db.journey_Flight.create({ data })))? true : false;
    }

    async consultExternalDataAndFilter(info:object | any):Promise<any>{
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
                    (flight.DepartureStation === info.Origin && flight.ArrivalStation === info.Destination) ||
                    (flight.DepartureStation === info.Destination && flight.ArrivalStation === info.Origin)
                );
                return await filteredFlights;
    }

    async createDataBasedOnExternalInformation(filteredFlights : Array<object|any>):Promise<any>{
        const transportResults = [];
                const flightResults = [];
                const journeyResults = [];

                if (filteredFlights.length >=1) {
                    let i = 0;
                    do {
                        const transportResult = await this.db.transport.create({
                            data: {
                                FlightCarrier: filteredFlights[i].FlightCarrier,
                                FlightNumber: filteredFlights[i].FlightNumber
                            }
                        });
                        transportResults.push(transportResult);

                        const flightResult = await this.db.flight.create({
                            data: {
                                Destination: filteredFlights[i].ArrivalStation,
                                Origin: filteredFlights[i].DepartureStation,
                                price: filteredFlights[i].Price,
                                transportId: transportResult.id
                            }
                        });
                        flightResults.push(flightResult);

                        const journeyResult = await this.db.journey.create({
                            data: {
                                Origin: filteredFlights[i].DepartureStation,
                                Destination: filteredFlights[i].ArrivalStation,
                                price: filteredFlights[i].Price
                            }
                        });
                        journeyResults.push(journeyResult);

                        const journeyFlightResult = await this.db.journey_Flight.create({
                            data: {
                                flightId: flightResult.id,
                                journeyId: journeyResult.id
                            }
                        });

                        i++;
                    } while (i < filteredFlights.length);

                    return [transportResults,flightResults,journeyResults]
                }

    }
}


