import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldDoorEntry = {
    id : Nat;
    doorType : Text;
    height : Float;
    width : Float;
    rate : Float;
    quantity : Nat;
    roundedHeight : Nat;
    roundedWidth : Nat;
    squareFeet : Float;
    amount : Nat;
  };

  type OldActor = {
    nextId : Nat;
    defaultRate : Float;
    entries : [OldDoorEntry];
  };

  type NewCoatingType = {
    singleCoating : Bool;
    doubleCoating : Bool;
    doubleSagwan : Bool;
    laminate : Bool;
  };

  type NewDoorType = {
    id : Nat;
    height : Float;
    width : Float;
    roundedHeight : Nat;
    roundedWidth : Nat;
    coatings : NewCoatingType;
    squareFeet : Float;
  };

  type NewActor = {
    nextId : Nat;
    typesMap : Map.Map<Nat, NewDoorType>;
  };

  public func run(old : OldActor) : NewActor {
    { nextId = old.nextId; typesMap = Map.empty<Nat, NewDoorType>() };
  };
};
