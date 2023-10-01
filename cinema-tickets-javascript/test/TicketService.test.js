import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import { adultType, childType, infantType } from "../src/pairtest/constants.js";

describe("TicketService", () => {
  const ticketService = new TicketService();
  let adultTicketRequest;
  let infantTicketRequest;
  let childTicketRequest;

  beforeEach(() => {
    adultTicketRequest = new TicketTypeRequest(adultType, 7);
    infantTicketRequest = new TicketTypeRequest(infantType, 2);
    childTicketRequest = new TicketTypeRequest(childType, 3);
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
});