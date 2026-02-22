import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
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
    height : Float;
    width : Float;
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
    height : Float;
    width : Float;
    coatings : CoatingType;
  };

  type AddDoorOutput = {
    createdType : DoorType;
  };

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
    let result = product / 144.0;
    let resultTimes100 = result * 100.0;
    let roundedTimes100 = Int.abs(resultTimes100.toInt()).toFloat();
    roundedTimes100 / 100.0;
  };

  public shared ({ caller }) func addDoor(input : AddDoorInput) : async AddDoorOutput {
    let roundedHeight = roundHeight(input.height);
    let roundedWidth = roundWidth(input.width);
    let squareFeet = calculateSquareFeet(roundedHeight, roundedWidth);

    let newType : DoorType = {
      id = nextId;
      height = input.height;
      width = input.width;
      roundedHeight;
      roundedWidth;
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
