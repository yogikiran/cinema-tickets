## Cinema tickets booking 

This is a JavaScript cinema ticket purchase service that performs the required operations as specified in the assignment.

The following files have been modified:

- `cinema-tickets-javascript/src/pairtest/TicketService.js`: This file has been updated to handle validation and process ticket purchase requests.
- `cinema-tickets-javascript/test/TicketService.test.js`: This file contains the Jest test suite, which includes unit tests for all the functionalities.

The objective is achieved by following these steps:

1. Validations:

   - The first step is to validate the account ID of the user. If the account ID is an integer greater than zero, it is considered valid otherwise it is considered invalid.

   - A ticket purchase request can only be made by an adult. This means that at least one adult ticket should be included in the purchase request. Therefore, the purchase request is validated to ensure that at least one adult ticket is included.

   - The next step is to check for a valid ticket count. Only non-negative integers greater than or equal to zero can be provided for each ticket type. Additionally, the maximum number of tickets that can be bought per purchase request is 20. Therefore, a validation check is performed to ensure that the number of tickets requested does not exceed 20.

   - Exceptions are thrown for any of the invalid purchase ticket request cases mentioned above. The `InvalidPurchaseException` is thrown with an appropriate error message for each case.

2. Service Calls:

   - If the purchase request is valid after passing the above validations, the total amount to be paid for the requested tickets is calculated. The `TicketPaymentService` is then called with the account ID and the total amount to be paid.

   - After the payment service is called, the seats are reserved by invoking the `SeatReservationService` with the account ID and the total number of seats to allocate. The total number of seats required for the purchase is calculated.

### Execution 
Follow the steps below, to execute the program:

1. Install the latest version of Node.js from the following link: [Node.js Download](https://nodejs.org/en/download/)

2. Clone the repository using the following link: [GitHub Repository](https://github.com/yogikiran/cinema-tickets.git)

3. Navigate to the `/cinema-tickets-javascript` directory and run `npm install` to download the necessary packages.

4. Once the packages are downloaded, go to `/cinema-tickets-javascript/src/pairtest` directory and execute `node ./TicketService.js` to run the TicketService.

5. To execute the test suite, run `npm test`.