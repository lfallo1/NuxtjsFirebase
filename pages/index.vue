<template>
  <section class="container">
    <div class="row">
      <div class="col p-2">
        <button class="btn btn-outline-primary" @click="saveList()">Save list</button>
        <button class="btn btn-outline-danger" @click="clearList()">Clear list</button>
        <button class="btn btn-outline-success" @click="generateFakeVideos(5)">Generate videos</button>
        <button class="btn btn-outline-warning" @click="loadVideos()">Load</button>
      </div>
      <div class="col p-2">
        <span v-if="user">
          ({{user.displayName}})&nbsp;<span class="btn btn-link" @click="signout()">Signout</span>
        </span>
        <span v-else>
          <span class="btn btn-link" @click="signin()">Login</span>
        </span>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="video in newVideos">
              <td></td>
              <td @click="showInfo(video)">{{video.name}}</td>
              <td>{{video.dateCreated}}</td>
              <td><button class="btn btn-sm btn-danger" @click="deleteVideo(video)" v-if="video.id">Delete</button></td>
            </tr>
            <tr v-for="(value, key) in savedVideos">
              <td>{{key}}</td>
              <td @click="showInfo(video)">{{savedVideos[key].name}}</td>
              <td>{{savedVideos[key].dateCreated}}</td>
              <td><button class="btn btn-sm btn-danger" @click="deleteVideo(savedVideos[key])">Delete</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script>

  import _ from 'lodash'
  import firebase from '../services/fireinit'
  import { auth, GoogleProvider } from '@/services/fireinit'

  const database = firebase.database();

export default {
  data(){
    return {
      newVideos: [],
      savedVideos: {},
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
    loadVideos(){
      database.ref(`${this.user.uid}/thumbnail-previews`).once('value').then(snapshot => {
        this.savedVideos = snapshot.val();
      });
    },
    deleteVideo(video){

    },
    clearList(){
      this.newVideos = [];
      this.savedVideos = [];
    },
    saveList(){
      if(this.user) {
        debugger
        for (let i = 0; i < this.newVideos.length; i++) {
          if(!this.newVideos[i].id) {
            database.ref(`${this.user.uid}/thumbnail-previews/`).push({
              name: this.newVideos[i].name,
              dateCreated: this.newVideos[i].dateCreated
            }).catch(e => {
              console.log(e.code);
            });
          }
        }
        this.newVideos = [];
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
      this.newVideos = [...videos, ...this.newVideos];
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

        database.ref(`${this.user.uid}/thumbnail-previews`).on('value', snapshot => {
          this.savedVideos = snapshot.val();
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
  }
}
</script>

<style>

</style>
