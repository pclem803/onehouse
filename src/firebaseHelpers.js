import firebase from "firebase/app";
import "firebase/database";
import firebaseConfig from "./Config.js";

require("firebase/functions");

firebase.initializeApp(firebaseConfig);
const functions = firebase.functions();
const db = firebase.database().ref();

const saveItem = ({ name, user, houseName }) => {
  const itemAttrs = {
    visible: true,
    purchased: false,
    productName: name,
    neededBy: [
      {
        name: user.displayName,
        email: user.email,
        quantity: 1,
      },
    ],
    notes: "",
  };
  db.child("houses")
    .child(houseName)
    .child("items")
    .child(name)
    .set(itemAttrs)
    .catch((error) => alert(error));
};

const deleteItem = (productName, houseName) => {
  db.child("houses")
    .child(houseName)
    .child("items")
    .child(productName)
    .update({ visible: false })
    .catch((error) => alert(error));
};

const updatingNotes = (houseName, data, note) => {
  if (note !== undefined) {
    // let updatedNotes =
    //   data["notes"] === ""
    //     ? data["notes"].concat(note)
    //     : data["notes"].concat("/ ", note);
    db.child("houses")
      .child(houseName)
      .child("items")
      .child(data.productName)
      .update({ notes: note });
  }
};

// const increaseItemNumber = (user, data, houseName) => {
//   const personName = user.displayName;
//   if (data.neededBy === undefined) {
//     data.neededBy = [];
//   }

//   const entryIndex = Object.values(data.neededBy).findIndex(
//     person => person.name === personName
//   );

//   if (entryIndex === -1) { // USER IS NOT IN THE NEEDEDBY ARRAY
//     db.child("houses")
//         .child(houseName)
//         .child("items")
//         .child(data.productName)
//         .update({
//           neededBy: [
//             ...Object.values(data.neededBy),
//             {
//               name: personName,
//               email: user.email,
//               quantity: 1
//             }
//         ]
//     })
//   }
//   else { //USER IS IN THE NEEDEDBY ARRAY

//   }
// }

const updateItemNumber = (user, data, incr, houseName) => {
  const personName = user.displayName;
  if (data.neededBy === undefined) {
    data.neededBy = [];
  }
  const entryIndex = Object.values(data.neededBy).findIndex(
    (person) => person.name === personName
  );
  if (entryIndex === -1) {
    if (incr > 0) {
      db.child("houses")
        .child(houseName)
        .child("items")
        .child(data.productName)
        .update({
          neededBy: [
            ...Object.values(data.neededBy),
            {
              name: personName,
              email: user.email,
              quantity: 1,
            },
          ],
        })
        .catch((error) => alert(error));
    }
  } else {
    const updatedQty = Math.max(
      0,
      Object.values(data.neededBy)[entryIndex].quantity + incr
    );
    let newNeededBy = Object.values(data.neededBy);
    newNeededBy.splice(entryIndex, 1);
    newNeededBy.push({
      name: personName,
      quantity: updatedQty,
    });
    if (updatedQty > 0) {
      db.child("houses")
        .child(houseName)
        .child("items")
        .child(data.productName)
        .update({
          neededBy: newNeededBy,
        })
        .catch((error) => alert(error));
    } else if (updatedQty === 0) {
      newNeededBy.pop();
      if (newNeededBy.length === 0) {
        db.child("houses")
          .child(houseName)
          .child("items")
          .child(data.productName)
          .update({
            visible: false,
          });
      }
      db.child("houses")
        .child(houseName)
        .child("items")
        .child(data.productName)
        .update({
          neededBy: newNeededBy,
        });
    }
  }
};

const createHouse = ({ user, houseName, housePassword }) => {
  const houseAttrs = {
    houseName,
    housePassword,
  };
  db.child("houses")
    .child(houseName)
    .set(houseAttrs)
    .catch((error) => alert(error));

  // Update user house
  db.child("users")
    .child(user.uid)
    .update({ house: houseName })
    .catch((error) => alert(error));
};

const joinHouse = (user, houseName) => {
  db.child("users")
    .child(user.uid)
    .update({ house: houseName })
    .catch((error) => alert(error));
};

const leaveHouse = (user) => {
  db.child("users")
    .child(user.uid)
    .set({ uid: user.uid })
    .catch((error) => alert(error));
};

const createUser = (user, usersData) => {
  const userExists = usersData[user.uid] !== undefined;
  let userHouse = undefined;
  if (userExists) {
    userHouse = usersData[user.uid].house;
  }
  const userAttrs = {
    uid: user.uid,
  };
  if (userHouse !== undefined) {
    userAttrs["house"] = userHouse;
  }

  if (usersData) {
    db.child("users")
      .child(user.uid)
      .update(userAttrs)
      .catch((error) => alert(error));
  }
};

export {
  functions,
  saveItem,
  deleteItem,
  db,
  updateItemNumber,
  createHouse,
  joinHouse,
  leaveHouse,
  createUser,
  updatingNotes,
};
