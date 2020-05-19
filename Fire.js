import firebase from "firebase";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjovzvYspMB-hsRjvFHXusD8prSfNO81k",
  authDomain: "todoapp-f7f0c.firebaseapp.com",
  databaseURL: "https://todoapp-f7f0c.firebaseio.com",
  projectId: "todoapp-f7f0c",
  storageBucket: "todoapp-f7f0c.appspot.com",
  messagingSenderId: "968265090589",
  appId: "1:968265090589:web:8faeb2589197ac19e928f4",
};
class Fire {
  constructor(callback) {
    this.init(callback);
  }

  init(callback) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        callback(null, user);
      } else {
        firebase
          .auth()
          .signInAnonymously()
          .catch((error) => {
            callback(error);
          });
      }
    });
  }

  getLists(callback) {
    let ref = this.ref.orderBy("name");

    this.unsubscribe = ref.onSnapshot((snapshot) => {
      lists = [];

      snapshot.forEach((doc) => {
        lists.push({ id: doc.id, ...doc.data() });
      });

      callback(lists);
    });
  }

  addList(list) {
    let ref = this.ref;

    ref.add(list);
  }

  updateList(list) {
    let ref = this.ref;

    ref.doc(list.id).update(list);
  }

  deleteList(id) {
    this.ref
      .doc(id)
      .delete()
      .then(() => {
        console.log("LIST DELETED");
      });
  }

  get userId() {
    return firebase.auth().currentUser.uid;
  }

  get ref() {
    return firebase
      .firestore()
      .collection("users")
      .doc(this.userId)
      .collection("lists");
  }

  detach() {
    this.unsubscribe();
  }
}

export default Fire;
