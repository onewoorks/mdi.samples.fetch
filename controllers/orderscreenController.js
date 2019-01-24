var orderscreen = angular.module('orderApp', []);
orderscreen.controller('OrderController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        var orderTitle = 'List Of Medical Device Orders';

        var url_params = gf_getQueryParams();

        $scope.today = gf_todayDate();

        var deviceInfo = function () {
            $http.get(url_internal_device + '/device/info?code=' + url_params.device)
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
            $http.get(url_device_integration + '/orders/orderlist')
                    .then(function (response) {
                        $scope.orderlist = response.data.entry;
                        $scope.orderTitle = orderTitle;
                    });
        };

        var orderListDevice = function () {
            $http.get(url_device_integration + '/orders/orderlist?device=' + url_params.device)
                    .then(function (response) {
                        $scope.orderlist = response.data.entry;
                        deviceInfo();
                    });
        };

        var performEndo = function (endo) {
            $http({
                headers: {
                    'Content-Type': 'application/json'
                },
                url: url_internal_device + '/device/update-order',
                method: "PUT",
                data: JSON.stringify(endo)})
                    .then(function (response) {
                    });
        };
        
        var sendRequestToEndo = function (endo) {
            $http({
                headers: {
                    'Content-Type': 'application/json'
                },
                url: url_internal_device + '/device/update-order',
                method: "POST",
                data: JSON.stringify(endo)})
                    .then(function (response) {
                    });
        };

        $scope.performTask = function (id) {
            $http.get(url_device_integration + '/orders/orderlist?order_id=' + id)
                    .then(function (response) {
                        var data = response.data.entry[0];
                        $scope.patient = data;
                        $('.modal').modal('show');
                        $scope.his_order_id_endo = id;
                        var endo = {
                            patient_id: data.patient_id, 
                            his_order_id: id,
                            patient_ic: ''
                            
                        };
                        performEndo(endo);
                        $('#action_' + id).html('PROCESSING');
                        $('#action_' + id).removeClass('btn-primary');
                        $('#action_' + id).addClass('btn-warning');
                    });


        };

        $scope.completeEndoscopy = function (id) {
            $http.put(url_internal_device + '/endo/end-process/' + id)
                    .then(function (response) {
                        console.log(response);
                        $('.modal').modal('hide');
                        updateOrderToSocket();
                    });

        };

        var todayOrderSummary = function () {
            var params = '';
            if (url_params.hasOwnProperty('device')) {
                params += '?device='+url_params.device;
            }
            $http.get(url_device_integration + '/orders/order-summary'+params)
                    .then(function (response) {
                        var orderSummaryResult = response.data.entry;

                        var totalOrders = 0;
                        for (var key in orderSummaryResult) {
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
            var params = '?order_status='+status;
            if (url_params.hasOwnProperty('device')) {
                params += '&device='+url_params.device;
                $scope.dicom = 'hidden';
            }
            $http.get(url_device_integration + '/orders/orderlist' + params)
                    .then(function (response) {
                        var orderList = response.data.entry;
                        $scope.orderlist = orderList;
                        $scope.emptyRow = (orderList.length == 0) ? 'No order information for this status ' : '';
                        
                    });
        };

        if (url_params.hasOwnProperty('device')) {
            orderListDevice();
            todayOrderSummary();
        } else {
            orderList();
            $scope.tableAction = 'STATUS';
            $scope.nondicom = 'hidden';
            todayOrderSummary();
        }
        $scope.emptyRow = 'No orders scheduled for today';
        $('#appBody').css('visibility', 'visible');

    }]);