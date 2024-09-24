import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBOpyBgplonyQcWckqdPx9O8h2iImnwoYs",
	authDomain: "fir-demolition.firebaseapp.com",
	projectId: "fir-demolition",
	storageBucket: "fir-demolition.appspot.com",
	messagingSenderId: "1080790339695",
	appId: "1:1080790339695:web:3aa2ad38e0af480adabd9a",
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();
export default firebase;
