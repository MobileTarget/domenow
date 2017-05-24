$scope.title = "Edit screen"; 
var endpoint = "https://platform.mybluemix.net"; 
$scope.update_task_info = function (task_data) {
	$http.post(endpoint + '/update_task' , task_data).then(function(res){
		console.log('response', res); $scope.goPage(2);
	}, function (err){
		console.log('error while updating record', err);
	});
};
$scope.get_template = function() {
	$http.get( endpoint + '/get_all_templates' ).then(function(res) {
		if(res.status == 200) {
			$scope.temp_data = res.data;
		}
	}, function (err_temp) {
		console.log('err_temp', err_temp);
	});
};
$scope.get_template();

$scope.get_task_by_name = function () {
	$http.get(endpoint + '/get_task_names').then(function (res) {
		if (res.status == 200) {
			$scope.task_arr = res.data.data;
		}
		else {
			$scope.task_arr = [];
		}
	}, function (err_task) {
		console.log('err_task', err_task); }
	);
};
$scope.get_task_by_name();

$scope.get_timeout_list = function () {
	$http.get(endpoint + '/get_all_timeout').then(function (res) {
		if (res.data.status == 200) {
			$scope.timeout_arr = res.data.data;
		}
		else {
			$scope.timeout_arr = [];
		}
	}, function (err_timeout) {
		console.log('err_timeout', err_timeout);
	});
};
$scope.get_timeout_list();

$scope.get_location_list = function () {
	$http.get(endpoint + '/get_all_location').then(function (res) {
		if (res.data.status == 200) {
			$scope.location_arr = res.data.data;
		}
		else {
			$scope.location_arr = [];
		} 
	},
	function (err_location) {
		console.log('err_timeout', err_location);
	});
};
$scope.get_location_list();

$scope.get_users_list = function () {
	$http.get(endpoint + '/get_users').then(function (res) {
		$scope.user_list = res.data.data;
	}, function (err) {
		console.log("user_err", err);
	});
};
$scope.get_users_list();

$scope.get_selected_task = function () {
	var req_obj = { 	
		"type": "get_task_by_id", 	
		"body": {
			"task_id": task_info.task_id 	
		}
	} 
	$http.post(endpoint + '/api_handler', req_obj).then(function (res) {console.log(res);
		if (res.data.status == 200 && !angular.equals(res.data.data, {})) {
			$scope.task_data = res.data.data;
			$scope.task_data.status = JSON.parse($scope.task_data.status);
			$scope.task_data.display_if_empty = JSON.parse($scope.task_data.display_if_empty); 
			$scope.task_data.additional_data_fn = $scope.task_data.additional_data_fn ? $scope.task_data.additional_data_fn:'N/A';
			$scope.task_data.optional_data = JSON.stringify($scope.task_data.optional_data);
			$scope.task_data.required_data = JSON.stringify($scope.task_data.required_data);
		}
		else {
			$scope.task_data = {};
		}
	}, function (task_err) {
		console.log('task_err', task_err);
	});
};
$scope.get_selected_task();