$scope.title = myService.getTitle();
$scope.sort = "asc";
$scope.sortKey = "date_created";
$scope.messages = [];
$scope.hideTime = false;
$scope.typingStateStr = ". . .";
$scope.myMsgTypeStr = "mine";

this.getDetail = function() {
	var detailData = myService.getDetail();
	var myDetail = [];
	for (var ind = 0; ind<detailData.length; ind++) {
		var item = detailData[ind];
		var msg_type = "";
		var message = "";
		if(typeof item.user_incoming.message != "undefined"){
			msg_type = "mine";
			message = item.user_incoming.message;
		}
		else {
			msg_type = "other";
			message = item.watson_incoming.message;
		}
		var temp = {
			"detail_id":	item._id,
			"type":			msg_type,
			"message":		message,
			"date_created":	item.date_created
		};
		myDetail.push(temp);
	}
	$scope.messages = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);
};
this.getDetail();
  
$scope.toggleDate = function() {
	$scope.sort = ($scope.sort == "asc")?"desc":"asc";
	$scope.messages = utilityService.sortByKey($scope.messages, $scope.sortKey, $scope.sort);
};
  
$scope.sendMsg=function(to,body){
	var timestamp = new Date().getTime();
	
};

$scope.showSendMessage = function() {
	$scope.sendMsg($scope.parent_id,$scope.data.message);  

	var d = new Date();
	dt = d.toLocaleDateString()+" "+d.toLocaleTimeString().replace(/:\d+ /, " ");

	$scope.messages.push({
	  user_id:	$scope.user_id,
	  type:		$scope.myMsgTypeStr,
	  message:	$scope.data.message,
	  date_created: dt
	});

	delete $scope.data.message;
	$ionicScrollDelegate.scrollBottom(true);
};