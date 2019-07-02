<template>
  <section class="container">
    <div class="row">
      <div class="col p-2">
        <button class="btn btn-outline-primary btn-block" @click="saveList()">Save list</button>
        <button class="btn btn-outline-danger btn-block" @click="clearList()">Clear list</button>
        <button class="btn btn-outline-success btn-block" @click="generateFakeVideos(5)">Generate videos</button>
        <button class="btn btn-outline-danger" @click="signout()" v-if="user">Signout</button>
        <button class="btn btn-outline-success" @click="signin()" v-else>Login</button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="video in videos">
              <td @click="showInfo(video)">{{video.name}}</td>
              <td>{{video.dateCreated}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script>

  import firebase from '../services/fireinit'
  import { auth, GoogleProvider } from '@/services/fireinit'

  const database = firebase.database();

export default {
  data(){
    return {
      videos: [],
      user: null,
      token: null
    }
  },
  methods:{
    showInfo(video){
      if(this.user) {
        database.ref(`${this.user.uid}/thumbnail-previews/${video.id}`).once('value').then(snapshot => {
          console.log(snapshot.val());
        })
      }
    },
    clearList(){
      this.videos = [];
    },
    saveList(){
      if(this.user) {
        for (let i = 0; i < this.videos.length; i++) {
          var newRef = database.ref(`${this.user.uid}/thumbnail-previews/`).push({
            name: this.videos[i].name,
            dateCreated: this.videos[i].dateCreated
          }).then((snap) => {
            this.videos[i].id = snap.key
          }).catch(e => {
            console.log(e.code);
          });
        }
      }
    },
    generateFakeVideos(num){
      let videos = [];
      for(let i = 0; i < num; i++){
        videos.push({
          name: Math.random().toString(36).substring(7),
          dateCreated: new Date(Math.floor(Math.random() * 35) + 1984, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).getTime()
        })
      }
      this.videos = [...videos];
    },
    signin(){
      auth.signInWithPopup(GoogleProvider).then((result) => {
        this.token = result.credential.accessToken;
        this.user = result.user;
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
      });
    },
    signout(){
      auth.signOut().then(function() {
        this.user = null;
        this.token = null;
      }).catch(function(error) {
        // An error happened.
      });
    }
  },
  created(){

    auth.getRedirectResult().then(function(result) {
      this.token = result.credential.accessToken;
      this.user = result.user;
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    });

    auth.onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        database.ref(`${this.user.uid}`).on('value', snapshot => {
          console.log('Received update');
          console.log(snapshot.val());
        });
        return;
      }
      this.user = null;
      this.token = null;
    })

    // thumbnailPreviewsRef.once('value').then(snapshot => {
    //   console.log('Initial load');
    //   console.log(snapshot.val());
    // });

    // thumbnailPreviewsRef.on('child_added', snapshot => {
    //   console.log(snapshot.val());
    // });
    //
    // thumbnailPreviewsRef.on('child_changed', snapshot => {
    //   console.log(snapshot.val());
    // })
    //
    // thumbnailPreviewsRef.on('child_removed', snapshot => {
    //   console.log(snapshot.val());
    // });

    this.generateFakeVideos(5);
  }
}
</script>

<style>

</style>
