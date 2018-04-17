var indexApp = angular.module('indexApp', []);
indexApp.controller('IndexCtrl', ['$scope', '$http', function ($scope, $http) {
        console.log("Hello from indexController");

        var refresh = function () {
//            $http.get('https://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatienthiskkms/listpatientid/95746').then(function (response) {
//                console.log("I GET from RESTful API");
//                var vsms = response.data;
//                $scope.vsms = vsms;
//            });
        };

        refresh();

        $scope.add = function () {
            console.log($scope.vsm);

//            $http.post('https://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatienthiskkms', $scope.vsm).then(function (response) {
//                console.log(response);
//                refresh();
//            });
        };

        $scope.remove = function (id) {
            console.log(id);

//            $http.delete('https://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatienthiskkms/' + id).then(function (response) {
//                refresh();
//            });
        };

        $scope.edit = function (id) {
            console.log(id);

//            $http.get('https://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatienthiskkms/' + id).then(function (response) {
//                $scope.vsm = response.data;
//            });
        };

        $scope.update = function () {
            console.log($scope.vsm.id);

//            $http.put('https://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatienthiskkms/' + $scope.vsm.id, $scope.vsm).then(function (response) {
//                refresh();
//            });
        };

        $scope.clear = function () {
            $scope.vsm = null;
        };

        // DEVICE list -> https://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/listpatientid/95746
        // DEVICE latest reading -> https://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/patientid/95746
//        $scope.device = function () {
//            $http.get('https://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/patientid/95746').then(function (response) {
//                console.log("I GET request data from DEVICE");
//
//                var deviceArray = response.data;
//                $scope.vsm = {
//                    bmi: deviceArray.bmi,
//                    clinicianid: deviceArray.clinicianid,
//                    date: deviceArray.date,
//                    diastolic: deviceArray.diastolic,
//                    height: deviceArray.height,
//                    hr: deviceArray.hr,
//                    map: deviceArray.map,
//                    o2sat: deviceArray.o2sat,
//                    pain: deviceArray.pain,
//                    patientid: deviceArray.patientid,
//                    pulse: deviceArray.pulse,
//                    respiration: deviceArray.respiration,
//                    systolic: deviceArray.systolic,
//                    temperature: deviceArray.temperature,
//                    weight: deviceArray.weight
//                };
//            });
//        };
        
        $scope.searchEgl = function () {
            
            var patient_name = $scope.patient_name;
            var identification_no = $scope.identification_no;
            var relation = $scope.relationship;
            console.log("masuk search egl");
            $http.get('http://localhost:8080/RESTApiManager-0.0.1-SNAPSHOT/api/eglInfo/'+patient_name + '/'+identification_no+'/'+relation+'').then(function (response) {
                console.log("I GET request data from egl");

                var deviceArray = response.data;
                console.log(response.data);
                $scope.egl = {
                    ministry_name: deviceArray.emp_comp_name,
                    officer_name: deviceArray.emp_name,
                    identification_no: deviceArray.emp_ic,
                    salary_grade: deviceArray.emp_gred,
                    position: deviceArray.emp_job_title,
                    relationship: deviceArray.emp_relationship,
                    salary: deviceArray.emp_salary,
                    ref_no: deviceArray.o2sat,
                    entitlement: deviceArray.emp_entitlement_ward,
                    employer: deviceArray.emp_comp_name,
                    pulse: deviceArray.pulse,
//                    respiration: deviceArray.respiration,
//                    systolic: deviceArray.systolic,
//                    temperature: deviceArray.temperature,
//                    weight: deviceArray.weight
                };
            });
        };

    }]);