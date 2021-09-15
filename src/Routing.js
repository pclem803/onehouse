import React, { useState, useEffect } from "react";
import "rbx/index.css";
import "./App.css";
import firebase from "firebase/app";
import "firebase/database";
import ListPage from "./ListPage";
import Banner from "./Banner";
import { db, createUser } from "./firebaseHelpers";
import { Block } from "rbx";

const createItemList = (dbData, house) => {
  let items = dbData.houses[house].items;
  items = items ? Object.values(items) : [];
  return items.filter((item) => item.visible);
};

function App() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(undefined);
  const [house, setHouse] = useState(undefined);
  const [housesData, setHousesData] = useState([]);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const handleData = (snap) => {
      if (snap.val()) {
        setHousesData(snap.val().houses);
        setUsersData(snap.val().users);
        if (house) {
          if (snap.val().houses[house] !== undefined) {
            setItems(createItemList(snap.val(), house));
          } else {
            alert("wrong house name");
            setHouse(undefined);
          }
        } else {
          setItems([]);
        }
      }
    };
    db.on("value", handleData, (error) => alert(error));
    return () => {
      db.off("value", handleData);
    };
  }, [house, user]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
    if (user) {
      createUser(user, usersData);
    }
  }, [user, usersData]);

  useEffect(() => {
    if (user && usersData[user.uid] && usersData[user.uid].house) {
      setHouse(usersData[user.uid].house);
    } else {
      setHouse(undefined);
    }
  }, [usersData, user]);

  return (
    <div className="App">
      <Banner
        user={user}
        house={house}
        setHouse={setHouse}
        housesData={housesData}
        usersData={usersData}
      />
      <Block />
      <ListPage propItems={items} user={user} house={house} />
    </div>
  );
}

export default App;
