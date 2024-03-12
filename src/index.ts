import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Server, StableBTreeMap, ic } from 'azle';

// Record types
type Flight = {
  id: string;
  airline: string;
  destination: string;
  departureTime: Date;
  arrivalTime: Date;
  capacity: number;
  bookedSeats: number;
};

type Booking = {
  id: string;
  flightId: string;
  userId: string;
  seats: number;
  totalPrice: number;
};

type Payment = {
  id: string;
  bookingId: string;
  amount: number;
  timestamp: Date;
};

// Data storage
const flightsStorage = StableBTreeMap<string, Flight>(0);
const bookingsStorage = StableBTreeMap<string, Booking>(0);
const paymentsStorage = StableBTreeMap<string, Payment>(0);

// Initialize Express app
const app = express();
app.use(express.json());

// Middleware for error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// CRUD operations for flights
// Implement similar operations for bookings and payments

// Get all flights
app.get('/flights', (req, res) => {
  try {
    const flights = flightsStorage.values();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve flights.' });
  }
});

// Flight details retrieval
app.get('/flights/:id', (req, res) => {
  const flightId = req.params.id;
  const flight = flightsStorage.get(flightId);
  if (!flight) {
    res.status(404).json({ error: `Flight with id=${flightId} not found` });
  } else {
    res.json(flight);
  }
});

// Flight booking
app.post('/bookings', (req, res) => {
  const { flightId, userId, seats } = req.body;

  // Check if flight exists
  const flight = flightsStorage.get(flightId);
  if (!flight) {
    res.status(404).json({ error: `Flight with id=${flightId} not found` });
    return;
  }

  // Check available seats
  const availableSeats = flight.capacity - flight.bookedSeats;
  if (seats > availableSeats) {
    res.status(400).json({ error: 'Not enough seats available on the flight' });
    return;
  }

  // Create booking
  const totalPrice = seats * 100; // Assuming a price of $100 per seat
  const bookingId = uuidv4();
  const booking: Booking = {
    id: bookingId,
    flightId,
    userId,
    seats,
    totalPrice,
  };

  bookingsStorage.insert(bookingId, booking);

  // Update booked seats count
  flight.bookedSeats += seats;
  flightsStorage.insert(flightId, flight);

  res.json(booking);
});

// Booking cancellation
app.put('/bookings/:id/cancel', (req, res) => {
  const bookingId = req.params.id;
  const booking = bookingsStorage.get(bookingId);

  if (!booking) {
    res.status(404).json({ error: `Booking with id=${bookingId} not found` });
    return;
  }

  // Update booked seats count
  const flight = flightsStorage.get(booking.flightId);
  if (flight) {
    flight.bookedSeats -= booking.seats;
    flightsStorage.insert(booking.flightId, flight);
  }

  bookingsStorage.remove(bookingId);
  res.json({ message: `Booking with id=${bookingId} has been cancelled` });
});

// Payment processing
app.post('/payments', checkUserRole(UserRole.CUSTOMER), (req, res) => {
  const { userId, amount } = req.body;

  // Implement payment processing logic here
  // For demonstration purposes, let's assume payment is successful

  res.json({ message: `Payment of $${amount} processed successfully for user ${userId}` });
});

// Flight status checking
app.get('/flights/:id/status', (req, res) => {
  const flightId = req.params.id;
  const flight = flightsStorage.get(flightId);

  if (!flight) {
    res.status(404).json({ error: `Flight with id=${flightId} not found` });
  } else {
    // Implement flight status retrieval logic here
    // For demonstration purposes, let's assume flight status is available
    res.json({ status: 'On-time' });
  }
});

// Initialize server
export default Server(() => {
  return app.listen();
});

// Helper function to get current date
function getCurrentDate(): Date {
  return new Date(ic.time());
}

// Middleware to check user role
function checkUserRole(role: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check user role logic here
    next();
  };
}

// Enum for user roles
enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}
