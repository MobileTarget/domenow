$scope.title = myService.getTitle();
$scope.sort = "asc";
$scope.sortKey = "date_created";
$scope.messages = [];
$scope.hideTime = false;
$scope.typingStateStr = ". . .";
$scope.myMsgTypeStr = "mine";

var typing = false;
var lastTypingTime;
var TYPING_TIMER_LENGTH = 250;
var historyData = [];

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
		else if(typeof item.watson_incoming.message != "undefined"){
			msg_type = "other";
			message = item.watson_incoming.message;
		}
		var temp = {
			"detail_id":	item._id,
			"type":			msg_type,
			"message":		message,
			"date_created":	item.date_created
		};
		if(msg_type)
			myDetail.push(temp);
	}
	historyData = utilityService.sortByKey(myDetail, $scope.sortKey, $scope.sort);
	return historyData;
};
historyData = this.getDetail();
Chat.setMessages(historyData);
$scope.messages = Chat.getMessages();

Socket.on("connect",function(){
	Socket.emit("add user", $scope.myName);
});

Chat.scrollBottom();

var sendUpdateTyping = function(){
    if (!typing) {
      typing = true;
      Socket.emit("typing");
    }
    lastTypingTime = (new Date()).getTime();
    $timeout(function () {
      var typingTimer = (new Date()).getTime();
      var timeDiff = typingTimer - lastTypingTime;
      if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
        Socket.emit("stop typing");
        typing = false;
      }
    }, TYPING_TIMER_LENGTH);
  };

$scope.updateTyping = function(){
    sendUpdateTyping();
};

$scope.toggleDate = function() {
	$scope.sort = ($scope.sort == "asc")?"desc":"asc";
	$scope.messages = utilityService.sortByKey($scope.messages, $scope.sortKey, $scope.sort);
};

$scope.sendMsg=function(to,body){
	var timestamp = new Date().getTime();
	
};

$scope.showSendMessage = function() {
	$scope.sendMsg($scope.parent_id,$scope.data.message);
	Chat.sendMessage($scope.user_id, $scope.data.message);
	delete $scope.data.message;
};