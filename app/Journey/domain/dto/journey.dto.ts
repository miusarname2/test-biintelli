import { Expose,Type,Transform } from "class-transformer";
import { IsDefined,IsString } from "class-validator";

export class Journey {
    @Expose({name : "Origin"})
    @IsString()
    @IsDefined({
        message: () => {
          throw {
            status: 422,
            message: "El parametro es obligatorio -> Origin",
          };
        },
    })
    Origins: string;

    @Expose({name : "Destination"})
    @IsString()
    @IsDefined({
        message: () => {
          throw {
            status: 422,
            message: "El parametro es obligatorio -> Origin",
          };
        },
    })
    Destiny: string;

    constructor(Origin:string,Destination:string) {
        this.Origins= Origin;
        this.Destiny= Destination;
    }
}