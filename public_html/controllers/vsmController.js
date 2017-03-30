var vsmApp = angular.module('vsmApp', []);
vsmApp.controller('VsmAppCtrl', ['$scope', '$http', function($scope, $http) {
	var url = 'http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/listpatientid/95746';
        
	var refresh = function() {
		$http.get('http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/listpatientid/95746').then(function(response) {
			console.log("I GET request data");
			$scope.vsmlist = response.data;
		});
	};
	
	refresh();
	
	$scope.add = function() {
		console.log($scope.vsm);
		
		$http.post('http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/listpatientid/95746', $scope.vsm).then(function(response) {
			console.log(response);
			refresh();
		});
	};
	
	$scope.remove = function(id) {
		console.log(id);
		
		$http.delete('http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/listpatientid/95746/' + id).then(function(response) {
			refresh();
		});
	};
	
	$scope.edit = function(id) {
		console.log(id);
		
		$http.get('http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/listpatientid/95746/' + id).then(function(response) {
			$scope.vsm = response.data;
		});
	};
	
	$scope.update = function() {
		console.log($scope.vsm._id);
		
		$http.put('http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/listpatientid/95746/' + $scope.vsm._id, $scope.vsm).then(function(response) {
			refresh();
		});
	};
	
	$scope.clear = function() {
		$scope.vsm = null;
	};
	
	// DEVICE http://127.0.0.1:9233/WelchAllyn/Device/GetDevices
	$scope.device = function() {
		$http.get('http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/patientid/95746').then(function(response) {
			console.log("I GET request data from DEVICE");
			var deviceArray = response.data;		
			$scope.vsm = {
					bmi: deviceArray.bmi,
					clinicianid: deviceArray.clinicianid,
					date: deviceArray.date,
					diastolic: deviceArray.diastolic,
					height: deviceArray.height,
					hr: deviceArray.hr,
					map: deviceArray.map,
					o2sat: deviceArray.o2sat,
					pain: deviceArray.pain,
					patientid: deviceArray.patientid,
					pulse: deviceArray.pulse,
					respiration: deviceArray.respiration,
					systolic: deviceArray.systolic,
					temperature: deviceArray.temperature,
					weight: deviceArray.weight
			};
		});
	};
	
}])