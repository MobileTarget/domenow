var task_info = myService.getTaskInfo();
$scope.title = task_info.task_name;
$scope.verify = function(user){
	if (!user.code) {
		utilityService.showAlert("Please enter code number").then(function(res) {
			$timeout(function() { $("#code").focus(); }, 100);
		});
		return false;
	}
	var endpoint = $scope.api_url + "/api/verify";
	var parameters = {
		code:			user.code,
		access_token:	$localStorage.access_token
	};
	var config = {params: parameters};
	$http.get(endpoint, config).then(function(res) {
		var res_data = res.data;
		console.log("res_data>>>",res_data);
		if (res_data.status == "valid") {
			$localStorage.user_id = res_data.user_id;
		}
		myService.apiResult = res_data;
		$scope.goPage(res_data.page_id);
	});
};