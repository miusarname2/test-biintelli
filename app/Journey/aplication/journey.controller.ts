import { Operations } from "../infrastructure/repository/journey.js";

export class JourneyController{

    dbInteractions : Operations = new Operations();

    async GetController(data:any):Promise<any>{
        try {
            const dbInfo = await this.dbInteractions.ObtainInfos(data);
            return await dbInfo;
        } catch (error) {
            const flights = await this.dbInteractions.SearchFlights(data)
            if (flights.length >=1) {
                const passed = await this.dbInteractions.createJourneysWithTheirFlights(flights,data)? console.log('passed') : console.error('bad');
                return await this.GetController(data);
            }
            const resultConsultExternalAPI = await this.dbInteractions.consultExternalDataAndFilter(data);

            if (await resultConsultExternalAPI.length >=1) {
                const createInforByExternaAPIRes = await this.dbInteractions.createDataBasedOnExternalInformation(resultConsultExternalAPI);
                console.log(createInforByExternaAPIRes)
                const deleted = await this.dbInteractions.deleteDataOfTheFile();
                return await this.GetController(data);
            }
            await this.dbInteractions.deleteDataOfTheFile();
            throw new Error(JSON.stringify({status: 404, message: "Not found route"}));
        }
    }
}