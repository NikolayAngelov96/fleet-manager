export abstract class Vehicle {
  constructor(
    public id: string,
    public make: string,
    public model: string,
    public rentalPrice: number,
    public rentedTo: string | null
  ) {}
}

export type CarBodyType = "sedan" | "suv" | "hatchback";

export type Transmissions = "manual" | "automatic";

export class Car extends Vehicle {
  constructor(
    id: string,
    make: string,
    model: string,
    rentalPrice: number,
    rentedTo: string | null,
    public bodyType: CarBodyType,
    public numberOfSeats: number,
    public transmission: Transmissions
  ) {
    super(id, make, model, rentalPrice, rentedTo);
  }
}

type TruckCargoType = "box" | "flatbed" | "van";

export class Truck extends Vehicle {
  constructor(
    id: string,
    make: string,
    model: string,
    rentalPrice: number,
    rentedTo: string | null,
    public cargoType: TruckCargoType,
    public capacity: number
  ) {
    super(id, make, model, rentalPrice, rentedTo);
  }
}
