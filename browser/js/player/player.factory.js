'use strict';

juke.factory('PlayerFactory', function($rootScope){
	var audio = document.createElement('audio');
	audio.addEventListener('ended', function () {
	    PlayerFunctionality.next();
	//     // $scope.$apply(); // DO THIS => // triggers $rootScope.$digest, which hits other scopes
			$rootScope.digest();
	//     $scope.$evalAsync(); // DON'T NEED YOU // likely best, schedules digest if none happening
	  });
	audio.addEventListener('timeupdate', function () {
	//     $scope.progress = 100 * audio.currentTime / audio.duration;
			$rootScope.$digest(); // re-computes current template only (this scope)
	//     $scope.$evalAsync(); // DON'T NEED YOU // likely best, schedules digest if none happening
	});
  	let PlayerFunctionality = {
  		playing: false,
  		currentSong: null,
  		start: function(song, songList){
		  	this.pause();
		    this.playing = true;
		    // resume current song
		    // if (song === this.currentSong) return audio.play();
		    this.currentSong = song;
		    this.songList = songList;
		    // enable loading new song
		    // $scope.currentSong = song;
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
  			this.progress = 100 * audio.currentTime / audio.duration;
  			console.log(this.progress);
  			return this.progress;
  		}
  	}
  	return PlayerFunctionality;
});
