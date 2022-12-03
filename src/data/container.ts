import Bottle from "bottlejs";
import { CarService } from "./CarService";
import { Collection } from "./Collection";
import { Car, Truck } from "./models";
import { LocalStorage } from "./Storage";
import { TruckService } from "./TruckService";

const bottle = new Bottle();

bottle.service("Collection", Collection);
bottle.service("LocalStorage", LocalStorage);

bottle.factory("CarService", function (container) {
  const storage = container.LocalStorage;
  const collection = new Collection<Car>(storage, "cars");

  return new CarService(collection);
});

bottle.factory("TruckService", function (container) {
  const storage = container.LocalStorage;
  const collection = new Collection<Truck>(storage, "trucks");

  return new TruckService(collection);
});

export default bottle;
