import { CarService, SubmitCarData } from "./data/CarService";
import { Collection } from "./data/Collection";
import { Car } from "./data/models";
import { LocalStorage } from "./data/Storage";
import { button, td, tr } from "./dom/dom";
import { Editor } from "./dom/Editor";
import { Table } from "./dom/Table";

const newCarSection = document.querySelector(".editor-new") as HTMLElement;
const editCarSection = document.querySelector(".editor-edit") as HTMLElement;

const form = document.querySelector(".create-form") as HTMLFormElement;

const addBtn = document.querySelector(".action.new") as HTMLButtonElement;

addBtn.addEventListener("click", () => {
  newCarSection.style.display = "block";
  editCarSection.style.display = "none";
});

// TODO:
//      validate that onSubmit there are no empty fields
//      validate that numbered values are not below zero
//      try catch all request and toast message on error

const storage = new LocalStorage<Car>();
const collection = new Collection<Car>(storage, "cars");
const carService = new CarService(collection);

const tableBody = document.querySelector(
  ".overview tbody"
) as HTMLTableSectionElement;

const tableManager = new Table(tableBody, createRow);

const editor = new Editor(form, onAddCar);

hydrate();

tableBody.addEventListener("click", onButtonsClick);

form.querySelector(".cancel").addEventListener("click", (e) => {
  e.preventDefault();
  editor.clear();
  newCarSection.style.display = "none";
});

// find event type for click
async function onButtonsClick(e: MouseEvent) {
  if (e.target instanceof HTMLButtonElement) {
    const row = e.target.parentElement.parentElement as HTMLTableRowElement;
    if (e.target.classList.contains("edit")) {
      editCarSection.style.display = "block";
      newCarSection.style.display = "none";

      const editForm = document.querySelector(".edit-form") as HTMLFormElement;
      const editFormController = new Editor(editForm, handleEdit);

      editForm.querySelector(".cancel").addEventListener("click", (e) => {
        e.preventDefault();
        editFormController.clear();
        editCarSection.style.display = "none";
      });

      const car = await carService.getById(row.id);

      const fields: SubmitCarData = {
        make: car.make,
        model: car.model,
        bodyType: car.bodyType,
        numberOfSeats: car.numberOfSeats,
        transmission: car.transmission,
        rentalPrice: car.rentalPrice,
      };

      editFormController.setValues(fields);

      async function handleEdit(data: SubmitCarData) {
        const record: SubmitCarData = {
          make: data.make,
          model: data.model,
          bodyType: data.bodyType,
          numberOfSeats: Number(data.numberOfSeats),
          transmission: data.transmission,
          rentalPrice: Number(data.rentalPrice),
        };

        const edittedCar = await carService.update(row.id, record);

        tableManager.updateRow(edittedCar.id, edittedCar);

        editFormController.clear();
      }
    } else if (e.target.classList.contains("delete")) {
      if (confirm("Are you sure you want to delete this car?")) {
        await carService.delete(row.id);
        row.remove();
      }
    }
  }
}

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
