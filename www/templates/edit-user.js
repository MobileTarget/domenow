$scope.title = 'User edit screen';
console.log('$scope.config', $scope.config);
console.log('user_obj', myService.apiResult.user);
$scope.user_data = myService.apiResult.user;
$scope.update_user_info = function(d){
	var url = $scope.config.host + '/update_user_info/'+ d.user_id;
	$http.put(url, d).then(function(res){
		console.log("res >>>>", res);
		$scope.goPage(2);
	}, function(err){
		console.log("err >>>>>", err);
	}); 
}