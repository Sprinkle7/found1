var file_12 = "";
var app = angular.module('starter', ['ionic','ngCordova'])
app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tab.challan', {
      url: '/challan',
      views: {
        'challan-tab': {
          templateUrl: 'templates/challan.html',
          controller: 'lost'
        }
      }
    });
  $urlRouterProvider.otherwise('/tab/challan');
}); 
app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      $cordovaStatusbar.styleHex('#a45000');
    }
  });
});
app.controller('lost', function($scope, $cordovaFileTransfer,$cordovaCamera,$cordovaGeolocation){
   var lat,lng;
      var posOptions = {maximumAge: 0, timeout: 10000, enableHighAccuracy:true};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          lat  = position.coords.latitude;
          lng = position.coords.longitude;
        },function(err) {
          alert(err.message);
        });
  $scope.take_picture = function () {
      var options = {
      quality: 60,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      var image = document.getElementById('myImage');
      image.src = "data:image/jpeg;base64," + imageData;
      file_12 =  imageData;
    }, function(err) {
    });
  }
  $scope.upload_picture = function () {
     var url = "http://www.find.swatshawls.com/uploaddata.api.php";
     var targetPath = "data:image/jpeg;base64," + file_12;
     var filename = "khan.png";
     var options = {
          fileKey: "file",
          fileName: filename, 
          chunkedMode: false,
          mimeType: "image/jpg",
          params : {'fileName':filename,'description':this.details,'purpose':this.purpose,'title':this.Title,'lng':lng,'lat':lat}
      };     
      $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
          alert("SUCCESS: " + JSON.stringify(result.response));
      }, function (err) {
          alert("ERROR: " + JSON.stringify(err));
      }, function (progress) {
      });
  }
});
