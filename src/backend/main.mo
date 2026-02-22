import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
actor {
  type CoatingType = {
    singleCoating : Bool;
    doubleCoating : Bool;
    doubleSagwan : Bool;
    laminate : Bool;
  };

  module CoatingType {
    public func default() : CoatingType = {
      singleCoating = false;
      doubleCoating = false;
      doubleSagwan = false;
      laminate = false;
    };
  };

  type DoorType = {
    id : Nat;
    enteredHeight : Text; // Store entered size in string to allow fractions
    enteredWidth : Text;
    roundedHeight : Nat;
    roundedWidth : Nat;
    coatings : CoatingType;
    squareFeet : Float;
  };

  var nextId = 1;
  let typesMap = Map.empty<Nat, DoorType>();

  let singleCoatingRate : Float = 165.0;
  let doubleCoatingRate : Float = 185.0;
  let doubleCoatingSagwanRate : Float = 210.0;
  let laminateRate : Float = 240.0;

  public type AddDoorInput = {
    enteredHeight : Text; // Received as Text to allow diversity of inputs (w/o JS regex)
    enteredWidth : Text;
    roundedHeight : Nat;
    roundedWidth : Nat;
    coatings : CoatingType;
  };

  type AddDoorOutput = {
    createdType : DoorType;
  };

  func calculateSquareFeet(height : Nat, width : Nat) : Float {
    let product = height.toFloat() * width.toFloat();
    let result = product / 144.0;
    let resultTimes100 = result * 100.0;
    let roundedTimes100 = Int.abs(resultTimes100.toInt()).toFloat();
    roundedTimes100 / 100.0;
  };

  public shared ({ caller }) func addDoor(input : AddDoorInput) : async AddDoorOutput {
    let squareFeet = calculateSquareFeet(input.roundedHeight, input.roundedWidth);

    let newType : DoorType = {
      id = nextId;
      enteredHeight = input.enteredHeight;
      enteredWidth = input.enteredWidth;
      roundedHeight = input.roundedHeight;
      roundedWidth = input.roundedWidth;
      coatings = input.coatings;
      squareFeet;
    };

    let id = nextId;
    nextId += 1;
    typesMap.add(id, newType);

    { createdType = newType };
  };

  public query ({ caller }) func getAllTypes() : async [DoorType] {
    typesMap.values().toArray();
  };

  public query ({ caller }) func getTotalSquareFeet() : async Float {
    var total : Float = 0.0;
    for (t in typesMap.values()) {
      total += t.squareFeet;
    };
    total;
  };

  public query ({ caller }) func getCoatingTotals() : async {
    singleCoating : Float;
    doubleCoating : Float;
    doubleSagwan : Float;
    laminate : Float;
  } {
    var singleCoating : Float = 0.0;
    var doubleCoating : Float = 0.0;
    var doubleSagwan : Float = 0.0;
    var laminate : Float = 0.0;

    for (t in typesMap.values()) {
      if (t.coatings.singleCoating) {
        singleCoating += t.squareFeet;
      };
      if (t.coatings.doubleCoating) {
        doubleCoating += t.squareFeet;
      };
      if (t.coatings.doubleSagwan) {
        doubleSagwan += t.squareFeet;
      };
      if (t.coatings.laminate) {
        laminate += t.squareFeet;
      };
    };

    {
      singleCoating;
      doubleCoating;
      doubleSagwan;
      laminate;
    };
  };

  public query ({ caller }) func calculateCoatingAmounts() : async {
    singleCoatingAmount : Float;
    doubleCoatingAmount : Float;
    doubleSagwanAmount : Float;
    laminateAmount : Float;
  } {
    var singleCoatingAmount : Float = 0.0;
    var doubleCoatingAmount : Float = 0.0;
    var doubleSagwanAmount : Float = 0.0;
    var laminateAmount : Float = 0.0;

    for (t in typesMap.values()) {
      if (t.coatings.singleCoating) {
        singleCoatingAmount += t.squareFeet * singleCoatingRate;
      };
      if (t.coatings.doubleCoating) {
        doubleCoatingAmount += t.squareFeet * doubleCoatingRate;
      };
      if (t.coatings.doubleSagwan) {
        doubleSagwanAmount += t.squareFeet * doubleCoatingSagwanRate;
      };
      if (t.coatings.laminate) {
        laminateAmount += t.squareFeet * laminateRate;
      };
    };

    {
      singleCoatingAmount;
      doubleCoatingAmount;
      doubleSagwanAmount;
      laminateAmount;
    };
  };

  public shared ({ caller }) func deleteType(id : Nat) : async () {
    switch (typesMap.get(id)) {
      case (null) {
        Runtime.trap("Entry with id " # id.toText() # " does not exist");
      };
      case (?_) {
        typesMap.remove(id);
      };
    };
  };
};
