var url_his_sample_data = 'http://localhost:8083/his-sample';
var url_device_integration = 'http://localhost:8081/integration';

var gf_monthName = ['Januari', 'Februari', 'March'];

var gf_todayDate = function () {
    var todayDate = new Date();
    var todayMonth = (todayDate.getMonth() + 1);
    var todayHari = todayDate.getDate();
    if (todayMonth < 10) {
        todayMonth = '0' + todayMonth;
    }
    if (todayHari < 10) {
        todayHari = '0' + todayHari;
    }
    return todayHari + '/' + todayMonth + '/' + todayDate.getFullYear();
};

var date_formatter = function (date) {
    var date = date.split('/');
    var output = date[2] + '-' + date[1] + '-' + date[0] + ' 00:00:00';
    return output;
};

var dateonly_formatter = function (date) {
    var date = date.split('/');
    var output = date[2] + '-' + date[1] + '-' + date[0];
    return output;
};

var device_code = function (order_name) {
    var orderName = order_name.toLowerCase().replace(/ /g, '');
    var deviceCode = '';
    switch (orderName) {
        case 'colonoscopy':
            deviceCode = 'EDP001';
            break;
        case 'oesophagegastroduodonoscopy(ogds)':
            deviceCode = 'EDP001';
            break;
        case 'dentalintraoralxray(perfilm)':
            deviceCode = 'PLM001';
            break;
        case 'ultrasound':
            deviceCode = 'ULM001';
            break;
        case 'fundusphotography':
            deviceCode = 'FCM001';
            break;
        case 'lungfunctiontest':
            deviceCode = 'SPM001';
            break;
        case 'keratometry':
            deviceCode = 'KRM001';
            break;
    }
    return deviceCode;
};

var objectifyForm = function (formArray) {
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
};

var gf_getQueryParams = function() {
    var qs = document.location.search;
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
};