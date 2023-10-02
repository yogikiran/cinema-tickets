import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import { ADULT_TYPE, INFANT_TYPE, CHILD_TYPE, ALLOCATE_SEAT, MAX_TICKET_COUNT, TICKET_PRICE } from "./constants.js";

export default class TicketService {
  /**
   * Checks if the account ID is valid.
   * @param {number} accountId - The account ID to be validated.
   * @throws {InvalidPurchaseException} - Thrown if the account ID is not a valid non-negative integer greater than zero.
   */
  #isValidAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException(
        'Invalid account ID. The account ID should be a positive integer value.'
      );
    }
  }

  /**
   * Checks if the ticket purchase request includes at least one adult ticket.
   * @param {...TicketTypeRequest} ticketTypeRequests - The ticket type requests to be checked.
   * @throws {InvalidPurchaseException} - Thrown if there is no adult ticket in the request.
   */
  #includesAdult(...ticketTypeRequests) {
    let adultFound = false;
    for (const ticketTypeRequest of ticketTypeRequests) {
      if (ticketTypeRequest.getTicketType() == ADULT_TYPE) {
        adultFound = true;
        break;
      }
    }
    if (!adultFound) {
      throw new InvalidPurchaseException(
        'Ticket purchase restricted to adults only.'
      );
    }
  }

  /**
   * Validates the ticket count for a ticket purchase request.
   * @param {...TicketTypeRequest} ticketTypeRequests - The ticket type requests to validate.
   * @throws {InvalidPurchaseException} If the ticket count is less than zero or exceeds the maximum limit.
   */
  #isValidTicketCount(...ticketTypeRequests) {
    let totalTickets = 0;

    for (const request of ticketTypeRequests) {
      totalTickets += request.getNoOfTickets();
      if (request.getNoOfTickets() < 0) {
        throw new InvalidPurchaseException(
          'The ticket count must be zero or a positive number.'
        );
      }
      if (totalTickets > MAX_TICKET_COUNT) {
        throw new InvalidPurchaseException(
          'The maximum number of tickets that can be purchased per request is limited to 20.'
        );
      }
    }
  }

  /**
   * Calculate the total amount to pay for the ticket purchase and call the ticket payment service.
   * @param {number} accountId - The ID of the account making the ticket purchase.
   * @param {...TicketTypeRequest} ticketTypeRequests - The ticket type requests specifying the number of tickets for each type.
   */
  #calculateTotalAmountAndPay(accountId, ...ticketTypeRequests) {
    let totalAmount = 0;

    for (const ticketTypeRequest of ticketTypeRequests) {
      totalAmount += ticketTypeRequest.getNoOfTickets() * TICKET_PRICE[ticketTypeRequest.getTicketType()];
    }
    const ticketPaymentService = new TicketPaymentService();
    ticketPaymentService.makePayment(accountId, totalAmount);
    console.log(`Total amount paid for the tickets: ${totalAmount}`);
  }

  /**
   * After the ticket payment is made, calculate the seats to reserve and call the seat reservation service.
   * @param {string | number} accountId - The ID of the account making the ticket purchase.
   * @param {...TicketTypeRequest} ticketTypeRequests - The ticket type requests specifying the number of tickets for each type.
   */
  #calculateSeatsAndReserve(accountId, ...ticketTypeRequests) {
    let totalSeats = 0;
    for (const ticketTypeRequest of ticketTypeRequests) {
      totalSeats += ticketTypeRequest.getNoOfTickets() * ALLOCATE_SEAT[ticketTypeRequest.getTicketType()];
    }
    const seatReservationService = new SeatReservationService();
    seatReservationService.reserveSeat(accountId, totalSeats);
    console.log(`Total seats reserved: ${totalSeats}`);
  }

  /**
   * Purchase tickets with the given account ID and ticket type requests.
   * @param {number} accountId - The ID of the account making the ticket purchase.
   * @param {...TicketTypeRequest} ticketTypeRequests - The ticket type requests specifying the number of tickets for each type.
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#isValidAccountId(accountId);
    this.#includesAdult(...ticketTypeRequests);
    this.#isValidTicketCount(...ticketTypeRequests);
    this.#calculateTotalAmountAndPay(accountId, ...ticketTypeRequests);
    this.#calculateSeatsAndReserve(accountId, ...ticketTypeRequests);
    console.log("Tickets purchased successfully");
  }
}

// Driver code to purchase tickets, also covered with unit-tests
const requestTicket = new TicketService();
const ticketTypeRequest = new TicketTypeRequest(ADULT_TYPE, 3);
const ticketTypeRequest1 = new TicketTypeRequest(INFANT_TYPE, 2);
const ticketTypeRequest2 = new TicketTypeRequest(CHILD_TYPE, 2);

requestTicket.purchaseTickets(3, ticketTypeRequest, ticketTypeRequest1, ticketTypeRequest2);
