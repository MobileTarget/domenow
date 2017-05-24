$scope.title = myService.getTitle();
$scope.sort = "asc";
$scope.sortKey = "name";
this.getDetail = function() {
	var detailData = myService.getDetail();
	var myDetail = [];
	for (var ind = 0; ind<detailData.length; ind++) {
		var item = detailData[ind];
		var temp = {
			"detail_id":	item._id,
			"name":			item.user_incoming.message,
			"page_id":		item.to_page_id
		};
		myDetail.push(temp);
	}
	$scope.details = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);
};
this.getDetail();

$scope.toggleDate = function() {
	$scope.sort = ($scope.sort == "asc")?"desc":"asc";
	$scope.details = utilityService.sortByKey($scope.details, $scope.sortKey, $scope.sort);
};

$scope.smsDetails = function(page_id){
	$scope.goPage(page_id);
};