DomenowApp.factory('User', function ($q) {
  'use strict';
	
	var user = this;
	user.remoteDbName = 'users';
	user.localDbName = 'user_db';

	user.username = "37924750-e42d-41f1-b52e-f70ee3d5e012-bluemix";
    user.password = "128d25e448350669a1c8561528400862f7540da2529a948ab16cb5f26a6675b8";
    user.remote = "https://" +user.username+":"+user.password+"@"+user.username+".cloudant.com";
    user.syncDBURL = user.remote+"/"+user.remoteDbName;
	user.syncOptions = {
      live: true,
      retry: true
    };
	user.dbOptions = {revs_limit: 1, auto_compaction: true};
	user.localDb = new PouchDB(user.localDbName, user.dbOptions);
	
	user.synced = -1;
	user.doSync = function () {
		console.log("user db sync started>>>");
		
		user.localDb.sync(user.syncDBURL, user.syncOptions)
			.on('change', function (info) {
				//console.log("user db change", info);
			}).on('paused', function (err) {
				//console.log("user db sync paused>>>", err);
			}).on('active', function () {
			   //console.log("replicate resumed");
			}).on('denied', function (err) {
			   //console.log("a document failed to replicate");
			}).on('complete', function (info) {
			   //console.log("user db sync completed>>>", info);
			}).on('error', function (err) {
			   //console.log("handle error");
			});
	};
	return user;	
});
DomenowApp.factory('Detail', function ($filter, $q) {
  'use strict';
	
	var detail = this;
	var remoteDbName = 'details';
	var localDbName = 'detail_db';
	detail.doc = null;
	detail.collection = [];
	
	detail.username = "37924750-e42d-41f1-b52e-f70ee3d5e012-bluemix";
    detail.password = "128d25e448350669a1c8561528400862f7540da2529a948ab16cb5f26a6675b8";
    detail.remote = "https://" +detail.username+":"+detail.password+"@"+detail.username+".cloudant.com";
    detail.syncDBURL = detail.remote+"/"+remoteDbName;
	detail.syncOptions = {
      live: true,
      retry: true
    };
	var dbOptions = {revs_limit: 1, auto_compaction: true};
	detail.localDb = new PouchDB(localDbName, dbOptions);
	
	detail.synced = -1;
	detail.doSync = function () {
		console.log("detail db sync started>>>");
		
		detail.localDb.sync(detail.syncDBURL, detail.syncOptions)
			.on('change', function (info) {
				//console.log("detail db change", info);
			}).on('paused', function (err) {
				//console.log("detail db sync paused>>>", err);
			}).on('active', function () {
			   //console.log("replicate resumed");
			}).on('denied', function (err) {
			   //console.log("a document failed to replicate");
			}).on('complete', function (info) {
			   //console.log("detail db sync completed>>>", info);
			}).on('error', function (err) {
			   //console.log("handle error");
			});
	};
	function getLocalData() {
		var lDb = detail.localDb.allDocs({include_docs: true});
		return lDb.then(function (result) {
			//console.log(result);
			detail.collection = [];
			
			result.rows.forEach(function (row) {
			  detail.collection.push(row.doc);
			});
			return detail.collection;
		});
	};
	function allData(query) {
		return getLocalData().then(function(result) {
			return $filter('filter')(result, query, true);
		});
	};
	detail.getPage = function(page_id) {
		var query = {page_id: page_id};
		return allData(query).then(function(result) {
			return result;
		});
	};
	this.updateData = function(updateObj) {
		var updateDoc = [ {title : 'Lisa Says', _id: 'doc1', _rev: '65-ec428994856c1e69ba843841ca08c500'},
			{title : 'Space Oddity', _id: 'doc2', _rev: '11-0697b3a2f2a7c948a967c7f92bb8c1ba'}];
		console.log(updateDoc);
		
		return this.localDb.bulkGet({
			docs: [
			  { id: "doc-that-exists"},
			  { id: "doc-that-does-not-exist"},
			  { id: "doc-that-exists"}
			]
		}).then(function (result) {
		  console.log(result);
		  return result;
		}).catch(function (err) {
		  console.log(err);
		});
	};
	return detail;	
});
DomenowApp.factory('Task', function($q) {
  'use strict';
	
	var task = this;
	this.remoteDbName = 'task_table';
	this.localDbName = 'task_db';

	this.username = "37924750-e42d-41f1-b52e-f70ee3d5e012-bluemix";
    this.password = "128d25e448350669a1c8561528400862f7540da2529a948ab16cb5f26a6675b8";
    this.remote = "https://" +this.username+":"+this.password+"@"+this.username+".cloudant.com";
    this.syncDBURL = this.remote+"/"+this.remoteDbName;
	this.syncOptions = {
      live: true,
      retry: true
    };
	this.dbOptions = {revs_limit: 1, auto_compaction: true};
	this.localDb = new PouchDB(this.localDbName, this.dbOptions);
	
	this.synced = -1;
	this.doSync = function () {
		console.log("task db sync started>>>");
		
		task.localDb.sync(task.syncDBURL, task.syncOptions)
			.on('change', function (info) {
				//console.log("task db change", info);
			}).on('paused', function (err) {
				//console.log("task db sync paused>>>", err);
			}).on('active', function () {
			   //console.log("replicate resumed");
			}).on('denied', function (err) {
			   //console.log("a document failed to replicate");
			}).on('complete', function (info) {
			   //console.log("task db sync completed>>>", info);
			}).on('error', function (err) {
			   //console.log("handle error");
			});
	};

	this.getData = function(task_id) {
		return task.localDb.get(task_id).then(function(doc) {
			return doc;
		});
	};
	return task;	
});
DomenowApp.factory('Template', function($q, $filter, utilityService) {
  'use strict';
	
	var template = this;
	this.remoteDbName = 'templates';
	this.localDbName = 'template_db';

	this.username = "37924750-e42d-41f1-b52e-f70ee3d5e012-bluemix";
    this.password = "128d25e448350669a1c8561528400862f7540da2529a948ab16cb5f26a6675b8";
    this.remote = "https://" +this.username+":"+this.password+"@"+this.username+".cloudant.com";
    this.syncDBURL = this.remote+"/"+this.remoteDbName;
	this.syncOptions = {
      live: true,
      retry: true
    };
	this.dbOptions = {revs_limit: 1, auto_compaction: true};
	this.localDb = new PouchDB(this.localDbName, this.dbOptions);
	
	this.synced = -1;
	this.getLocalData = function() {
		var lDb = this.localDb.allDocs({include_docs: true});
		return lDb.then(function (result) {
			//console.log(result);
			var collection = [];
			
			result.rows.forEach(function (row) {
			  collection.push(row.doc);
			});
			return collection;
		});
	};
	this.allData = function() {
		return this.getLocalData().then(function(result) {
			return result;
		});
	};
	this.getData = function(query) {
		return this.allData().then(function(result) {
			var template = {};
			template.header = $filter('filter')(result, {_id: query.header_id}, true);
			template.detail = $filter('filter')(result, {_id: query.detail_id}, true);
			template.footer = $filter('filter')(result, {_id: query.footer_id}, true);
			return template;
		});
	};
	this.updateData = function(updateObj) {
		var updateDoc = [updateObj.header, updateObj.detail, updateObj.footer];
		return this.localDb.bulkGet({
			docs: [
			  {id: updateObj.header._id},
			  {id: updateObj.detail._id},
			  {id: updateObj.footer._id}
			]
		}).then(function (bulkDocs) {
			var results = bulkDocs.results;
			if(typeof results[0].docs[0].ok != "undefined"){//update
				updateObj.header._rev = results[0].docs[0].ok._rev;
				updateObj.detail._rev = results[1].docs[0].ok._rev;
				updateObj.footer._rev = results[2].docs[0].ok._rev;
				console.log("template updateDoc>>>", updateDoc);
				return template.localDb.bulkDocs(updateDoc);
			}
			else {//create template
				return template.localDb.bulkDocs(updateDoc)
			}
		}).catch(function (err) {
		  console.log(err);
		});
	};
	return template;	
});
DomenowApp.factory('Usertask', function($q, $filter, utilityService) {
  'use strict';
	
	var usertask = this;
	this.remoteDbName = 'user_task';
	this.localDbName = 'user_task_db';

	this.username = "37924750-e42d-41f1-b52e-f70ee3d5e012-bluemix";
    this.password = "128d25e448350669a1c8561528400862f7540da2529a948ab16cb5f26a6675b8";
    this.remote = "https://" +this.username+":"+this.password+"@"+this.username+".cloudant.com";
    this.syncDBURL = this.remote+"/"+this.remoteDbName;
	this.syncOptions = {
      live: true,
      retry: true
    };
	this.dbOptions = {revs_limit: 1, auto_compaction: true};
	this.localDb = new PouchDB(this.localDbName, this.dbOptions);
	
	this.synced = -1;
	this.doSync = function () {
		console.log("usertask db sync started>>>");
		
		usertask.localDb.sync(this.syncDBURL, this.syncOptions)
			.on('change', function (info) {
				//console.log("usertask db change", info);
			}).on('paused', function (err) {
				//console.log("usertask db sync paused>>>", err);
			}).on('active', function () {
			   //console.log("replicate resumed");
			}).on('denied', function (err) {
			   //console.log("a document failed to replicate");
			}).on('complete', function (info) {
			   //console.log("usertask db sync completed>>>", info);
			}).on('error', function (err) {
			   //console.log("handle error");
			});
		utilityService.setBusy(false);
	};
	
	function getLocalData() {
		var lDb = usertask.localDb.allDocs({include_docs: true});
		return lDb.then(function (result) {
			//console.log(result);
			var collection = [];
			
			result.rows.forEach(function (row) {
			  collection.push(row.doc);
			});
			return collection;
		});
	};
	function allData() {
		return getLocalData().then(function(result) {
			return result;
		});
	};
	this.getData = function(query) {
		return allData().then(function(result) {
			var obj = {};
			obj.header = $filter('filter')(result, {_id: query.header_id}, true);
			obj.detail = $filter('filter')(result, {_id: query.detail_id}, true);
			obj.footer = $filter('filter')(result, {_id: query.footer_id}, true);
			return obj;
		});
	};
	this.updateData = function(updateObj) {
		var id = updateObj._id;
		return usertask.localDb.get(id).then(function(doc) {
		  console.log("user task update data>>>", updateObj);
		  return usertask.localDb.put(updateObj);
		}).then(function(response) {
		  return response;
		}).catch(function (err) {
		  console.log(err);
		});
	};
	this.getUserTask = function(page_id) {
		console.log("get local user_task page_id: ", page_id);
		var userTaskObj = {};
		return this.localDb.query(function(doc, emit) {
		  if (doc.page_id === page_id) {
			emit(doc);
		  }
		}).then(function (result) {
			if(result.rows.length>0) {
				userTaskObj = result.rows[0].key;
				return userTaskObj;
			}
			else {
				//auto-generate an _id
				return usertask.localDb.post({
				  "page_id":		page_id,
				  "synchronized":	0
				}).then(function (res) {
				  userTaskObj = {
					"_id":			res.id,
					"_rev":			res.rev,
					"page_id":		page_id,
					"synchronized":	0
				  };
				  return userTaskObj;
				}).catch(function (err) {
				  console.log(err);
				});
			}
		}).catch(function (err) {
		  console.log(err);
		});
	};
	
	this.getDirtyList = function() {
		var dirtyList = [];
		return this.localDb.query(function(doc, emit) {
		  if (doc.dirty === 1) {
			emit(doc);
		  }
		}).then(function (result) {
			for(var ind=0; ind<result.rows.length; ind++) {
				dirtyList[ind] = result.rows[ind].key;
			}
			return dirtyList;
		}).catch(function (err) {
		  console.log(err);
		});
	};
	return usertask;
});
DomenowApp.factory('Localpages', function($q, $filter, utilityService, Template) {
  'use strict';
	
	var localpage = this;
	this.localDbName = 'local_page_db';
	this.dbOptions = {revs_limit: 1, auto_compaction: true};
	this.localDb = new PouchDB(this.localDbName, this.dbOptions);
	
	this.synced = -1;
	
	function getLocalData() {
		var lDb = localpage.localDb.allDocs({include_docs: true});
		return lDb.then(function (result) {
			//console.log(result);
			var collection = [];
			
			result.rows.forEach(function (row) {
			  collection.push(row.doc);
			});
			return collection;
		});
	};
	function allData() {
		return getLocalData().then(function(result) {
			return result;
		});
	};
	this.getData = function(query) {
		return allData().then(function(result) {
			var obj = {};
			obj.header = $filter('filter')(result, {_id: query.header_id}, true);
			obj.detail = $filter('filter')(result, {_id: query.detail_id}, true);
			obj.footer = $filter('filter')(result, {_id: query.footer_id}, true);
			return obj;
		});
	};
	this.updatePageData = function(pageObj) {
		pageObj._id = pageObj._id.toString();
		return this.localDb.query(function(doc, emit) {
		  if (doc._id == pageObj._id) {
			emit(doc);
		  }
		}).then(function (result) {
			if(result.rows.length>0) {
				var key = result.rows[0].key;
				pageObj._rev = key._rev;
				return localpage.localDb.put(pageObj);
			}
			else {
				return localpage.localDb.put(pageObj);
			}
		}).catch(function (err) {
		  console.log(err);
		});
	};
	this.getPage = function(page_id) {
		page_id = page_id.toString();
		return this.localDb.get(page_id).then(function(doc) {
			console.log("get local page result>>>", doc)
			doc.page_id = doc._id;
			var query = {
				header_id: doc.task.header_template_id,
				detail_id: doc.task.detail_template_id,
				footer_id: doc.task.footer_template_id
			};
			return Template.getData(query).then(function(res) {
				console.log("Template result>>>", res);
				var templateObj = {
					header: res.header[0],
					detail: res.detail[0],
					footer: res.footer[0]
				};
				doc.task.template = templateObj;
				return doc;
			});
		}).catch(function (err) {
		  console.log(err);
		  return err;
		});
	};
	return localpage;
});