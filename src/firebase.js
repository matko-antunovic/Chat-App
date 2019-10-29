import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyCWx9KEg8Aw8zccXQktJuwxMkgqZAWnzb0",
  authDomain: "slack-40cc0.firebaseapp.com",
  databaseURL: "https://slack-40cc0.firebaseio.com",
  projectId: "slack-40cc0",
  storageBucket: "slack-40cc0.appspot.com",
  messagingSenderId: "972864486124",
  appId: "1:972864486124:web:04100347d6f836bbacc3c9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
