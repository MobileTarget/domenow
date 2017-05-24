$scope.sort = "asc";
$scope.sortKey = "date_created";
$scope.messages = [];
$scope.hideTime = false;
$scope.typingStateStr = ". . .";
$scope.myMsgTypeStr = "mine";

var task_info = myService.getTaskInfo();
//$scope.config.page_id;
$scope.config.from_page_id = task_info.from_page_id;
$scope.config.task_id = task_info.task_id;
$scope.config.task_name = task_info.task_name;
console.log("$scope.config>>>", $scope.config);
$scope.title = $scope.config.task_name;
this.getDetail = function() {
	var detailData = myService.getDetail();
	//console.log("detailData>>>", detailData);
	var myDetail = [];
	for (var ind = 0; ind<detailData.length; ind++) {
		var item = detailData[ind];
		var msg_type = "";
		var message = "";
		if(typeof item.user_id == $localStorage.user_id){
			msg_type = "mine";
			message = item.user_incoming.message;
		}
		else {
			msg_type = "other";
			message = item.user_incoming.message;
		}
		//if(typeof message !="undefined"){
			var temp = {
				"detail_id":	item._id,
				"type":			msg_type,
				"message":		message,
				"date_created":	item.date_created
			};
			myDetail.push(temp);
		//}
	}
	$scope.messages = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);
};
this.getDetail();
$scope.toggleDate = function() {
	$scope.sort = ($scope.sort == "asc")?"desc":"asc";
	$scope.messages = utilityService.sortByKey($scope.messages, $scope.sortKey, $scope.sort);
};
$scope.add_msg_from_sub_category = function() {
	//console.log($scope.data.message);
	var endpoint = "https://platform.mybluemix.net/add_detail";
	var postdata = {
		user_id:		$localStorage.user_id,
		access_token: 	$localStorage.access_token,
		note: 			$scope.data.message,
		task_name:		$scope.config.task_name,
		page_id:		$scope.config.page_id,
		from_page_id:	$scope.config.from_page_id
	};
	//console.log(postdata);return true;
	utilityService.setBusy(true, "Sending...");
	var headers = {"Content-Type": "application/json"};
	var config = {headers:headers};
	$http.post(endpoint, postdata, config).then(function(res) {
		var res_data = res.data;
		console.log("res_data>>>",res_data);
		
		var msg_data = {
			"detail_id":	res_data._id,
			"type":			"mine",
			"message":		res_data.user_incoming.message,
			"date_created":	res_data.date_created
		};
		$scope.messages.push(msg_data);
		utilityService.setBusy(false);
	},function(err) {
		console.log("err>>>",err);
		utilityService.setBusy(false);
	});
	delete $scope.data.message;
};