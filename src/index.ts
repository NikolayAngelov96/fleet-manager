import { CarService } from "./data/CarService";
import bottle from "./data/container";
import { Car, Truck, Vehicle } from "./data/models";
import { TruckService } from "./data/TruckService";
import { a, td, tr } from "./dom/dom";
import { Loader } from "./dom/Loader";
import { Table } from "./dom/Table";
import { toast } from "./dom/Toaster";
import { getSearchParams, SearchParams } from "./utils";

const carService = bottle.container.CarService as CarService;

const truckService = bottle.container.TruckService as TruckService;
const loader = bottle.container.Loader as Loader;

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

  loader.show(tableBody);

  try {
    const cars = await carService.getAll();
    const trucks = await truckService.getAll();

    const vehicles: Vehicle[] = [].concat(trucks).concat(cars);

    const filteredVehicles = filterBySearchParams(searchParams, vehicles);

    filteredVehicles.sort((a, b) => a.make.localeCompare(b.make));

    loader.hide();
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
