import Bottle from "bottlejs";
import { CarService } from "./CarService";
import { Collection } from "./Collection";
import { Car, Truck } from "./models";
import { RemoteStorage } from "./RemoteStorage";
import { LocalStorage } from "./Storage";
import { TruckService } from "./TruckService";

const bottle = new Bottle();

bottle.service("Collection", Collection);
bottle.service("LocalStorage", LocalStorage);
bottle.service("RemoteStorage", RemoteStorage);

bottle.factory("CarService", function (container) {
  const storage = container.RemoteStorage;
  const collection = new Collection<Car>(storage, "/Cars");

  return new CarService(collection);
});

bottle.factory("TruckService", function (container) {
  const storage = container.RemoteStorage;
  const collection = new Collection<Truck>(storage, "/Trucks");

  return new TruckService(collection);
});

export default bottle;
