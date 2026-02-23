import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type CoatingType = {
    #single;
    #double;
    #doubleSagwan;
    #laminate;
  };

  type DoorEntry = {
    id : Nat;
    heightEntered : Float;
    widthEntered : Float;
    heightRounded : Nat;
    widthRounded : Nat;
    coatingType : CoatingType;
    squareFeet : Float;
  };

  type OldActor = {
    entries : Map.Map<Nat, DoorEntry>;
    nextId : Nat;
  };

  type NewActor = {
    entries : Map.Map<Nat, DoorEntry>;
    nextId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newEntries = Map.empty<Nat, DoorEntry>();
    for (i in old.entries.keys()) {
      switch (old.entries.get(i)) {
        case (null) {};
        case (?entry) {
          newEntries.add(i, entry);
        };
      };
    };
    {
      entries = newEntries;
      nextId = old.nextId;
    };
  };
};
