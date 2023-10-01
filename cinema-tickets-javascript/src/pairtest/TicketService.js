import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import { adultType } from "./constants.js";

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
      if (ttr.getTicketType() == adultType) {
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

  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#isValidAccountId(accountId);
    this.#includesAdult(...ticketTypeRequests);
    // throws InvalidPurchaseException
  }
}
