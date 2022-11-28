import { DataService } from "./Service";
import { Car } from "./models";

type CarWithoutId = Omit<Car, "id">;

export class CarService extends DataService<Car, CarWithoutId> {
  protected parseRecord({
    id,
    make,
    model,
    rentalPrice,
    rentedTo,
    bodyType,
    numberOfSeats,
    transmission,
  }: Car): Car {
    rentalPrice = Number(rentalPrice);
    numberOfSeats = Number(numberOfSeats);

    const car = new Car(
      id,
      make,
      model,
      rentalPrice,
      // possibly null
      rentedTo,
      bodyType,
      numberOfSeats,
      transmission
    );

    return car;
  }
  protected validate(data: CarWithoutId): void {
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
    if (typeof data.rentedTo != "string" || data.rentedTo != null) {
      throw new TypeError('Incompatible record. Invalid property "rentedTo"');
    }
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
