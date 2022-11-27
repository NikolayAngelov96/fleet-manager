import { Truck } from "./models";
import { DataService } from "./Service";

export class TruckService extends DataService<Truck, Omit<Truck, "id">> {
  protected parseRecord(record: { id: string }): Truck {
    const data = record as any;
    const truck = new Truck(
      data.id,
      data.make,
      data.model,
      data.rentalPrice,
      data.rentedTo,
      data.cargoType,
      data.capacity
    );

    return truck;
  }
  protected validate(data: any): void {
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
    if (typeof data.cargoType != "string") {
      throw new TypeError('Incompatible record. Invalid property "cargoType"');
    }
    if (typeof data.capacity != "number") {
      throw new TypeError('Incompatible record. Invalid property "capacity"');
    }
  }
}
