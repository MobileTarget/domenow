$scope.title="Edit screen";
$scope.update_detail_short_info = function(d){
	var req_obj = {
		detail: {id: d.detail_id,message: d.message},
		task: {id: d.task_id,task_name: d.task_name}
	};
	$http.put($scope.config.host + '/update_short_details', req_obj).then(function(res){
		console.log('res >>>', res);
		$scope.goPage(2);
	}, function(error){
		console.log('error >>>', err);
	});
};