 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 var firebaseConfig = {
     apiKey: "AIzaSyCdtL31Ib2CbZNreWUS66v6ZK8dQPSbz48",
     authDomain: "inject-eee-gate.firebaseapp.com",
     projectId: "inject-eee-gate",
     storageBucket: "gs://inject-eee-gate.appspot.com",
     messagingSenderId: "371849543104",
     appId: "1:371849543104:web:db26f6181807a6d6d69c25",
     measurementId: "G-BK3NJV5ZH3"
 };
 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);
 firebase.analytics();

 const db = firebase.firestore();
 const storage = firebase.storage();
 db.settings({
     timestampsInSnapshots: true
 });