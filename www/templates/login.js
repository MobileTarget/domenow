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
		console.log("login res_data>>>"+ JSON.stringify(res_data));
		$localStorage.access_token = res_data.access_token;
		myService.apiResult = res_data;
		$scope.goPage(res_data.page_id);
	});
};