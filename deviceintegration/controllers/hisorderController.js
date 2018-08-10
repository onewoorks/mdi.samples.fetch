var fileType = function (file) {
    var fa = '';
    switch (file.toLowerCase()) {
        case 'image/jpeg':
            fa = 'fa-file-image';
            break;
        case 'pdf':
            fa = 'fa-file-pdf';
            break;
    }
    return 'fas ' + fa;
};

var newOrderScreen = angular.module('hisOrderApp', []);
newOrderScreen.controller('hisOrderController', ['$scope', '$http', '$location', function ($scope, $http, $location) {

        var url_params = gf_getQueryParams();
        var patient_id = url_params.patient_id;
                $scope.addToList = function () {
                    //var inputs =  $('#new_order').serializeArray();

                };


        var patientInfo = function (patient_id) {
            $http.get(url_his_sample_data + '/patient/patient-info?patient_id=' + patient_id)
                    .then(function (response) {
                        var patient_info = response.data.entry;
                        $scope.patient_id = patient_info.patient_id;
                        $scope.patient_name = patient_info.patient_name;
                        $scope.patient_identification_no = patient_info.identification_no;
                        $scope.patient_dob = patient_info.date_of_birth;
                        $scope.patient_gender = patient_info.gender;
                        $scope.patient_image = patient_info.image;
                    });
        };

        var getPatientOrderList = function (patient_id) {
            $http.get(url_his_sample_data + '/order/addtolist?patient_id=' + patient_id)
                    .then(function (response) {
                        var orderList = response.data.entry;
                        $scope.orderList = orderList;
                    });
        };

        var getPatientCoe = function (patient_id) {
            $http.get(url_his_sample_data + '/patient/patient-coe?patient_id=' + patient_id)
                    .then(function (response) {
                        var coeList = response.data.entry;
                        $scope.coeList = coeList;
                    });
        };

        $scope.tableRowStyle = function (order_group) {
            var class_name = order_group.replace(/ /g, "_");
            return 'order_' + class_name;
        };

        $scope.lowerCase = function (string) {
            return angular.lowercase(string);
        };

        $scope.openReport = function (coe) {
            $http.get(url_device_integration + '/orders/order-media?order_id=' + coe.his_order_id)
                    .then(function (response) {
                        $scope.modal_title = 'Image fetched from medical device';
                        $scope.modal_size = 'modal-lg';
                        var data = response.data.entry.media;
                        var html = '';
                        html += '<div id="images_report" data-orderid="' + coe.his_order_id + '" class="row">';
                        data.forEach(function (entry) {
                            html += '<div class="col-sm-3">';
                            html += '<a href="'+ entry +'" target="_blank">';
                            html += '<img src="' + entry + '" class="img-responsive" style="margin-bottom:30px;" />';
                            html += '</a>';
                            html += '<input type="checkbox" class="image_data"  value="' + entry + '"/>';
                            html += '</div>';
                        });
                        html += '</div>';
                        $('#save_selected').show();
                        $('#contentNya').html(html);
                        $('#modal_report').modal('show');
                    });
        };

        $scope.selectedImages = function (coe) {
            $http.get(url_his_sample_data + '/patient/show-selected-image?patient_id=' + coe.patient_id + '&his_order_id=' + coe.his_order_id)
                    .then(function (response) {
                        $scope.modal_title = 'Image selected by doctor';
                        $('#save_selected').hide();
                        var data = response.data.entry.url;
                        var html = '';
                        html += '<div id="images_report" data-orderid="' + coe.his_order_id + '" class="row">';
                        data.forEach(function (entry) {
                            html += '<div class="col-sm-3">';
                            html += '<a href="'+ entry +'" target="_blank">';
                            html += '<img src="' + entry + '" class="img-responsive" style="margin-bottom:30px;" />';
                            html += '</a>';
                            html += '</div>';
                        });
                        html += '</div>';
                        $('#contentNya').html(html);
                        $('#modal_report').modal('show');
                        $scope.modal_size = 'modal-lg';
                        
                    });
        };

        $scope.openPdf = function (coe) {
            $scope.modal_title = 'Document produced by medical device';
            $scope.modal_size = '';
            var report_data = coe.report_data;
            var pdf = report_data.url;

            var html = "<a href='" + pdf + "' target='_blank' class='btn btn-primary'><i class='fas fa-file-pdf'></i> Open PDF</a>";
//            var html = '<object data="'+pdf+'" type="application/pdf" width="750px" height="750px">';
//            html += '<embed src="'+pdf+'" type="application/pdf">';
//            html += '<p>This browser does not support PDFs. Please download the PDF to view it: <a href="'+pdf+'">Download PDF</a>.</p>'
//            html += '</embed>';
//            html += '</object>';
            $('#save_selected').hide();
            $('#contentNya').html(html);
            $('#modal_report').modal('show');
        };

        patientInfo(patient_id);
        getPatientCoe(patient_id);
        getPatientOrderList(patient_id);

    }]);