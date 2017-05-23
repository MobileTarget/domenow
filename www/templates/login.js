var task_info = myService.getTaskInfo();
$scope.title = task_info.task_name;
$scope.login = function(user) {
	if (!user.phone) {
		utilityService.showAlert("Please enter phone number").then(function(res) {
			$timeout(function() { $("#phone").focus(); }, 100);
		});
		return false;
	}
	var endpoint = $scope.api_url + "/api/login";
	var parameters = {
		phone:			user.phone,
		access_token:	$localStorage.access_token
	};
	var config = {params: parameters};
	$http.get(endpoint, config).then(function(res) {
		var res_data = res.data;
		console.log("res_data>>>",res_data);
		myService.apiResult = res_data;
		$scope.goPage(res_data.page_id);
	});
};