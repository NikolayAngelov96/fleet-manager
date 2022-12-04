import bottle from "./data/container";
import { Truck } from "./data/models";
import { TruckService, SubmitTruckData } from "./data/TruckService";
import { button, td, tr } from "./dom/dom";
import { Editor } from "./dom/Editor";
import { Table } from "./dom/Table";
import { toast } from "./dom/Toaster";

const newTruckSection = document.querySelector(".editor-new") as HTMLElement;
const editTruckSection = document.querySelector(".editor-edit") as HTMLElement;

const addBtn = document.querySelector(".action.new") as HTMLButtonElement;

addBtn.addEventListener("click", () => {
  (newTruckSection.style.display = "block"),
    (editTruckSection.style.display = "none");
});

const truckService = bottle.container.TruckService as TruckService;

const createForm = document.querySelector(".create-form") as HTMLFormElement;
const tableBody = document.querySelector(
  ".overview tbody"
) as HTMLTableSectionElement;

const editor = new Editor(createForm, onAddTruck);

const tableManager = new Table(tableBody, createRow);

hydrate();

createForm.querySelector(".cancel").addEventListener("click", (e) => {
  e.preventDefault();
  editor.clear();
  newTruckSection.style.display = "none";
});

tableBody.addEventListener("click", onButtonsClick);

async function onButtonsClick(e: MouseEvent) {
  if (e.target instanceof HTMLButtonElement) {
    const row = e.target.parentElement.parentElement as HTMLTableRowElement;
    if (e.target.classList.contains("edit")) {
      editTruckSection.style.display = "block";
      newTruckSection.style.display = "none";

      const editForm = document.querySelector(".edit-form") as HTMLFormElement;
      const editFormController = new Editor(editForm, handleEdit);
      editForm.querySelector(".cancel").addEventListener("click", (e) => {
        e.preventDefault();
        editFormController.clear();
        editTruckSection.style.display = "none";
      });

      const truck = await truckService.getById(row.id);

      const fields: SubmitTruckData = {
        make: truck.make,
        model: truck.model,
        cargoType: truck.cargoType,
        capacity: truck.capacity,
        rentalPrice: truck.rentalPrice,
      };

      editFormController.setValues(fields);

      // Same for trucks and cars
      // When you tried to edit for second time(without refresh of page)
      // the same record it saves the data correct but then triggers the event lister on empty field and rewrite the data
      // I added check in TruckService.ts data.make == "" throw Error and it fixed the problem but throws the error on the console

      async function handleEdit(data: SubmitTruckData) {
        const record = {
          make: data.make,
          model: data.model,
          cargoType: data.cargoType,
          capacity: Number(data.capacity),
          rentalPrice: Number(data.rentalPrice),
          rentedTo: truck.rentedTo,
        };

        try {
          const edditedTruck = await truckService.update(row.id, record);

          tableManager.updateRow(edditedTruck.id, edditedTruck);

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
      if (confirm("Are you sure you want to delete this truck")) {
        try {
          await truckService.delete(row.id);
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

function createRow(truck: Truck) {
  const formatedCapacity = `${truck.capacity / 1000} tons`;
  const row = tr(
    {},
    td({}, truck.id),
    td({}, truck.make),
    td({}, truck.model),
    td({}, truck.cargoType),
    td({}, formatedCapacity),
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
}: any) {
  rentalPrice = Number(rentalPrice);
  capacity = Number(capacity);

  try {
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
    });

    tableManager.addRow(truck);

    editor.clear();

    toast.success(`Successfully added ${truck.make} ${truck.model}`);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }
}

async function hydrate() {
  const trucks = await truckService.getAll();

  for (const truck of trucks) {
    tableManager.addRow(truck);
  }
}
