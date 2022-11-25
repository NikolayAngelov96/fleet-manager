# Fleet Manager Workshop Assignment

## Overview

Use the provided HTML and CSS examples to implement a browser application for managing the fleet of a vehicle rental company. The company rents out passenger cars and cargo trucks. The user interface must provide and overview of all registered vehicles. In addition, each vehicle type has a dedicated browser with the option to create a new vehicle of the type and edit or delete an existing vehicle. When viewing the details for a vehicle, options are presented to rent it to a person, or to mark the rent contract as completed.

Use TypeScript for the project. Apply a level of abstraction that would allow easy maintenance of the code in the future.


## Specification

### General
You are allowed to change the example HTML in any way, that will make the assignment easier to execute, such as adding or changing element classes, names and id's, modifying option values, etc.

### Data

1. Create abstract model `Vehicle` with properties:
- `id`: string
- `make`: string
- `model`: string
- `rentalPrice`: number
- `rentedTo`: string or null

2. Create models `Car` and `Truck` as extensions of `Vehicle`, with additional properties
- For `Car`:
  - `bodyType`: one of **sedan**, **suv** or **hatchback**
  - `numberOfSeats`: number
  - `transmission`: one of **manual** or **automatic**

- For `Truck`:
  - `cargoType`: one of **box**, **flatbed** or **van**
  - `capacity`: number

3. Create services that allow CRUD operations for the aforelisted concrete models
- Use the browser's **Local Storage API** to persist the application's data
- Design the services in such a way as to allow changing the storage method, without strongly affecting the rest of the application
- Consider the possibility that a new type of vehicle might be added to the fleet in the future

### Editors UI

1. Implement functionality that allows vehicles of type `Car` to be managed
- Create new reacords via and HTML form
  - Form should only be available when the **Add Car** button is clicked
  - The button should only be available when the form is not present
  - Canceling makes the form unavailable
  - Only on of the two forms should be available at a time
- List stored records
- Select existing record for editing
  - Form should only be available when the **Edit** button for a record is clicked
  - Canceling makes the form unavailable
  - Only on of the two forms should be available at a time
- Save changes to edited record
- Delete existing record

2. Implement functionality that allows vehicles of type `Truck` to be managed
- Create new reacords via and HTML form
  - Form should only be available when the **Add Truck** button is clicked
  - The button should only be available when the form is not present
  - Canceling makes the form unavailable
  - Only on of the two forms should be available at a time
- List stored records
- Select existing record for editing
  - Form should only be available when the **Edit** button for a record is clicked
  - Canceling makes the form unavailable
  - Only on of the two forms should be available at a time
- Save changes to edited record
- Delete existing record

3. Bonus
- Extract the shared functionality of the two pages in a base vehicle browser/editor 
- Consider the possiblity that a new vehicle type might be added to the fleet in the future
- Make it as easy as possible for new editor pages to be created

### Overview UI

1. List all stored vehicles
- Include a link to the details for each vehicle
- Use the query string section of the URL to specify which vehicle is selected

2. Implement filtering
- Filter only vehicles of certain type
- Filter only available vehicles

### Details UI

1. Display details about the selected vehicle
- Use `window.location.search` to determine which vehicle to load

2. Implement renting functionality
- If a vehicle is available (`rentedTo` not assigned) show the form for entering rental information
- If a vehicle is taken, display the name of the holder and a button **End contract** to release it

## Assessment

The assignment completion will be assessed based on the following criteria:

- Usage of Git version control
  - Descriptive commit messages
  - Commits balanced across type
  - Isolated changes in each commit
- Functionality
  - Create new vehicle
  - List vehicles
  - Edit existing vehicle
  - Delete existing vehicle
  - Rent out selected vehicle
  - Overview of vehicles
- Code quality
  - Strongly typed
  - Adherence to conventions
  - SOLID principles observed
  - Interface and class structure which allow easier maintenance