
var orderscreen = angular.module('orderApp', []);
orderscreen.controller('OrderController', ['$scope', '$http', '$location', function($scope, $http, $location) {
        var orderTitle = 'List Of Medical Device Orders';
//	var url = 'http://172.19.64.7:8081/integration/orders/orderlist';
        var url = 'http://localhost:8081/integration/orders/orderlist';
        var url_internal = 'http://localhost:8082/internal-device';
        
        var location = $location.absUrl();
        var result = new Array();
        var today = new Date();
        var stringMonth = ['January', 'February', 'March', 'April', 'May'];
        $scope.today = today.getDate() + ' ' + stringMonth[today.getMonth()] + ' ' + today.getFullYear() ;
        
        if(location.includes('?')){
            var uri = location.split('?');
            var params = uri[1].split('&');

            angular.forEach(params, function(k,v){
                var each = k.split('=');
                var key = '{"'+each[0]+'":"'+each[1]+'"}';
                result.push(JSON.parse(key)); 
            });
        }
        
        var deviceInfo = function(){
            $http.get(url_internal+'/device/info?code='+result[0].device)
                    .then(function(response){
                        var device = response.data.entry;
                        var online = device.online_status;
                        var online_indicator = '';
                        if(online.toLowerCase()=='online'){
                            online_indicator = 'online';
                        } else {
                            online_indicator = 'offline';
                        }
                        $('.online-indicator').addClass(online_indicator);
                        $scope.device_online = online;
                        
                        $scope.orderTitle = 'Order List For ' + device.medical_device;
                        $scope.medical_device = device.medical_device;
                        if(device.dicom_worklist==1){
                            $('.non-dicom-worklist').hide();
                        } else {
                            $('.dicom-worklist').hide();
                        }

                        switch(device.medical_device){
                            case 'SPIROMETER':
                                $scope.tableAction = 'STATUS';
                                $scope.footer = "STATUS WILL UPDATE WHEN RECEIVE A REPORT FROM SPIROMETER DEVICE";
                                break;
                            case 'ENDOSCOPY PROCESSOR':
                                $scope.tableAction = 'ACTION';
                                $scope.footer = "STATUS WILL UPDATE WHEN ENDOSCOPY MACHINE IS TURNED OFF";
                                break;
                            default:
                                $scope.tableAction = 'WORKLIST STATUS';
                                $scope.footer = "STATUS WILL UPDATE DEPENDING ON DICOM WORKLIST";
                                break;
                        }
                    });
        }
        
	var orderList = function(){
            $http.get(url)
                    .then(function(response) {
                        $scope.orderlist = response.data.entry;
                        $scope.orderTitle = orderTitle;
		});
        };
        
        var orderListDevice = function(){
            $http.get(url+'?device='+result[0].device)
                    .then(function(response){
                        $scope.orderlist = response.data.entry;
                        deviceInfo();
                    });
        };
        
        var performEndo = function(endo){
         $http({ 
                headers: {
                'Content-Type': 'application/json'}, 
                url: 'http://172.19.64.7:8082/internal-device/endo/deviceperform', 
                method: "POST", 
                data: JSON.stringify(endo)})
                    .then(function(response){
                    });   
        }
        
        $scope.performTask = function(id){
            $http.get(url+'?order_id='+id)
                    .then(function(response){
                        var data = response.data.entry[0];
                        $scope.patient = data;
                        $('.modal').modal('show');
                        var endo = {patient_id:data.patient_id,his_order_id:id};
                        performEndo(endo);
            });
            
            
        };
        
        if(result.length){
            orderListDevice();
        } else {
            orderList();
        }	
        
        
}]);