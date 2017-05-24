/********* controllers ***********/
DomenowApp.controller('TodoCtrl', function($scope, $state, $timeout, $interval,
		$ionicScrollDelegate, $ionicPopup, $http,
		$templateRequest, $localStorage, $q, $window, 
		myService, utilityService, HttpService,
		Task, dbService,
		Socket, Chat) {
	var isIOS = ionic.Platform.isIOS();

	$scope.config = {
		page_id:		2,
		from_page_id:	1,
		task_id:		"2_0",
		task_name:		"Categories",
		child_task_id:	"",
	};
	$scope.api_url = "https://platform.mybluemix.net";
	$scope.sort = {
		order:	"asc",
		key:	"name"
	};

	$scope.user = {};
	$scope.data = {};
	$scope.html = "";
	
	$scope.init = function() {
		var parser = $window.location;
		if(parser.search) {
			var search_url = utilityService.getJsonFromUrl(parser);
			console.log("search url params>>>", search_url);
			if(typeof search_url.page_id != "undefined") {
				$scope.config.page_id = parseInt(search_url.page_id);
			}
		}
		//$localStorage.access_token = "1495553036558.phux04parvayk3xr";
		//$localStorage.user_id = "2c7e2220cb312aebfbe1b283d45d35db";
		console.log('access_token>>> ' + $localStorage.access_token)
		console.log('user_id>>> ' + $localStorage.user_id)
		//dbService.doSync();
		
		$scope.is_test = true;
		$scope.is_test = false;
		$scope.is_template = true;
		$scope.is_template = false;
		if($scope.is_template){
			$scope.loadTemplate();
		}
		else {
			if(!$localStorage.access_token){console.log("go login>>>");
				$scope.config.page_id = 1;
				$scope.config.from_page_id = 0;
				$scope.goPage($scope.config.page_id);
			}
			else {
				$scope.goPage($scope.config.page_id);
			}
			$scope.updateGetUserTask();
		}
	};
	//
	$scope.getPageDetail = function() {console.log("get detail>>>");
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
		$scope.details = utilityService.sortByKey(myDetail, $scope.sort.key, $scope.sort.order);
	};
	$scope.setConfig = function() {
		var task_info = myService.getTaskInfo();
		$scope.config.from_page_id = task_info.from_page_id;
		$scope.config.task_id = task_info.task_id;
		$scope.config.task_name = task_info.task_name;
		$scope.config.child_task_id = task_info.child_task_id;
		console.log("$scope.config>>>", $scope.config);
		$scope.title = $scope.config.task_name;
		var user_info = myService.getUserInfo();
		if(typeof user_info != "undefined"
				&& typeof user_info.type != "undefined"
				&& typeof user_info.type.admin != "undefined"
				&& user_info.type.admin == "admin") {
			$scope.isAdmin = true;
		}
		else {
			$scope.isAdmin = false;
		}
		$scope.getPageDetail();
		console.log("call detail>>>");
	};
	$scope.setPage = function() {
		$scope.setConfig();
		var header_html = myService.getTemplateHtml("header");
		var detail_html = myService.getTemplateHtml("detail");
		var footer_html = myService.getTemplateHtml("footer");
		$scope.html = header_html + detail_html + footer_html;
		
		var js_template = myService.getTemplateJs();
		//console.log($scope.html);
		if (!$scope.$$phase){
			$scope.$apply();
		}
		eval(js_template);
		utilityService.setBusy(false);
	};
	$scope.goPage = function(page_id) {
		utilityService.setBusy(true);
		console.log("go to page>>>"+ page_id);
		//console.log("$scope.user_id>>>"+ $scope.user_id);
		$scope.config.page_id = page_id;
		//console.log($scope.config);
		$scope.details = [];
		$scope.data = {};
		
		if($scope.is_test) {
			for(ind=0;ind<samplePages.length;ind++){
				if(samplePages[ind].page_id == page_id){
					myService.apiResult = samplePages[ind];
					break;
				}
			}
			if(page_id == 1){
				$localStorage.access_token = myService.apiResult.access_token;
			}
			$scope.setPage();
		}
		else {
			//if(page_id == 1 || page_id == 11){
				HttpService.getServerPage(page_id).then(function(result) {
					console.log("server page response>>>", result);
					$scope.config.page_id = result.page_id;
					if($scope.config.page_id == 1){
						$localStorage.access_token = result.access_token;
					}
					myService.apiResult = result;
					$scope.setPage();
				});
			/*}
			else {
				dbService.getLocalPage(page_id).then(function(result) {
					console.log("local page result>>>", result);
					if(typeof result.error != "undefined" && result.error) {
						if(page_id == 2) {
							utilityService.setBusy(false);
							utilityService.setBusy(true, "Please check your internet connection and try again.");
						}
						else {
							utilityService.setBusy(false);
							utilityService.setBusy(true, "Not synced.");
							$timeout(function() {
								$scope.goPage($scope.config.from_page_id);
							}, 1000);
						}
					}
					else {
						dbService.synced = 1;
						$scope.config.page_id = page_id;
						myService.apiResult = result;
						$scope.setPage();
					}
				});
			}*/
		}
	};
	$scope.getPage = function() {
		utilityService.setBusy(true);
		console.log("get page>>>"+ $scope.config.page_id);
		//console.log("$scope.user_id>>>"+ $scope.user_id);
		//console.log($scope.config);
		$scope.details = [];
		$scope.data = {};
		
		HttpService.getServerPage($scope.config.page_id).then(function(result) {
			console.log("get server page response>>>", result);
			myService.apiResult = result;
			$scope.setPage();
		});
	};
	$scope.updateGetUserTask = function() {
		var update_interval = 36000000;
		$interval(function() {
			console.log("dbService.synced>>>", dbService.synced);
			if(dbService.synced && $localStorage.user_id) {
				dbService.synced = 0;
				console.log("update get user task>>>");
				
				//get user_task list where user_task.dirty=true
				dbService.getDirtyUserTask().then(function(result) {
					console.log("dirty user task result>>>", JSON.stringify(result));
					var user_task_list = [];
					for(var ind=0; ind<result.length; ind++){
						var user_task = result[ind];
						user_task_list[ind] = {
							"task_id": user_task.task_id,
							"user_id": $localStorage.user_id,
							"page_id": user_task.page_id,
							"synchronized": 0,
							"status": 0,
							"count": {
							  "active": 1,
							  "unread": 0
							}
						};
					}
					console.log("updateGetUserTask", user_task_list);
					HttpService.updateGetUserTask(user_task_list).then(function(result) {
						console.log("update get user task response>>>", result);
						if(result.status == 200) {
							var update_task_list = result.data;
							HttpService.updateGetPages(update_task_list).then(function(result) {
								console.log("update get page response>>>", result);
								if(result.status == 200) {
									var update_pages = result.data;
									for(var ind=0; ind<update_pages.length; ind++){
										var update_page = update_pages[ind];
										dbService.updateLocalPage(update_page).then(function(result) {
											console.log("update local page response>>>", result);
											if(update_page.page_id == $scope.config.page_id) {
												dbService.synced = 1;
												myService.apiResult = result;
												$scope.data = {};
												$scope.setPage();
											}
										});
									}
									dbService.synced = 1;
								}
								else {
									dbService.synced = 1;
								}
							});
						}
						else {
							dbService.synced = 1;
						}
					});
				});
				
			}
		}, update_interval);
		
		
		
	};
	
	$scope.loadTemplate = function(){
		$scope.config = {
			page_id:		2,
			from_page_id:	1,
			task_id:		"2_0",
			task_name:		'Categories'
		};
		console.log("template page>>>"+ $scope.config.page_id);
		
		$scope.details = [];
		for(ind=0; ind<samplePages.length; ind++){
			if(samplePages[ind].page_id == $scope.config.page_id){
				myService.apiResult = samplePages[ind];
				break;
			}
		}
		$scope.setConfig();
		var templateUrl = "templates/category.html";
		$templateRequest(templateUrl).then(function(template) {
			//console.log(template)
			$scope.html = template;
		}, function(err) {
			
		});
		var templateUrl = "templates/category.js";
		$templateRequest(templateUrl).then(function(template) {
			//console.log(template)
			eval(template);
		}, function(err) {
			
		});
	};
	
	$scope.common_request_handler = function(request_data) {
		request_data.user_id = $localStorage.user_id;
		request_data.access_token = $localStorage.access_token;
		
		var api_url = request_data.api_url || $scope.api_url+"/master_api_handler";
		var api_mode = request_data.api_mode || "GET";
		var api_type = request_data.api_type || "";
		var api_next_fn = request_data.api_next_fn || "";
		var api_offline_queue = request_data.api_offline_queue || "";
		var api_offline_fn = request_data.api_offline_fn || "";
		var api_on_error_fn = request_data.api_on_error_fn || "";
		
		delete request_data["api_url"];
		delete request_data["api_mode"];
		delete request_data["api_next_fn"];
		delete request_data["api_on_error_fn"];
		delete request_data["api_offline_queue"];
		delete request_data["api_offline_fn"];
		console.log("request_data>>>", request_data);
		
		var res_data = "";
		api_type=api_type.toUpperCase();
		switch(api_type) {
			case "ADD_DETAIL": {
				api_offline_queue = true;
				api_offline_fn = "mark_detail_pending";
				api_next_fn = "$scope.getPage()";
				api_on_error_fn = "add_error_fn";
				api_mode = "POST";
				break;
			}
			case "DELETE_DETAIL": {
				api_offline_queue = true;
				api_offline_fn = "mark_detail_pending";
				api_next_fn = '$scope.deleteDetail(request_data)';
				api_on_error_fn = "delete_error_fn";
				api_mode = "POST";
				break;
			}
			case "GET_PAGE": {
				api_offline_queue = false;
				api_offline_fn = "mark_page_pending";
				api_next_fn = "";
				api_on_error_fn = "get_error_fn";
				api_mode = "GET";
				break;
			}	
			case "UPDATE_GET_USER_TASK": {
				api_offline_queue = false;
				api_offline_fn = "";
				api_next_fn = "";
				api_on_error_fn = "";
				api_mode = "GET";
				break;
			}	
			case "UPDATE_GET_PAGES": {
				api_offline_queue = false;
				api_offline_fn = "";
				api_next_fn = "";
				api_on_error_fn = "";
				api_mode = "GET";
				break;
			}		
			default: {
				api_offline_queue = false;
				api_offline_fn = "";
				api_next_fn = '$scope.defaultNextFn(request_data, res_data)';
				api_on_error_fn = "";
				api_mode = "GET";
				break;
			}
		}
		var isOnline = HttpService.isOnline();
		if(isOnline) {
			utilityService.setBusy(true, "Processing...");
			var headers = {"Content-Type": "application/json"};
			var config = {headers:headers};
			api_mode = api_mode.toUpperCase();
			if(api_mode == "POST"){
				$http.post(api_url, request_data, config).then(function(res) {
					var res_data = res.data;
					console.log("res_data>>>", res_data);
					if(api_next_fn) {
						eval(api_next_fn);
					}
					utilityService.setBusy(false);
				}, function(err) {
					console.log("err>>>", err);
					if(api_on_error_fn) {
						eval(api_on_error_fn);
					}
					utilityService.setBusy(false);
				});
			}
			else if(api_mode == "GET") {
				config.params = request_data;
				$http.get(api_url, config).then(function(res){
					var res_data = res.data;
					console.log("res_data>>>", res_data);
					eval(api_next_fn);
					utilityService.setBusy(false);
				}, function(err) {
					console.log("err>>>", err);
					utilityService.setBusy(false);
				});
			}
			else {
				console.log("warning: api_mode is missing.");
				utilityService.setBusy(false);
			}
		}
		else {//offline
			if(api_offline_queue) {//save to queue
				
			}
			if(api_offline_fn) {
				eval(api_offline_fn);
			}
		}
	}
	//custom js
	$scope.logout = function() {
		//$localStorage.$reset();
		$localStorage.access_token = null;
		$scope.goPage(1);
	};
	$scope.editUser = function(){
		$scope.config.from_page_id = 2;
		$scope.config.task_name = "User edit";
		var page_id = 14;
		$scope.goPage(page_id);
	};
	$scope.sortDetail = function() {console.log("$scope.sort>>>", $scope.sort);
		$scope.sort.order = ($scope.sort.order == "asc")?"desc":"asc";
		$scope.details = utilityService.sortByKey($scope.details, $scope.sort.key, $scope.sort.order);
	};
	$scope.subDetails = function(item){
		$scope.config.from_page_id = $scope.config.page_id;
		$scope.config.task_name = item.name;
		$scope.goPage(item.page_id);
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
	$scope.moreDetails = function(item) {
		$scope.config.from_page_id = $scope.config.page_id;
		$scope.config.task_name = item.name;
		var page_id = 16;
		$scope.goPage(page_id);
	};
	$scope.deleteDetail = function(request_data) {
		var item_id = request_data.table_data.id;
		var item_index = null;
		angular.forEach($scope.details, function(value, key) {
			if(value.id == item_id) {
				item_index = key;
			}
		});
		if(item_index != null) {
			$scope.details.splice(item_index, 1);
		}
	};
	$scope.defaultNextFn = function(request_data, res_data) {
		console.log(request_data, res_data);
	};
	//utils
	$scope.inputUp = function() {
		if (isIOS) $scope.data.keyboardHeight = 216;
		$timeout(function() {
		  $ionicScrollDelegate.scrollBottom(true);
		}, 300);
	};
	$scope.inputDown = function() {
		if (isIOS) $scope.data.keyboardHeight = 0;
		$ionicScrollDelegate.resize();
	};
	$scope.closeKeyboard = function() {
		// cordova.plugins.Keyboard.close();
	};
	//init
	$scope.init();
});