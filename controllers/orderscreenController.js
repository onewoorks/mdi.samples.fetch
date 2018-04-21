var orderscreen = angular.module('orderApp', []);
orderscreen.controller('OrderController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        var orderTitle = 'List Of Medical Device Orders';
//	var url = 'http://172.19.64.7:8081/integration/orders/orderlist';
        var url = 'http://localhost:8081/integration/orders/orderlist';
        var url_integration = 'http://localhost:8081/integration';
        var url_internal = 'http://localhost:8082/internal-device';
        var url_his_sample_data = 'http://localhost:8083/his-sample';

        var location = $location.absUrl();
        var result = new Array();

        if (location.includes('?')) {
            var uri = location.split('?');
            var params = uri[1].split('&');

            angular.forEach(params, function (k, v) {
                var each = k.split('=');
                var key = '{"' + each[0] + '":"' + each[1] + '"}';
                result.push(JSON.parse(key));
            });
        }
        
        $scope.today = gf_todayDate();

        var patientInfo = function (patient_id) {
            $http.get(url_his_sample_data + '/patient/patient-info?patient_id=' + patient_id)
                    .then(function (response) {
                        var patient_info = response.data.entry;
                        $scope.patient_name = patient_info.patient_name;
                        $scope.patient_identification_no = patient_info.identification_no;
                        $scope.patient_dob = patient_info.date_of_birth;
                        $scope.patient_gender = patient_info.gender;
                    });
        };

        var deviceInfo = function () {
            $http.get(url_internal + '/device/info?code=' + result[0].device)
                    .then(function (response) {
                        var device = response.data.entry;
                        var online = device.online_status;
                        var online_indicator = '';
                        if (online.toLowerCase() == 'online') {
                            online_indicator = 'online';
                        } else {
                            online_indicator = 'offline';
                        }
                        $('.online-indicator').addClass(online_indicator);
                        $scope.device_online = online;

                        $scope.orderTitle = 'Order List For ' + device.medical_device;
                        $scope.medical_device = device.medical_device;
                        if (device.dicom_worklist == 1) {
                            $('.non-dicom-worklist').hide();
                        } else {
                            $('.dicom-worklist').hide();
                        }

                        switch (device.medical_device) {
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

        var orderList = function () {
            $http.get(url)
                    .then(function (response) {
                        $scope.orderlist = response.data.entry;
                        $scope.orderTitle = orderTitle;
                    });
        };

        var orderListDevice = function () {
            $http.get(url + '?device=' + result[0].device)
                    .then(function (response) {
                        $scope.orderlist = response.data.entry;
                        deviceInfo();
                    });
        };

        var performEndo = function (endo) {
            $http({
                headers: {
                    'Content-Type': 'application/json'},
                url: 'http://172.19.64.7:8082/internal-device/endo/deviceperform',
                method: "POST",
                data: JSON.stringify(endo)})
                    .then(function (response) {
                    });
        }

        $scope.performTask = function (id) {
            $http.get(url + '?order_id=' + id)
                    .then(function (response) {
                        var data = response.data.entry[0];
                        $scope.patient = data;
                        $('.modal').modal('show');
                        $scope.his_order_id_endo = id;
                        var endo = {patient_id: data.patient_id, his_order_id: id};
                        performEndo(endo);
                        $('#action_' + id).html('PROCESSING');
                        $('#action_' + id).removeClass('btn-primary');
                        $('#action_' + id).addClass('btn-warning');
                    });


        };

        $scope.completeEndoscopy = function (id) {
            $http.put(url_internal + '/endo/end-process/' + id)
                    .then(function (reponse) {
                        console.log('completeing endoscopy process ' + id);
                        $('.modal').modal('hide');
                    });

        };

        var todayOrderSummary = function () {
            $http.get(url_integration + '/orders/order-summary')
                    .then(function (response) {
                        var orderSummaryResult = response.data.entry;

                        var totalOrders = 0;
                        for (var key in orderSummaryResult){
                            if (orderSummaryResult.hasOwnProperty(key))
                            totalOrders += parseInt(orderSummaryResult[key]);
                            }
                        
                        var orderSummary = {
                            allOrders: totalOrders,
                            newOrder: orderSummaryResult.NEW,
                            inProgress: orderSummaryResult.IN_PROGRESS,
                            completed: orderSummaryResult.COMPLETED,
                            discontinue: orderSummaryResult.DISCONTINUE,
                        };
                        $scope.orderSummary = orderSummary;
                    });

        };

        $scope.statusClick = function (status) {
            $http.get(url_integration + '/orders/orderlist?order_status=' + status)
                    .then(function (response) {
                        var orderList = response.data.entry;
                        $scope.orderlist = orderList;
                        $scope.emptyRow = (orderList.length == 0) ? 'No order information for this status ' : '';
                    });
        }

        if (result.length) {
            orderListDevice();
        } else {
            orderList();
            $scope.tableAction = 'STATUS';
            $scope.nondicom = 'hidden';
            todayOrderSummary();
        }
        $scope.emptyRow = 'No orders scheduled for today';
        $('#appBody').css('visibility', 'visible');

    }]);