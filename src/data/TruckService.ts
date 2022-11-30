import { Truck } from "./models";
import { DataService } from "./Service";

export type SubmitTruckData = Omit<Truck, "id" | "rentedTo">;

export class TruckService extends DataService<Truck, SubmitTruckData> {
  protected parseRecord(data: Truck): Truck {
    data.rentalPrice = Number(data.rentalPrice);
    data.capacity = Number(data.capacity);

    const truck = new Truck(
      data.id,
      data.make,
      data.model,
      data.rentalPrice,
      data.rentedTo || null,
      data.cargoType,
      data.capacity
    );

    return truck;
  }
  protected validate(data: SubmitTruckData): void {
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
    if (typeof data.cargoType != "string") {
      throw new TypeError('Incompatible record. Invalid property "cargoType"');
    }
    if (typeof data.capacity != "number") {
      throw new TypeError('Incompatible record. Invalid property "capacity"');
    }
  }
}
