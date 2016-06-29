var flickrModule = angular.module('flickrSearcher', []); 
flickrModule.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
flickrModule.controller('searcherCtrl', function($http, $q, $timeout) {
  var vm = this;
  vm.results = [];

  function wait() { 
    var defer = $q.defer(); // Simulating doing some asynchronous operation... 
    $timeout(function(){ 
      // show 'searching' message
      defer.resolve(); 
    }, 2000); 
    return defer.promise; 
  }; 
  vm.submit = function(tag) {
    var params = {
      method: "flickr.photos.search",
      api_key: "75f435ddc0f3e0de7e0eb1ce0ec38175",
      tags: vm.tag,
      format: "json",
      nojsoncallback: 1
    };
    $http({
      method: 'GET',
      url: 'https://api.flickr.com/services/rest',
      params: params
    })
    .then(function successCallback(results) {
      vm.searchTag = "Searching Flickr for photos tagged with \"" + vm.tag + "\"...";
      wait().then(function(){
        var numResults = results.data.photos.photo.length;
        vm.searchTag = "There are " + numResults + " results for \"" + vm.tag + "\".";
        vm.results = results.data.photos.photo;
        vm.tag = null;
      });
    }, 
    function errorCallback(results) {
      vm.searchTag = "We are experiencing trouble connecting to Flickr."
      vm.tag = null;
    });
  }
});