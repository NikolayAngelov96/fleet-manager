import { CarService } from "./data/CarService";
import { Collection } from "./data/Collection";
import { Car } from "./data/models";
import { LocalStorage } from "./data/Storage";
import { button, td, tr } from "./dom/dom";
import { Editor } from "./dom/Editor";
import { Table } from "./dom/Table";

const form = document.querySelector(".create-form") as HTMLFormElement;

const storage = new LocalStorage<Car>();
const collection = new Collection<Car>(storage, "cars");
const carService = new CarService(collection);

const table = document.querySelector(".overview") as HTMLTableElement;
const tableManager = new Table(table, createRow);

const editor = new Editor(form, onAddCar);

hydrate();

function createRow(car: Car): HTMLTableRowElement {
  let formattedBodyType =
    car.bodyType.charAt(0).toUpperCase() + car.bodyType.slice(1);
  let formattedTransmission =
    car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1);

  const row = tr(
    {},
    td({}, car.id),
    td({}, car.make),
    td({}, car.model),
    td({}, formattedBodyType),
    td({}, car.numberOfSeats.toString()),
    td({}, formattedTransmission),
    td({}, `$${car.rentalPrice}/day`),
    td(
      {},
      button({ className: "action edit" }, "Edit"),
      button({ className: "action delete" }, "Delete")
    )
  );

  row.id = car.id;

  return row;
}

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

  tableManager.addRow(car);

  editor.clear();
}

async function hydrate() {
  const cars = await carService.getAll();

  for (const car of cars) {
    tableManager.addRow(car);
  }
}
