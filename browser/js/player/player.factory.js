'use strict';

juke.factory('PlayerFactory', function($rootScope){
	var audio = document.createElement('audio');
	audio.addEventListener('ended', function () {
	    PlayerFunctionality.next();
			$rootScope.digest();
	  });
	audio.addEventListener('timeupdate', function () {
			$rootScope.$digest(); // re-computes current template only (this scope)
	});
  	let PlayerFunctionality = {
  		playing: false,
  		currentSong: null,
  		start: function(song, songList){
		  	this.pause();
		    this.playing = true;
		    // resume current song
		    this.currentSong = song;
		    this.songList = songList;		  
		    audio.src = song.audioUrl;
		    audio.load();
		    audio.play();
  		},
  		pause: function(){
  			audio.pause();
    		this.playing = false;
  		},
  		resume: function(){
  			audio.play();
  			this.playing = true;
  		},
  		isPlaying: function(){
  			return this.playing;
  		},
  		getCurrentSong: function(){
  			return this.currentSong;
  		},
  		next: function(){
  			let nextSongIndex = this.songList.indexOf(this.currentSong) + 1;
  			if (nextSongIndex > this.songList.length - 1) nextSongIndex = 0;
  			this.start(this.songList[nextSongIndex]);
  		},
  		previous: function(){
  			let nextSongIndex = this.songList.indexOf(this.currentSong) - 1;
  			if (nextSongIndex < 0) nextSongIndex = this.songList.length - 1;
  			this.start(this.songList[nextSongIndex])
  		},
  		getProgress: function(){
  			this.progress = audio.currentTime / audio.duration || 0;
  			console.log(this.progress);
  			return this.progress;
  		}
  	}
  	return PlayerFunctionality;
});
