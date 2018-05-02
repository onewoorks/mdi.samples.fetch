
var newOrderScreen = angular.module('newOrderApp', ['oitozero.ngSweetAlert']);
newOrderScreen.controller('NewOrderController', ['$scope', 'SweetAlert', '$http', '$location', function ($scope, SweetAlert, $http, $location) {

        bSocket = window.WebSocket || window.MozWebSocket;
        if (!window.WebSocket) {
            content.html($('<p>',
                    {text: 'Sorry, but your browser doesn\'t support WebSocket.'}
            ));
            return;
        }
        
//        var connection = new WebSocket('ws://127.0.0.1:1337');
        var connection = new WebSocket('ws://'+source_ip+':1337');
        connection.onopen = function () {};
        connection.onerror = function (error) {};
        connection.onmessage = function (message) {};
        setInterval(function () {
            if (connection.readyState !== 1) {
                status.text('Error');
                input.attr('disabled', 'disabled').val(
                        'Unable to communicate with the WebSocket server.');
            }
        }, 3000);
        

        var newListSet = {};

        var order_by_preset = "IRWAN IBRAHIM";

        var url_params = gf_getQueryParams();
        var patient_id = url_params.patient_id;
        $scope.addToList = function () {
            var inputs = $('#new_order').serializeArray();
            var objInput = objectifyForm(inputs);
            var newAddToList = {
                date_start: date_formatter(objInput.date_start),
                duration: objInput.duration,
                frequency: objInput.frequency,
                instruction_description: objInput.instruction_description,
                no_of_time_hourly: objInput.no_of_time_hourly,
                order_name: objInput.order_name,
                order_time: "-",
                ordered_by: "IRWAN IBRAHIM",
                quantity: objInput.quantity,
                recurring: "0",
                status: "-",
                urgency: objInput.urgency
            };
            var patientOrderList = $scope.orderList;
            var newIndex = (patientOrderList.length);
            patientOrderList[newIndex] = newAddToList;
            $scope.orderList = patientOrderList;
            newListSet = newAddToList;
        };

        var submitOrder = function () {
            var order_id = new Date().valueOf();
            var patient = $scope.patient;
            var inputs = $('#new_order').serializeArray();
            var objInput = objectifyForm(inputs);
            var patient_id = patient.patient_id;
            var his_order_id = order_id;
            var order_date_time = dateonly_formatter(objInput.date_start);
            var order_description = objInput.order_name;
            var order_category = objInput.category;
            var relationship = "";
            var order_by = order_by_preset;
            var order_location = "WARD 9";
            var priority = "";
            var status = "SUBMITTED";
            var option = "";
            var attachment = "";
            var audit_trail = "";
            var patient_gender = patient.clean_gender;
            var patient_name = patient.patient_name;
            var patient_date_of_birth = patient.clean_dob;
            var device_code = objInput.device_code;
            var instruction_description = objInput.instruction_description;
            var add_to_list = {
                patient_id: patient_id,
                order_name: order_description,
                instruction_description: instruction_description,
                quantity: objInput.quantity,
                frequency: objInput.frequency,
                date_start: order_date_time,
                urgency: objInput.urgency,
                recurring: objInput.recurring,
                no_of_time_hourly: objInput.recurring,
                duration: objInput.duration,
                ordered_by: order_by,
                status: "SUBMITTED"
            };
            var coe_order = {
                patient_id: patient_id,
                his_order_id: his_order_id,
                order_date_time: order_date_time,
                order_description: order_description,
                order_category: order_category,
                relationship: relationship,
                order_by: order_by,
                order_location: order_location,
                priority: priority,
                status: status,
                option: option,
                attachment: attachment,
                audit_trail: audit_trail
            };
            var device_order = {
                patient: {
                    patient_id: patient_id,
                    patient_gender: patient_gender,
                    patient_name: patient_name,
                    patient_date_of_birth: patient_date_of_birth
                },
                order_data: {
                    his_order_id: his_order_id,
                    his_device_code: device_code,
                    his_order_dicipline: order_description,
                    his_appointment_date: order_date_time,
                    his_ordered_by: order_by
                }
            };
            $http({
                headers: {
                    'Content-Type': 'application/json'},
                url: url_his_sample_data + '/order/new-order',
                method: "POST",
                data: JSON.stringify(coe_order)})
                    .then(function (response) {
                        console.log('new order to his');
                        console.log(response);
                    });
            $http({
                headers: {
                    'Content-Type': 'application/json'},
                url: url_his_sample_data + '/patient/add-to-list',
                method: "POST",
                data: JSON.stringify(add_to_list)})
                    .then(function (response) {
                        console.log('new add to list');
                        console.log(response);
                    });

            $http({
                headers: {
                    'Content-Type': 'application/json'},
                url: url_device_integration + '/orders/neworder',
                method: "POST",
                data: JSON.stringify(device_order)})
                    .then(function (response) {
                        console.log('new order');
                        console.log(response);
                    });
            var msgWs = {
                type: 'new_order',
                data: {
                    his_order_id: order_id,
                    current_status: "NEW",
                    patient_name: patient_name,
                    patient_id: patient_id,
                    procedure: order_description
                }
            };
            connection.send(JSON.stringify(msgWs));
            
            SweetAlert.swal("Success!", "Your order has been submitted.", "success");
        };
        var patientInfo = function (patient_id) {
            $http.get(url_his_sample_data + '/patient/patient-info?patient_id=' + patient_id)
                    .then(function (response) {
                        var patient_info = response.data.entry;
                        $scope.patient = patient_info;
                    });
        };
        var getPatientOrderList = function (patient_id) {
            $http.get(url_his_sample_data + '/order/addtolist?patient_id=' + patient_id)
                    .then(function (response) {

                        var orderList = response.data.entry;

                        $scope.orderList = orderList;
                    });
        };

        $scope.clickCategory = function (event) {
            $scope.input_category = event.target.innerHTML;
        };

        $scope.selectOrderName = function () {
            var selectedItem = $scope.select_order_name;
            $scope.device_code = device_code(selectedItem);
            $scope.device_code_value = device_code(selectedItem);
        };

        $scope.swal = function () {
            SweetAlert.swal({
                title: "Submit this order?",
                text: "Are you sure to record this order in system!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3e8f3e", confirmButtonText: "Yes, Submit!",
                cancelButtonText: "No!",
                closeOnConfirm: false,
                closeOnCancel: false},
                    function (isConfirm) {
                        if (isConfirm) {
                            submitOrder();
                        } else {
                            SweetAlert.swal("Cancelled", "Your order has not been registered", "error");
                        }
                    });
        };

        $scope.input_category = 'PLEASE SELECT';
        $scope.select_order_name = '00';
        patientInfo(patient_id);
        getPatientOrderList(patient_id);
        $scope.date_start = gf_todayDate();

    }]);