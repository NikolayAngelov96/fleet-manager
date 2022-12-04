import { CarService, SubmitCarData } from "./data/CarService";
import { Collection } from "./data/Collection";
import { Car } from "./data/models";
import { RemoteStorage } from "./data/RemoteStorage";
import { LocalStorage } from "./data/Storage";
import { button, td, tr } from "./dom/dom";
import { Editor } from "./dom/Editor";
import { Table } from "./dom/Table";
import { toast } from "./dom/Toaster";

import bottle from "./data/container";

const newCarSection = document.querySelector(".editor-new") as HTMLElement;
const editCarSection = document.querySelector(".editor-edit") as HTMLElement;

const form = document.querySelector(".create-form") as HTMLFormElement;

const addBtn = document.querySelector(".action.new") as HTMLButtonElement;

addBtn.addEventListener("click", () => {
  newCarSection.style.display = "block";
  editCarSection.style.display = "none";
});

// TODO:
//      validate that numbered values are not below zero

const carService = bottle.container.CarService as CarService;

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
        const record = {
          make: data.make,
          model: data.model,
          bodyType: data.bodyType,
          numberOfSeats: Number(data.numberOfSeats),
          transmission: data.transmission,
          rentalPrice: Number(data.rentalPrice),
          rentedTo: car.rentedTo,
        };

        try {
          const edittedCar = await carService.update(row.id, record);
          console.log(edittedCar);

          tableManager.updateRow(edittedCar.id, edittedCar);

          editFormController.clear();

          toast.success(`Successfully edited ${record.make} ${record.model}`);
        } catch (error) {
          console.error(error);
          if (error instanceof Error) {
            toast.error(error.message);
          }
        }
      }
    } else if (e.target.classList.contains("delete")) {
      if (confirm("Are you sure you want to delete this car?")) {
        try {
          await carService.delete(row.id);
          row.remove();
          toast.success("Successfully deleted");
        } catch (error) {
          console.error(error);
          if (error instanceof Error) {
            toast.error(error.message);
          }
        }
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

  try {
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

    toast.success(`Successfully added ${car.make} ${car.model}`);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }
}

async function hydrate() {
  const cars = await carService.getAll();

  for (const car of cars) {
    tableManager.addRow(car);
  }
}
