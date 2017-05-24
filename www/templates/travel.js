$scope.sort = "asc";
$scope.sortKey = "name";
var task_info = myService.getTaskInfo();
//$scope.config.page_id;
$scope.config.from_page_id = task_info.from_page_id;
$scope.config.task_id = task_info.task_id;
$scope.config.task_name = task_info.task_name;
console.log("$scope.config>>>", $scope.config);
$scope.title = $scope.config.task_name;
$scope.isAdmin = true;
function getDetail() {
	var detailData = myService.getDetail();
	var myDetail = [];
	for (var ind = 0; ind<detailData.length; ind++) {
		var item = detailData[ind];
		var temp = {
			"id":		item._id,
			"name":		item.user_incoming.message,
			"page_id":	item.to_page_id,
			"active":	item.count.active,
			"unread":	item.count.unread
		};
		myDetail.push(temp);
	}
	$scope.details = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);
};
getDetail();
$scope.toggleDate = function() {
	$scope.sort = ($scope.sort == "asc")?"desc":"asc";
	$scope.details = utilityService.sortByKey($scope.details, $scope.sortKey, $scope.sort);
};
$scope.editUser = function(){
	$scope.config.from_page_id = 2;
	$scope.config.task_name = "User edit";
	var page_id = 14;
	$scope.goPage(page_id);
};
$scope.subDetails = function(item){
	$scope.config.from_page_id = $scope.config.page_id;
	$scope.config.task_name = item.name;
	$scope.goPage(item.page_id);
};
$scope.add_detail_sub_from_category = function() {
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
	var headers = {"Content-Type": "application/json"};
	var config = {headers:headers};
	$http.post(endpoint, postdata, config).then(function(res) {
		var res_data = res.data;
		console.log("res_data>>>",res_data);
		
	},function(err) {
		console.log("err>>>",err);
	});
	delete $scope.data.message;
};
$scope.editDetails = function(item){
	$scope.config.from_page_id = $scope.config.page_id;
	$scope.config.task_name = item.name;
	$scope.short_info = {
		"detail_id": 	item.id,
		"message":	 	item.name,
		"task_id":		$scope.config.task_id,
		"task_name": 	$scope.config.task_name,
		"task_status":	"true"
	};
	var page_id = 15;
	$scope.goPage(page_id);
};
$scope.deleteDetails = function(item) {
	var endpoint = "https://platform.mybluemix.net/delete_detail";
	var parameters = {
		_id:		  item.id,
		access_token: $localStorage.access_token
	};
	//console.log(parameters);return true;
	utilityService.setBusy(true, "Processing...");
	var headers = {"Content-Type": "application/json"};
	var config = {params:parameters, headers:headers};
	$http.get(endpoint, config).then(function(res){
		if(res.data.status == 200){
			$scope.details.splice($scope.details.indexOf(item), 1);
		}
		else {
			
		}
		utilityService.setBusy(false);
	}, function(err_task){
		console.log('err_task', err_task);
		utilityService.setBusy(false);
	});
};
$scope.moreDetails = function(item) {
	$scope.config.from_page_id = $scope.config.page_id;
	$scope.config.task_name = item.name;
	var page_id = 16;
	$scope.goPage(page_id);
};