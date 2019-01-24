var patientPickerScreen = angular.module('patientPickerApp',[]);

patientPickerScreen.controller('patientPickerController',['$scope','$http', function($scope,$http){
    
    var patientList = function(){
        $http.get(url_his_sample_data+'/patient/patient-info')
                .then(function(response){
                   var patientList = response.data.entry;
                   $scope.patientList = patientList;
                })
    }
    
    $scope.showmenu = function(patient){
        var id = patient;
        $('#linkage_'+id).slideDown();
    };
    
    $scope.offMenu = function(patient){
        var id = patient;
        $('#linkage_'+id).slideUp();
    };
    
    patientList();
    
}]);