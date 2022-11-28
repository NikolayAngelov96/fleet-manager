import { Collection } from "./data/Collection";
import { Truck } from "./data/models";
import { LocalStorage } from "./data/Storage";
import { TruckService } from "./data/TruckService";
import { button, td, tr } from "./dom/dom";
import { Editor } from "./dom/Editor";
import { Table } from "./dom/Table";

const storage = new LocalStorage<Truck>();
const collection = new Collection<Truck>(storage, "trucks");

const truckService = new TruckService(collection);

const createForm = document.querySelector(".create-form") as HTMLFormElement;
const tableBody = document.querySelector(
  ".overview tbody"
) as HTMLTableSectionElement;

const editor = new Editor(createForm, onAddTruck);

const tableManager = new Table(tableBody, createRow);

hydrate();

function createRow(truck: Truck) {
  const row = tr(
    {},
    td({}, truck.id),
    td({}, truck.make),
    td({}, truck.model),
    td({}, truck.cargoType),
    td({}, truck.capacity.toString()),
    td({}, `$${truck.rentalPrice}/day`),
    td(
      {},
      button({ className: "action edit" }, "Edit"),
      button({ className: "action delete" }, "Delete")
    )
  );

  row.id = truck.id;

  return row;
}

async function onAddTruck({
  make,
  model,
  cargoType,
  capacity,
  rentalPrice,
  rentedTo,
}: any) {
  rentalPrice = Number(rentalPrice);
  capacity = Number(capacity);

  if (Number.isNaN(rentalPrice)) {
    throw new TypeError("Rental price must be a number");
  }

  if (Number.isNaN(capacity)) {
    throw new TypeError("Capacity must be a number");
  }

  const truck = await truckService.create({
    make,
    model,
    cargoType,
    capacity,
    rentalPrice,
    rentedTo,
  });

  tableManager.addRow(truck);

  editor.clear();
}

async function hydrate() {
  const trucks = await truckService.getAll();

  for (const truck of trucks) {
    tableManager.addRow(truck);
  }
}
