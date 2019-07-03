import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'

var config = {
  apiKey: "AIzaSyCA4DY0Q9gONYzmqjRavdoNFKMeDoyeNaE",
  authDomain: "nuxtfirebase-demo.firebaseapp.com",
  databaseURL: "https://nuxtfirebase-demo.firebaseio.com",
  projectId: "nuxtfirebase-demo",
  storageBucket: "",
  messagingSenderId: "249461641393",
  appId: "1:249461641393:web:b0d7b3920d50ccae"
}

firebase.initializeApp(config)
export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const DB = firebase.database()
export const StoreDB = firebase.firestore()
export default firebase
