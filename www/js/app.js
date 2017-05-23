var DomenowApp = angular.module('DomenowApp', 
					['ionic', 'btford.socket-io', 'ngStorage',
					'ngTouch', 'ngCordova', 'itemSwipePaneDirective'])
DomenowApp.run(function($ionicPlatform, BluemixService, $window) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
	
	BluemixService.connect().then(function success(response) {
		console.log("We registered OK. The deviceID of this device is: " + response);
	}, function failure(response) {
		console.log("Registering for push did not work");
	});
  });
})