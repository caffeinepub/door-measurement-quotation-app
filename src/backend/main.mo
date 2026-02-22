import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";

actor {
  type DoorEntry = {
    id : Nat;
    height : Float;
    width : Float;
    rate : Float;
    roundedHeight : Nat;
    roundedWidth : Nat;
    squareFeet : Float;
    amount : Nat;
  };

  module DoorEntry {
    public func compareById(entry1 : DoorEntry, entry2 : DoorEntry) : Order.Order {
      Nat.compare(entry1.id, entry2.id);
    };
  };

  var nextId = 1;
  var entries : [DoorEntry] = [];
  let defaultRate = 185.0;

  func roundHeight(height : Float) : Nat {
    let h = height.toInt().toNat();
    if (h <= 72) { 72 } else if (h <= 75) { 75 } else if (h <= 78) { 78 } else if (h <= 80) { 80 } else { 84 };
  };

  func roundWidth(width : Float) : Nat {
    let w = width.toInt().toNat();
    if (w <= 30) { 30 } else if (w <= 32) { 32 } else if (w <= 34) { 34 } else if (w <= 36) { 36 } else if (w <= 38) {
      38;
    } else if (w <= 40) {
      40;
    } else if (w <= 42) { 42 } else { 48 };
  };

  func calculateSquareFeet(height : Nat, width : Nat) : Float {
    let product = height.toFloat() * width.toFloat();
    let divisor = 144.0;
    let result = product / divisor;

    // Round to 2 decimal places
    let resultTimes100 = result * 100.0;
    let roundedTimes100 = (resultTimes100.toInt().toNat()).toFloat();
    roundedTimes100 / 100.0;
  };

  func calculateAmount(squareFeet : Float, rate : Float) : Nat {
    let amount = squareFeet * rate;
    let roundedAmount = amount + 0.0;
    roundedAmount.toInt().toNat();
  };

  public shared ({ caller }) func addDoorEntry(height : Float, width : Float, rate : ?Float) : async DoorEntry {
    let roundedHeight = roundHeight(height);
    let roundedWidth = roundWidth(width);
    let squareFeet = calculateSquareFeet(roundedHeight, roundedWidth);
    let finalRate = switch (rate) {
      case (?r) { r };
      case (null) { defaultRate };
    };
    let amount = calculateAmount(squareFeet, finalRate);

    let entry : DoorEntry = {
      id = nextId;
      height;
      width;
      rate = finalRate;
      roundedHeight;
      roundedWidth;
      squareFeet;
      amount;
    };

    entries := entries.concat([entry]);
    nextId += 1;
    entry;
  };

  public query ({ caller }) func getAllEntries() : async [DoorEntry] {
    entries.sort(DoorEntry.compareById);
  };

  public query ({ caller }) func getGrandTotalSquareFeet() : async Float {
    var total : Float = 0.0;
    for (entry in entries.values()) {
      total += entry.squareFeet;
    };
    total;
  };

  public query ({ caller }) func getGrandTotalAmount() : async Nat {
    var totalAmount = 0;
    for (entry in entries.values()) {
      totalAmount += entry.amount;
    };
    totalAmount;
  };

  public shared ({ caller }) func deleteEntry(id : Nat) : async () {
    let initialLength = entries.size();
    let filtered = entries.filter(
      func(entry) { entry.id != id }
    );
    if (filtered.size() == initialLength) {
      Runtime.trap("Entry with id " # id.toText() # " does not exist");
    };
    entries := filtered;
  };
};
