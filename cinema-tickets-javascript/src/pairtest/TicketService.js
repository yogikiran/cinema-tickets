import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import { ADULT_TYPE, MAX_TICKET_COUNT } from "./constants.js";

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
    for (const ttr of ticketTypeRequests) {
      if (ttr.getTicketType() == ADULT_TYPE) {
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
   * @private
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

  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#isValidAccountId(accountId);
    this.#includesAdult(...ticketTypeRequests);
    this.#isValidTicketCount(...ticketTypeRequests);
    // throws InvalidPurchaseException
  }
}
