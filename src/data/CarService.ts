import { DataService } from "./Service";
import { Car } from "./models";

type CarWhenCreated = Omit<Car, "id" | "rentedTo">;

export class CarService extends DataService<Car, CarWhenCreated> {
  protected parseRecord(data: Car): Car {
    data.rentalPrice = Number(data.rentalPrice);
    data.numberOfSeats = Number(data.numberOfSeats);

    const car = new Car(
      data.id,
      data.make,
      data.model,
      data.rentalPrice,
      data.rentedTo || null,
      data.bodyType,
      data.numberOfSeats,
      data.transmission
    );

    return car;
  }
  protected validate(data: CarWhenCreated): void {
    if (typeof data.make != "string") {
      throw new TypeError('Incompatible record. Invalid property "make"');
    }
    if (typeof data.model != "string") {
      throw new TypeError('Incompatible record. Invalid property "model"');
    }
    if (typeof data.rentalPrice != "number") {
      throw new TypeError(
        'Incompatible record. Invalid property "rentalPrice"'
      );
    }
    // if (typeof data.rentedTo != "string" && data.rentedTo != null) {
    //   throw new TypeError('Incompatible record. Invalid property "rentedTo"');
    // }
    if (typeof data.bodyType != "string") {
      throw new TypeError('Incompatible record. Invalid property "bodyType"');
    }
    if (typeof data.numberOfSeats != "number") {
      throw new TypeError(
        'Incompatible record. Invalid property "numberOfSeats"'
      );
    }
    if (typeof data.transmission != "string") {
      throw new TypeError(
        'Incompatible record. Invalid property "transmission"'
      );
    }
  }
}
