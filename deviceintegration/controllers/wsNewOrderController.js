$(function () {
    "use strict";
    // for better performance - to avoid searching in DOM
    
    
//    window.WebSocket = window.WebSocket || window.MozWebSocket;
//    if (!window.WebSocket) {
//        content.html($('<p>',
//                {text: 'Sorry, but your browser doesn\'t support WebSocket.'}
//        ));
//        return;
//    }
//    // open connection
//    var connection = new WebSocket('ws://127.0.0.1:1337');
//
//    connection.onopen = function () {};
//    connection.onerror = function (error) {};
//    connection.onmessage = function (message) {};
//
//    setInterval(function () {
//        if (connection.readyState !== 1) {
//            status.text('Error');
//            input.attr('disabled', 'disabled').val(
//                    'Unable to communicate with the WebSocket server.');
//        }
//    }, 3000);

//    $('#send_new_order').on('click',function (event) {
//        var msg = {
//            type: 'new_order',
//            data: {
//                his_order_id: "11",
//                patient_id: "9",
//                patient_name: "AA",
//                procedure: "VVVV"
//            }
//        };
//        connection.send(JSON.stringify(msg));
//    });
//    
//    $('#send_update_order').on('click', function(data){
//        
//        var msg = {
//            type: 'update_order',
//            data: {
//                his_order_id: "1524307652720",
//                current_status: "NEW",
//                update_status: 'IN_PROGRESS',
//                patient_name: 'IRWAN IBRAHIM'
//            }
//        }
//        connection.send(JSON.stringify(msg));
//    });
    
    

});