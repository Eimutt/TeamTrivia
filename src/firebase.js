import * as firebase from "firebase";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyBATK2z8Szo9ZIBt-aG6wMlUzqEvFf_VRo",
  authDomain: "teamtrivia-4ffb9.firebaseapp.com",
  databaseURL: "https://teamtrivia-4ffb9.firebaseio.com",
  projectId: "teamtrivia-4ffb9",
  storageBucket: "teamtrivia-4ffb9.appspot.com",
  messagingSenderId: "293756368586"
};
const firebaseApp = firebase.initializeApp(config);
export default firebaseApp;
