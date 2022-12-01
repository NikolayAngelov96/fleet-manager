import { CarService } from "./data/CarService";
import { Collection } from "./data/Collection";
import { Car, Truck, Vehicle } from "./data/models";
import { LocalStorage } from "./data/Storage";
import { TruckService } from "./data/TruckService";
import { p, span, strong } from "./dom/dom";
import { capitalizeWord, getSearchParams } from "./utils";

const storage = new LocalStorage<Car>();
const collection = new Collection<Car>(storage, "cars");

const carService = new CarService(collection);

const truckStorage = new LocalStorage<Truck>();
const truckCollection = new Collection<Truck>(truckStorage, "trucks");

const truckService = new TruckService(truckCollection);

const detailsContainer = document.querySelector(".details");

hydrate();

async function hydrate() {
  const query = getSearchParams<{ id: string }>(window.location.search);
  const vehicleTitle = document.getElementById("vehicle-make");
  const statusElement = document.getElementById("status");

  const vehicle = await getVehicle(query.id);

  const status = vehicle.rentedTo == null ? "Available" : "Rented";

  let elements: HTMLElement[];
  if (vehicle instanceof Car) {
    elements = createCarDetails(vehicle);
  } else if (vehicle instanceof Truck) {
    elements = createTruckDetails(vehicle);
  }

  vehicleTitle.textContent = `${vehicle.make} ${vehicle.model}`;
  statusElement.textContent = status;
  detailsContainer.replaceChildren(...elements);
}

function createCarDetails(car: Car) {
  const formatedType = capitalizeWord(car.bodyType);
  const formatedTransmission = capitalizeWord(car.transmission);

  const id = p({}, span({ className: "col" }, "ID:"), strong({}, car.id));
  const type = p(
    {},
    span({ className: "col" }, "Body type:"),
    strong({}, formatedType)
  );
  const seats = p(
    {},
    span({ className: "col" }, "Seats:"),
    strong({}, car.numberOfSeats.toString())
  );
  const transmission = p(
    {},
    span({ className: "col" }, "Transmission:"),
    strong({}, formatedTransmission)
  );
  const rentalPrice = p(
    {},
    span({ className: "col" }, "Rental price:"),
    strong({}, car.rentalPrice.toString())
  );

  return [id, type, seats, transmission, rentalPrice];
}

function createTruckDetails(truck: Truck) {
  const formatedType = capitalizeWord(truck.cargoType);
  const id = p({}, span({ className: "col" }, "ID:"), strong({}, truck.id));
  const type = p(
    {},
    span({ className: "col" }, "Cargo type:"),
    strong({}, formatedType)
  );
  const seats = p(
    {},
    span({ className: "col" }, "Capacity:"),
    strong({}, truck.capacity.toString())
  );
  const rentalPrice = p(
    {},
    span({ className: "col" }, "Rental price:"),
    strong({}, truck.rentalPrice.toString())
  );

  return [id, type, seats, rentalPrice];
}

async function getVehicle(id: string) {
  const cars = await carService.getAll();
  const trucks = await truckService.getAll();

  const vehicles: Vehicle[] = [].concat(trucks).concat(cars);

  const vehicle = vehicles.find((x) => x.id == id);

  return vehicle;
}
