import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyBOpyBgplonyQcWckqdPx9O8h2iImnwoYs",
	authDomain: "fir-demolition.firebaseapp.com",
	projectId: "fir-demolition",
	storageBucket: "fir-demolition.appspot.com",
	messagingSenderId: "1080790339695",
	appId: "1:1080790339695:web:3aa2ad38e0af480adabd9a",
};
// storageBucket: "gs://fir-demolition.appspot.com",

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storageRef = firebase.storage().ref();

export default firebase;
