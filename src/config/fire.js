import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyD4RlNnKl7zHleWWpf3aI8vGI4vAmDNAzI",
  authDomain: "thesis-6c5d6.firebaseapp.com",
  databaseURL: "https://thesis-6c5d6.firebaseio.com",
  projectId: "thesis-6c5d6",
  storageBucket: "thesis-6c5d6.appspot.com",
  messagingSenderId: "1019570880262",
  appId: "1:1019570880262:web:09d97e96a80524007b2887",
  measurementId: "G-VCL7H5V0YC"
  };

const fire = firebase.initializeApp(firebaseConfig);

export default fire;