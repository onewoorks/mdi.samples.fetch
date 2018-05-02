
$(function () {
    "use strict";
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
     var connection = new WebSocket('ws://'+source_ip+':1337');
//    var connection = new WebSocket('ws://127.0.0.1:1337');
    connection.onopen = function () {
        $('#socket_status').text('socket is connected');
    };
    connection.onerror = function (error) {
        $('#socket_status').text('socket is down!');
    };

    connection.onmessage = function (message) {
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
           
            $('#'+currentStatus + '_' + data.his_order_id)
                    .text(status_text)
                    .removeClass(btnStatus(currentStatus))
                    .addClass(btnStatus(nextStatus));
            
            var nextTotal = parseInt($('#total_' + nextStatus.toLowerCase()).html()) +1 ;
             
            $('#total_' + nextStatus.toLowerCase()).text(nextTotal);
            $('#total_' + currentStatus.toLowerCase()).text((parseInt($('#total_' + currentStatus).text()) - 1));
        }
    };

    var createNewOrder = function (data) {
        var totalAll = parseInt($('#total_all').text());
        var html = '<tr>';
        html += '<td class=\'text-center\'>'+(totalAll+1)+'</td>';
        html += '<td class=\'text-center\'>'+data.patient_id+'</td>';
        html += '<td>'+data.patient_name+'</td>';
        html += '<td>'+data.procedure+'</td>';
        html += '<td><div class="btn btn-primary btn-lg btn-block" id="new_'+data.his_order_id+'">NEW</div></td>';
        html += '</tr>';
        var totalNew = parseInt($('#total_new').text());
        $('#total_all').text((totalAll+1));
        ;$('#total_new').text((totalNew+1));
        $('#list_of_orders tbody tr:last').after(html);
    };
    
    var updateOrderToSocket = function(){
        console.log('ok');
    }

});