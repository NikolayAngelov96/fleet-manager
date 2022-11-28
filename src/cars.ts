import { CarService } from "./data/CarService";
import { Collection } from "./data/Collection";
import { Car } from "./data/models";
import { LocalStorage } from "./data/Storage";
import { Editor } from "./dom/Editor";

const form = document.querySelector(".create-form") as HTMLFormElement;

const storage = new LocalStorage<Car>();
const collection = new Collection<Car>(storage, "cars");
const carService = new CarService(collection);

const editor = new Editor(form, onAddCar);

async function onAddCar({
  make,
  model,
  rentalPrice,
  bodyType,
  numberOfSeats,
  rentedTo,
  transmission,
}: any) {
  rentalPrice = Number(rentalPrice);
  numberOfSeats = Number(numberOfSeats);

  if (Number.isNaN(rentalPrice)) {
    throw new TypeError("Rental price must be a number");
  }

  if (Number.isNaN(numberOfSeats)) {
    throw new TypeError("Number of seats must be a number");
  }

  const car = await carService.create({
    make,
    model,
    rentalPrice,
    bodyType,
    numberOfSeats,
    rentedTo,
    transmission,
  });

  console.log(car);

  editor.clear();
}
