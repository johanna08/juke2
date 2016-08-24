juke.factory('StatsFactory', function ($q) {
  var statsObj = {};
  statsObj.totalTime = function (album) {
    var audio = document.createElement('audio');
    return $q(function (resolve, reject) {
      var sum = 0;
      var n = 0;
      function resolveOrRecur () {
        if (n >= album.songs.length) resolve(sum);
        else audio.src = album.songs[n++].audioUrl;
      }
      audio.addEventListener('loadedmetadata', function () {
        sum += audio.duration;
        resolveOrRecur();
      });
      resolveOrRecur();
    });
  };
  return statsObj;
});

juke.factory('GettingTheAlbums', function($http){
  return {
    fetchAll: function(){
      return $http.get('/api/albums/')
      .then(function (res) {
        return res.data;
      })
      .then(function (albums) {
        return albums
        // return $http.get('/api/albums/')
      })
      // .then(function (res) {
      //   console.log("THIS ALBUMS", res.data)
      //   return res.data;
      // })
    },
    fetchById: function(index, albumId){
      return $http.get('/api/albums/' + albumId)
      .then(function (res) { return res.data; })
      .then(function (albums) {
        console.log("ID", albums)
        return $http.get('/api/albums/' + albumId); // temp: get one
      })
      .then(function (res) {
        return res.data;
      })
    }
  }
})