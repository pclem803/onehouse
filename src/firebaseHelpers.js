import firebase from 'firebase/app';
import 'firebase/database';
import firebaseConfig from './Config.js';

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const saveItem = item => {
  const id = generateUUID();
  const itemAttrs = { id, active: true, creator: 'Bob' };
  db.child('items').child(id).set(Object.assign(item, itemAttrs))
    .catch(error => alert(error));
};

const deleteItem = id => {
  db.child('items').child(id).update({active: false})
    .catch(error => alert(error));
};
const S4 = () =>{
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
// https://stackoverflow.com/a/38872723
const generateUUID = () => {
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export {
  saveItem,
  deleteItem,
  db
}
