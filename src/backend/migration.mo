import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldCoatingType = {
    singleCoating : Bool;
    doubleCoating : Bool;
    doubleSagwan : Bool;
    laminate : Bool;
  };

  type OldDoorType = {
    id : Nat;
    height : Float;
    width : Float;
    roundedHeight : Nat;
    roundedWidth : Nat;
    coatings : OldCoatingType;
    squareFeet : Float;
  };

  type OldActor = {
    nextId : Nat;
    typesMap : Map.Map<Nat, OldDoorType>;
  };

  type NewCoatingType = {
    singleCoating : Bool;
    doubleCoating : Bool;
    doubleSagwan : Bool;
    laminate : Bool;
  };

  type NewDoorType = {
    id : Nat;
    enteredHeight : Text;
    enteredWidth : Text;
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
    let newTypesMap = old.typesMap.map<Nat, OldDoorType, NewDoorType>(
      func(_id, oldDoor) {
        {
          id = oldDoor.id;
          enteredHeight = oldDoor.height.toText();
          enteredWidth = oldDoor.width.toText();
          roundedHeight = oldDoor.roundedHeight;
          roundedWidth = oldDoor.roundedWidth;
          coatings = oldDoor.coatings;
          squareFeet = oldDoor.squareFeet;
        };
      }
    );
    { old with typesMap = newTypesMap };
  };
};
