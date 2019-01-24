var orderscreen = angular.module('orderApp', []);
orderscreen.controller('OrderController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        "use strict";
        var orderTitle = 'List Of Medical Device Orders';

        var url_params = gf_getQueryParams();

        $scope.today = gf_todayDate();

        window.WebSocket = window.WebSocket || window.MozWebSocket;
        if (!window.WebSocket) {
            return;
        }
        var connection = new WebSocket('ws://' + source_ip + ':1337');
//    var connection = new WebSocket('ws://127.0.0.1:1337');
        connection.onopen = function () {
            $('#socket_status').text('socket is connected')
        };
        connection.onerror = function (error) {
            $('#socket_status').text('socket is down!')
        };

        connection.onmessage = function (message) {
            console.log(message);
            $('#emptyrow').hide();
            try {
                var json = JSON.parse(message.data);

                switch (json.type) {
                    case 'update_order':
                        updateOrder(json.data);

                        break;
                    case 'new_order':
                        createNewOrder(json.data);
                        break;
                }
            } catch (e) {
                return;
            }
        };

        setInterval(function () {
            if (connection.readyState !== 1) {
                status.text('Error');
                input.attr('disabled', 'disabled').val('Unable to communicate with the WebSocket server.');
            }
        }, 3000);


        function btnStatus(status) {
            var btn_name = '';
            switch (status.toLowerCase()) {
                case 'new':
                    btn_name = 'btn-primary';
                    break;
                case 'in_progress':
                    btn_name = 'btn-warning';
                    break;
                case 'completed':
                    btn_name = 'btn-success';
                    break;
                case 'discontinue':
                    btn_name = 'btn-danger';
                    break;
            }
            return btn_name;
        }


        var updateOrder = function (data) {
            if (data.hasOwnProperty('order_status_current')) {
                var currentStatus = data.order_status_current.toLowerCase();
                var nextStatus = data.order_status_to.toLowerCase();
                var status_text = nextStatus.toLowerCase().split('_').join(' ');

                $('#' + currentStatus + '_' + data.his_order_id)
                        .text(status_text)
                        .removeClass(btnStatus(currentStatus))
                        .addClass(btnStatus(nextStatus));

                $('#' + currentStatus + '_' + data.his_order_id).attr("id", nextStatus + '_' + data.his_order_id);

                var nextTotal = parseInt($('#total_' + nextStatus.toLowerCase()).html()) + 1;

                $('#total_' + nextStatus.toLowerCase()).text(nextTotal);
                $('#total_' + currentStatus.toLowerCase()).text((parseInt($('#total_' + currentStatus).text()) - 1));
            }
        };

        var createNewOrder = function (data) {
            var totalAll = parseInt($('#total_all').text());
            var html = '<tr>';
            html += '<td class=\'text-center\'>' + (totalAll + 1) + '</td>';
            html += '<td class=\'text-center\'>' + data.patient_id + '</td>';
            html += '<td>' + data.patient_name + '</td>';
            html += '<td>' + data.procedure + '</td>';
            html += '<td><div class="btn btn-primary btn-lg btn-block" id="new_' + data.his_order_id + '">NEW</div></td>';
            html += '</tr>';
            var totalNew = parseInt($('#total_new').text());
            $('#total_all').text((totalAll + 1));
            ;
            $('#total_new').text((totalNew + 1));
            $('#list_of_orders tbody tr:last').after(html);
        };

        var updateOrderToSocket = function () {
            console.log('ok');
        }


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
                        $scope.device_name = device.device_name;
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

//        var performEndo = function (endo) {
//            $http({
//                headers: {
//                    'Content-Type': 'application/json'
//                },
//                url: url_internal_device + '/device/update-order',
//                method: "PUT",
//                data: JSON.stringify(endo)})
//                    .then(function (response) {
//                    });
//        };

        var sendRequestToEndo = function (endo_data) {
            var params  = gf_getQueryParams();
            var device_code = params.device;
            var order_url = '';
            switch(device_code){
                case 'edp001':
                    order_url = url_internal_device + '/endo/new-order';
                    break;
                case 'edp002':
                    order_url = url_internal_device + '/endo-olympus/new-order';
                    break;
            }
            $http({
                headers: {
                    'Content-Type': 'text/plain'
                },
                url: order_url,
                method: "POST",
                data: JSON.stringify(endo_data)})
                    .then(function (response) {
                        console.log(response.data);
                    });
        };

        $scope.performTask = function (id) {
            
            $http.get(url_device_integration + '/orders/orderlist?order_id=' + id)
                    .then(function (response) {
                        var data = response.data.entry[0];
                        $scope.patient = data;
                        var endo_data = {
                            patient_id: data.patient_id,
                            his_order_id: id,
                            patient_ic: '',
                            patient_name: data.patient_name,
                            patient_dob : data.patient_dob_f,
                            patient_gender: data.patient_gender_f
                        };
                        $('.modal').modal('show');
                        sendRequestToEndo(endo_data);
                        $scope.his_order_id_endo = id;
//                        var endo = {patient_id: data.patient_id, his_order_id: id};
//                        performEndo(endo);
                        $('#action_' + id).html('PROCESSING');
                        $('#action_' + id).removeClass('btn-primary');
                        $('#action_' + id).addClass('btn-warning');
                        $scope.btn_complete = "COMPLETE";
                    });
        };

        $scope.completeEndoscopy = function (id) {
            $scope.btn_complete = "PLEASE WAIT...";
            $http.put(url_internal_device + '/endo/end-process/' + id)
                    .then(function (response) {
                        $('.modal').modal('hide');
                        updateOrderToSocket();
                    });
        };

        function karlstorz(id) {
            $scope.btn_complete = "PLEASE WAIT...";
            $http.put(url_internal_device + '/endo/end-process/' + id)
                    .then(function (response) {
                        $('.modal').modal('hide');
                        updateOrderToSocket();
                    });
        }

        function olympusEndo(id) {
            var olv_data = {
                his_order_id: id,
                device_code: url_params.device
            };
            $http({
                headers: {
                    'Content-Type': 'text/plain'
                },
                url: url_internal_device + '/endo-olympus/end-process',
                method: "POST",
                data: JSON.stringify(olv_data)})
                    .then(function (response) {
                        console.log(response);
                        $('.modal').modal('hide');
                    });
        }
        ;

        $scope.completeEndoscopyDevice = function (id) {
            switch (url_params.device) {
                case 'edp001':
                    karlstorz(id);
                    break;
                case 'edp002':
                    olympusEndo(id);
                    break;
            }
        };



        var todayOrderSummary = function () {
            var params = '';
            if (url_params.hasOwnProperty('device')) {
                params += '?device=' + url_params.device;
            }
            var orderSummaryResult = '';
            $http.get(url_device_integration + '/orders/order-summary' + params)
                    .then(function (response) {
                        orderSummaryResult = response.data.entry;

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
            var params = '?order_status=' + status;
            if (url_params.hasOwnProperty('device')) {
                params += '&device=' + url_params.device;
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

        $scope.deviceid = "edp001";
        $scope.emptyRow = 'No orders scheduled for today';
        $('#appBody').css('visibility', 'visible');

    }]);