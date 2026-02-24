import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

actor {
  public type CoatingType = {
    #single;
    #double;
    #doubleSagwan;
    #laminate;
  };

  public type DoorEntry = {
    id : Nat;
    heightEntered : Float;
    widthEntered : Float;
    heightRounded : Nat;
    widthRounded : Nat;
    coatingType : CoatingType;
    squareFeet : Float;
  };

  public type AddDoorInput = {
    heightEntered : Float;
    widthEntered : Float;
    heightRounded : Nat;
    widthRounded : Nat;
    coatingType : CoatingType;
  };

  public type CreateDoorType = {
    createdType : DoorEntry;
  };

  public type ComputeTotals = {
    singleCoating : Float;
    doubleCoating : Float;
    doubleSagwan : Float;
    laminate : Float;
    grandTotal : Float;
  };

  var nextId = 0;
  let entries = Map.empty<Nat, DoorEntry>();

  public shared ({ caller }) func addDoor(input : AddDoorInput) : async CreateDoorType {
    let squareFeet = calculateSquareFeet(input.heightRounded, input.widthRounded);

    let newEntry : DoorEntry = {
      id = nextId;
      heightEntered = input.heightEntered;
      widthEntered = input.widthEntered;
      heightRounded = input.heightRounded;
      widthRounded = input.widthRounded;
      coatingType = input.coatingType;
      squareFeet;
    };

    entries.add(nextId, newEntry);
    nextId += 1;

    { createdType = newEntry };
  };

  func calculateSquareFeet(height : Nat, width : Nat) : Float {
    let product = height.toFloat() * width.toFloat();
    let result = product / 144.0;
    let resultX100 = result * 100.0;
    let rounded = resultX100.toInt();
    rounded.toFloat() / 100.0;
  };

  public query ({ caller }) func getAll() : async [DoorEntry] {
    entries.values().toArray();
  };

  public query ({ caller }) func getTotals() : async ComputeTotals {
    var singleCoating : Float = 0.0;
    var doubleCoating : Float = 0.0;
    var doubleSagwan : Float = 0.0;
    var laminate : Float = 0.0;

    for (entry in entries.values()) {
      switch (entry.coatingType) {
        case (#single) { singleCoating += entry.squareFeet };
        case (#double) { doubleCoating += entry.squareFeet };
        case (#doubleSagwan) { doubleSagwan += entry.squareFeet };
        case (#laminate) { laminate += entry.squareFeet };
      };
    };

    let grandTotal = singleCoating + doubleCoating + doubleSagwan + laminate;

    {
      singleCoating;
      doubleCoating;
      doubleSagwan;
      laminate;
      grandTotal;
    };
  };

  public shared ({ caller }) func deleteDoor(id : Nat) : async () {
    switch (entries.get(id)) {
      case (null) {
        Runtime.trap("Entry with id " # id.toText() # " does not exist");
      };
      case (?_) {
        entries.remove(id);
      };
    };
  };

  public shared ({ caller }) func getEntry(id : Nat) : async DoorEntry {
    switch (entries.get(id)) {
      case (null) {
        Runtime.trap("Entry with id " # id.toText() # " does not exist");
      };
      case (?entry) { entry };
    };
  };
};
