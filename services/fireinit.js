import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'

var config = {
  apiKey: "AIzaSyDDv3diryk6ALZTiAPtwcz6uqOgxsPZIVU",
  authDomain: "nuxtjs-video-repo.firebaseapp.com",
  databaseURL: "https://nuxtjs-video-repo.firebaseio.com",
  projectId: "nuxtjs-video-repo",
  storageBucket: "",
  messagingSenderId: "925146945924",
  appId: "1:925146945924:web:b4ee97644a3ec742"
}

//webclientid => 925146945924-od5n5li9rs5spkcrd4achdbb0l6dir93.apps.googleusercontent.com
//webclientsecret => ODkuvu3OvJzwy2Aa6EOQz_6H

firebase.initializeApp(config)
export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const DB = firebase.database()
export const StoreDB = firebase.firestore()
export default firebase
