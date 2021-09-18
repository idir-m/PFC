var firebaseConfig = {
    apiKey: "AIzaSyDdBfwLltKBdvf81bNltTMP82vBRKEjswo",
    authDomain: "projet-fin-de-cycle-16f4b.firebaseapp.com",
    projectId: "projet-fin-de-cycle-16f4b",
    storageBucket: "projet-fin-de-cycle-16f4b.appspot.com",
    messagingSenderId: "903143600749",
    appId: "1:903143600749:web:5d5c41b5eb05f7dba64564",
    measurementId: "G-BNVNSPC2CK"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

var db = firebase.firestore();
var auth = firebase.auth();





// listener of user state
auth.onAuthStateChanged(user => {
   if (user) {
    setUpUI(user);
   } else {
    setUpUI();
   }
})