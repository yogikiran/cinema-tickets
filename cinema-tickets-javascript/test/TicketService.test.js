import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import { ADULT_TYPE, CHILD_TYPE, INFANT_TYPE } from "../src/pairtest/constants.js";

describe("TicketService", () => {
  const ticketService = new TicketService();
  let adultTicketRequest;
  let infantTicketRequest;
  let childTicketRequest;
  let negativeTicketRequest;

  beforeEach(() => {
    adultTicketRequest = new TicketTypeRequest(ADULT_TYPE, 7);
    infantTicketRequest = new TicketTypeRequest(INFANT_TYPE, 2);
    childTicketRequest = new TicketTypeRequest(CHILD_TYPE, 3);
    negativeTicketRequest = new TicketTypeRequest(ADULT_TYPE, -2);
  });

  it("should throw an exception for invalid account id", () => {
    const testInvalidAccountId1 = () => {
      ticketService.purchaseTickets(
        0,
        adultTicketRequest,
        childTicketRequest
      );
    };
    expect(testInvalidAccountId1).toThrow(InvalidPurchaseException);
    expect(testInvalidAccountId1).toThrow(
      "Invalid account ID. The account ID should be a positive integer value."
    );

    const testInvalidAccountId2 = () => {
      ticketService.purchaseTickets(
        "$",
        adultTicketRequest,
        childTicketRequest
      );
    };
    expect(testInvalidAccountId2).toThrow(InvalidPurchaseException);
    expect(testInvalidAccountId2).toThrow(
        "Invalid account ID. The account ID should be a positive integer value."
    );
  });

  it("should require an adult when purchasing tickets", () => {
    const testMissingAdult1  = () => {
      ticketService.purchaseTickets(5, childTicketRequest);
    };
    expect(testMissingAdult1).toThrow(InvalidPurchaseException);
    expect(testMissingAdult1).toThrow("Ticket purchase restricted to adults only.");

    const testMissingAdult2  = () => {
      ticketService.purchaseTickets(
        10,
        infantTicketRequest,
        childTicketRequest
      );
    };
    expect(testMissingAdult2).toThrow(InvalidPurchaseException);
    expect(testMissingAdult2).toThrow("Ticket purchase restricted to adults only.");
  });

  it("should limit the maximum purchase to 20 tickets per request", () => {
    const testExceededMaxPurchase = () => {
      ticketService.purchaseTickets(
        10,
        adultTicketRequest,
        childTicketRequest,
        infantTicketRequest,
        adultTicketRequest,
        adultTicketRequest
      );
    };
    expect(testExceededMaxPurchase).toThrow(InvalidPurchaseException);
    expect(testExceededMaxPurchase).toThrow(
      "The maximum number of tickets that can be purchased per request is limited to 20."
    );
  });

  it("should only allow zero or more tickets per request", () => {
    const testNegativeTicketCount = () => {
      ticketService.purchaseTickets(
        10,
        negativeTicketRequest
      );
    };
    expect(testNegativeTicketCount).toThrow(InvalidPurchaseException);
    expect(testNegativeTicketCount).toThrow(
      "The ticket count must be zero or a positive number."
    );
  });
});