
$(function () {
    "use strict";
    // for better performance - to avoid searching in DOM
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');
    var myColor = false;
    var myName = false;
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if (!window.WebSocket) {
        content.html($('<p>',
                {text: 'Sorry, but your browser doesn\'t support WebSocket.'}
        ));
        input.hide();
        $('span').hide();
        return;
    }
    // open connection
    var connection = new WebSocket('ws://127.0.0.1:1337');

    connection.onopen = function () {
        input.removeAttr('disabled');
        status.text('Choose name:');
        var msg = 'web1';
        connection.send(msg);
        if (myName === false) {
            myName = msg;
        }
    };
    connection.onerror = function (error) {
        content.html($('<p>', {
            text: 'Sorry, but there\'s some problem with your connection or the server is down.'
        }));
    };

    connection.onmessage = function (message) {
        console.log(message);
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('Invalid JSON: ', message.data);
            return;
        }
//        if (json.type === 'color') {
//            myColor = json.data;
//            status.text(myName + ': ').css('color', myColor);
//            input.removeAttr('disabled').focus();
//            // from now user can start sending messages
//        } else if (json.type === 'history') { // entire message history
////            for (var i = 0; i < json.data.length; i++) {
//        } else if (json.type === 'message') {
//            input.removeAttr('disabled');
//            addMessage(json.data.author, json.data.text, json.data.color, new Date(json.data.time));
//        } else {
//            console.log('Hmm..., I\'ve never seen JSON like this:', json);
//        }
    };

    input.keydown(function (e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            connection.send(msg);
            $(this).val('');
            input.attr('disabled', 'disabled');
            if (myName === false) {
                myName = msg;
            }
        }
    });
    setInterval(function () {
        if (connection.readyState !== 1) {
            status.text('Error');
            input.attr('disabled', 'disabled').val(
                    'Unable to communicate with the WebSocket server.');
        }
    }, 3000);

    function addMessage(author, message, color, dt) {
    }

    $('#send_new_order').click(function () {
        var msg = {
            type: 'new_order',
            data: {
                his_order_id: "11",
                patient_id: "9",
                patient_name: "AA",
                procedure: "VVVV"
            }
        };
        connection.send(JSON.stringify(msg));
    });
    
    $('#send_update_order').click(function(){
        var msg = {
            type: 'update_order',
            data: {
                his_order_id: "1524307652720",
                current_status: "NEW",
                update_status: 'IN_PROGRESS',
                patient_name: 'IRWAN IBRAHIM'
            }
        }
        connection.send(JSON.stringify(msg));
    });



});