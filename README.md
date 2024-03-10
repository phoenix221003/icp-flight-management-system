# icp-flight-management-system
This Canister provides functionalities for managing airline bookings, including flight listing, booking, cancellation, payment processing, and flight status checking. It is implemented using TypeScript and the Azle framework.

## Features
1. Flight Listing: View the list of available flights.
2. Flight Details: Get details of a specific flight by its ID.
3. Flight Booking: Book seats on a flight.
4. Booking Cancellation: Cancel a booking.
5. Payment Processing: Process payments for bookings.
6. Flight Status Checking: Check the status of a flight.
## Endpoints
1. GET /flights: Retrieve the list of available flights.
2. GET /flights/:id: Get details of a specific flight by ID.
3. POST /bookings: Book seats on a flight.
4. PUT /bookings/:id/cancel: Cancel a booking.
5. POST /payments: Process payments for bookings.
6. GET /flights/:id/status: Check the status of a flight.
## Usage
1. Clone the repository.
2. Install dependencies using ```npm install```.
3. Install dfx
4.  ``` DFX_VERSION=0.15.0 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"```
5.  ```dfx start --background```.


