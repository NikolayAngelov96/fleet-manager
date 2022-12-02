import { CarService } from "./data/CarService";
import { Collection } from "./data/Collection";
import { Car, Truck, Vehicle } from "./data/models";
import { LocalStorage } from "./data/Storage";
import { TruckService } from "./data/TruckService";
import { a, td, tr } from "./dom/dom";
import { Table } from "./dom/Table";
import { toast } from "./dom/Toaster";
import { getSearchParams, SearchParams } from "./utils";

// TODO: add truck service
const storage = new LocalStorage<Car>();
const collection = new Collection<Car>(storage, "cars");

const carService = new CarService(collection);

const truckStorage = new LocalStorage<Truck>();
const truckCollection = new Collection<Truck>(truckStorage, "trucks");

const truckService = new TruckService(truckCollection);

const tableBody = document.querySelector(
  ".overview tbody"
) as HTMLTableSectionElement;

const tableManager = new Table(tableBody, createRow);

hydrate();

function createRow(vehicle: Vehicle): HTMLTableRowElement {
  const status = vehicle.rentedTo == null ? "Available" : "Rented";

  const row = tr(
    {},
    td({}, vehicle.id),
    td({}, vehicle.constructor.name),
    td({}, vehicle.make),
    td({}, vehicle.model),
    td({}, `$${vehicle.rentalPrice}/day`),
    td({}, status),
    td(
      {},
      a(
        { className: "details-link", href: `/details.html?id=${vehicle.id}` },
        "Show Details"
      )
    )
  );

  row.id = vehicle.id;

  return row;
}

async function hydrate() {
  const searchParams = getSearchParams<{
    type?: string;
    availableOnly?: string;
  }>(window.location.search);

  setUpFormValues(searchParams);

  try {
    const cars = await carService.getAll();
    const trucks = await truckService.getAll();

    const vehicles: Vehicle[] = [].concat(trucks).concat(cars);

    const filteredVehicles = filterBySearchParams(searchParams, vehicles);

    filteredVehicles.sort((a, b) => a.make.localeCompare(b.make));

    for (const vehicle of filteredVehicles) {
      tableManager.addRow(vehicle);
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }
}

function setUpFormValues(values: SearchParams) {
  for (const key in values) {
    const element = document.querySelector(`[name="${key}"]`);

    if (element instanceof HTMLSelectElement) {
      element.value = values[key];
    } else if (element instanceof HTMLInputElement) {
      if (element.type == "checkbox") {
        element.checked = values[key] == "on" ? true : false;
      }
    }
  }
}

function filterBySearchParams(
  searchParams: SearchParams,
  collection: Vehicle[]
) {
  if ("type" in searchParams) {
    if (searchParams.type == "cars") {
      collection = collection.filter((x) => x instanceof Car);
    } else if (searchParams.type == "trucks") {
      collection = collection.filter((x) => x instanceof Truck);
    }
  }
  if ("availableOnly" in searchParams) {
    if (searchParams.availableOnly == "on") {
      collection = collection.filter((x) => x.rentedTo == null);
    }
  }

  return collection;
}
