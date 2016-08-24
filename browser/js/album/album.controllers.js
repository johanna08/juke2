/* global juke */
'use strict';

juke.controller('AlbumCtrl', function ($scope, $http, $rootScope, $log, StatsFactory, GettingTheAlbums, PlayerFactory) {

  // load our initial data
  GettingTheAlbums.fetchAll()
    .then(function (stillGettingThem) {
      stillGettingThem.map(function(eachAlbum, index) {
        GettingTheAlbums.fetchById(index, eachAlbum.id)
          .then(function (album) {
            album.imageUrl = '/api/albums/' + album.id + '/image';
            album.songs.forEach(function (song, i) {
              song.audioUrl = '/api/songs/' + song.id + '/audio';
              song.albumIndex = i;
            });
            $scope.album = album;
            StatsFactory.totalTime(album)
              .then(function (albumDuration) {
                  $scope.fullDuration = Math.round(albumDuration / 60);
              })
              .catch($log.error);
          })
          .catch($log.error); // $log service can be turned on and off; also, pre-bound
      })
  });

  // main toggle
  $scope.toggle = function (song) {
    if (song === PlayerFactory.getCurrentSong()) {
      if (PlayerFactory.isPlaying()) PlayerFactory.pause();
      else PlayerFactory.resume();
    } else {
      PlayerFactory.start(song);
    }
  };

  // a "true" modulo that wraps negative to the top of the range
  function mod (num, m) { return ((num % m) + m) % m; }

  // jump `interval` spots in album (negative to go back, default +1)
  function skip (interval) {
    if (!$scope.currentSong) return;
    var index = $scope.currentSong.albumIndex;
    index = mod( (index + (interval || 1)), $scope.album.songs.length );
    $scope.currentSong = $scope.album.songs[index];
    if ($scope.playing) $rootScope.$broadcast('play', $scope.currentSong);
  }
  function next () { skip(1); }
  function prev () { skip(-1); }

});

juke.controller('MultiAlbumCtrl', function ($scope, $log, GettingTheAlbums, $q){

  GettingTheAlbums.fetchAll()
  .then(function (stillGettingThem) {
    var promiseArr = stillGettingThem.map(function(oneAlbum) {
      return GettingTheAlbums.fetchById(oneAlbum.id)
    });
    return $q.all(promiseArr);
  })
  .then(function(albums){
    albums.forEach(function(album){
      album.imageUrl = 'api/albums/' + album.id + '/image';
      album.numSongs = album.songs.length;
    });

    $scope.allTheAlbums = albums;
  })
  .catch($log.error);
      
})

