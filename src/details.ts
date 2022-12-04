import { CarService } from "./data/CarService";
import bottle from "./data/container";
import { Car, Truck, Vehicle } from "./data/models";
import { TruckService } from "./data/TruckService";
import { p, span, strong } from "./dom/dom";
import { Editor } from "./dom/Editor";
import { toast } from "./dom/Toaster";
import { capitalizeWord, getSearchParams } from "./utils";

const carService = bottle.container.CarService as CarService;
const truckService = bottle.container.TruckService as TruckService;

const detailsContainer = document.querySelector(".details");

const form = document.querySelector("form");

const statusElement = document.getElementById("status");
const rentedName = document.getElementById("rented-name");

const rentalDiv = document.querySelector(".rental") as HTMLDivElement;

const query = getSearchParams<{ id: string }>(window.location.search);

const editor = new Editor(form, onSubmit);

const cancelContrachBtn = document.querySelector(
  ".release"
) as HTMLButtonElement;

cancelContrachBtn.addEventListener("click", onCancelContract);

async function onCancelContract(e: MouseEvent) {
  try {
    const vehicle = await getVehicle(query.id);

    vehicle.rentedTo = null;

    if (vehicle instanceof Car) {
      await carService.update(vehicle.id, vehicle);
    } else if (vehicle instanceof Truck) {
      await truckService.update(vehicle.id, vehicle);
    }

    rentedName.parentElement.style.display = "none";
    editor.attachTo(rentalDiv);
    statusElement.textContent = "Available";

    toast.success(`Vehicle was successfully returned`);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }
}

async function onSubmit(person: { name: string }) {
  try {
    const vehicle = await getVehicle(query.id);

    vehicle.rentedTo = person.name;

    if (vehicle instanceof Car) {
      await carService.update(vehicle.id, vehicle);
    } else if (vehicle instanceof Truck) {
      await truckService.update(vehicle.id, vehicle);
    }

    rentedName.textContent = vehicle.rentedTo;
    rentedName.parentElement.style.display = "block";
    statusElement.textContent = "Rented";

    editor.clear();
    editor.remove();

    toast.success(
      `Successfully rented ${vehicle.make} ${vehicle.model} to ${person.name}`
    );
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }
}

hydrate();

async function hydrate() {
  const vehicleTitle = document.getElementById("vehicle-make");

  const vehicle = await getVehicle(query.id);

  const status = vehicle.rentedTo == null ? "Available" : "Rented";

  if (vehicle.rentedTo != null) {
    editor.remove();
    rentedName.parentElement.style.display = "block";
  } else {
    rentedName.parentElement.style.display = "none";
  }

  let elements: HTMLElement[];
  if (vehicle instanceof Car) {
    elements = createCarDetails(vehicle);
  } else if (vehicle instanceof Truck) {
    elements = createTruckDetails(vehicle);
  }

  vehicleTitle.textContent = `${vehicle.make} ${vehicle.model}`;
  statusElement.textContent = status;
  rentedName.textContent = vehicle.rentedTo;
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
    strong({}, `$${car.rentalPrice}/day`)
  );

  return [id, type, seats, transmission, rentalPrice];
}

function createTruckDetails(truck: Truck) {
  const formatedType = capitalizeWord(truck.cargoType);
  const formatedCapacity = `${truck.capacity / 1000} tons`;

  const id = p({}, span({ className: "col" }, "ID:"), strong({}, truck.id));
  const type = p(
    {},
    span({ className: "col" }, "Cargo type:"),
    strong({}, formatedType)
  );
  const seats = p(
    {},
    span({ className: "col" }, "Capacity:"),
    strong({}, formatedCapacity)
  );
  const rentalPrice = p(
    {},
    span({ className: "col" }, "Rental price:"),
    strong({}, `$${truck.rentalPrice}/day`)
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
