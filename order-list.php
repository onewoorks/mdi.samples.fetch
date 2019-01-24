<!DOCTYPE html>

<html>
    <head>
        <title>Device Integration | Order List</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="assets/bootstrap/css/bootstrap-theme.min.css" />
        <link rel='stylesheet' href='assets/customs/css/cd-design.css' />
    </head>
    <body>

        <div class='container-fluid'>
            <div class="page-header text-center">
                <h1>Order List for Devices <small>(All New Order Request)</small></h1>
            </div>

            <ul class='breadcrumb'>
                <li ><a href='./'>Home</a></li>
                <li class='active'>Order List</li>
            </ul>

            <div class='panel panel-info'>
                <div class='panel-heading text-uppercase'>Order Request for Medical Devices</div>
                <div class='panel-body'>
                    <ul class="nav nav-tabs">
                        <li class="active"><a href="#all" data-toggle="pill">All <span id="total_all"></span></a></li>
                        <li><a href="#ULM001" data-toggle="pill">Ultrasound  <span id="total_ULM001"></span></a></li>
                        <li><a href="#SPM001" data-toggle="pill">SpiroMeter  <span id="total_SPM001"></span></a></li>
                        <li><a href="#EDP001" data-toggle="pill">Endoscopy  <span id="total_EDP001"></span></a></li>
                        <li><a href="#PLM001" data-toggle="pill">Oral  <span id="total_PLM001"></span></a></li>
                        <li><a href="#FCM001" data-toggle="pill">Fundus  <span id="total_FCM001"></span></a></li>
                    </ul>
                    <div class="tab-content">
                        <div id="all" class="tab-pane fade in active">
                            <h3>All <small>All order list</small></h3>
                            <table id='all_orders' class="text-uppercase table table-bordered table-condensed table-striped">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Order Type</th>
                                        <th>Patient MRN</th>
                                        <th>Patient Name</th>
                                        <th>Appointment Date</th>
                                        <th>Ordered By</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                        <div id="ULM001" class="tab-pane fade">
                            <h3>Ultrasound <small>ultrasound list</small></h3>
                            <div id='table_ULM001'></div>
                        </div>
                        <div id="SPM001" class="tab-pane fade">
                            <h3>Spirometer <small>spirometer list</small></h3>
                            <div id='table_SPM001'></div>
                        </div>
                        <div id="EDP001" class="tab-pane fade">
                            <h3>Endoscopy <small>Endoscopy list</small></h3>
                            <div id='table_EDP001'></div>
                        </div>
                        <div id="PLM001" class="tab-pane fade">
                            <h3>Oral <small>Planmeca list</small></h3>
                            <div id='table_PLM001'></div>
                        </div>
                        <div id="FCM001" class="tab-pane fade">
                            <h3>Fundus <small>Fundus list</small></h3>
                            <div id='table_FCM001'></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <hr>
            <footer class="text-center small">
                HIS@KKM | Integration R&D 2017
            </footer>
        </div>

        <?php
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "8081",
            CURLOPT_URL => "http://localhost:8081/integration/orders/orderlist",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "authorization: Basic YWRtaW46YWRtaW4="
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);
        if ($err) {
            echo "cURL Error #:" . $err;
        } else {
            $response = json_decode($response,true);
        }
        ?>
        <script src="./assets/jquery/jquery-3.1.1.min.js"></script>
        <script src="./assets/bootstrap/js/bootstrap.min.js"></script>
        <script language="javascript" type="text/javascript" src="assets/libs/jqplot/jquery.jqplot.min.js"></script>
        <script>
            function statusAction(status) {
                var html;
                switch (status) {
                    case 'NEW':
                        html = "<div class='btn btn-primary btn-xs btn-block'>NEW</div>";
                        break;
                    case 'IN PROGRESS':
                        html = "<div class='btn btn-warning btn-xs disabled btn-block'>IN PROGRESS</div>";
                        break;
                    case 'DISCONTINUE':
                        html = "<div class='btn btn-danger btn-xs btn-block'>DISCONTINUE</div>";
                        break;
                    case 'COMPLETED':
                        html = "<div class='btn btn-success btn-xs btn-block'>COMPLETED</div>";
                        break;
                }
                return html;
            }
            function convertDate(dateString) {
                var p = dateString.split(/\D/g)
                var result = '';
                if (p.length == 3) {
                    result = [p[2], p[1], p[0]].join("-");
                }
                return result;
            }

            function renderTable(table, data) {
                var html = '';
                var info = data.entry;
                var filter = table.replace('table_', '');
                
                var total = 0;
                html += "<table class='text-uppercase table table-bordered table-condensed table-striped'>";
                html += "<thead>";
                html += "<tr>";
                html += "<th>No</th>";
                html += "<th>HIS Order Id</th>";
                html += "<th>Patient MRN</th>";
                html += "<th>Patient Name</th>";
                html += "<th>Appointment Date</th>";
                html += "<th>Ordered By</th>";
                html += "<th>Action</th>"
                html += "</tr>";
                html += "</thead>";
                html += "<tbody>";

                $(info).each(function (k, v) {
                    if (v.device_code == filter) {
                        total++;
                        html += "<tr>";
                        html += "<td>" + (total-1) + "</td>";
                        html += "<td>" + v.his_order_id + "</td>";
                        html += "<td class='text-uppercase'>" + v.patient_id + "</td>";
                        html += "<td class='text-uppercase'>" + v.patient_name + "</td>";
                        html += "<td>" + convertDate(v.his_appointment_date) + "</td>";
                        html += "<td>" + v.his_ordered_by + "</td>";
                        html += "<td class='text-center'>" + statusAction(v.order_status) + "</td>"
                        html += "</tr>"
                    }
                });
                
                html += '</tbody>';
                html += '</table>';
                $('#' + table).html(html);
                $('#total_' + filter).html('(' + total + ')');
            }
        </script>
        <script type="text/javascript">
            function WebSocketTest() {
                if ("WebSocket" in window) {
                    console.log("WebSocket is supported by your Browser!");
                    // Let us open a web socket
                    var ws = new WebSocket("ws://localhost:8888/socket.io/?EIO=3&transport=websocket");
                    
                    ws.emit('message','send to sever');

                    ws.onopen = function (){
                        // Web Socket is connected, send data using send()
                        ws.send("Message to send");
                        console.log("Message is sent...");
                    };

                    ws.onmessage = function (evt){
                        var received_msg = evt.data;
                        console.log("Message is received...");
                    };

                    ws.onclose = function (){
                        // websocket is closed.
                        console.log("Connection is closed...");
                    };

                    window.onbeforeunload = function (event) {
                        socket.close();
                    };
                } else
                {
                    // The browser doesn't support WebSocket
                    console.log("WebSocket NOT supported by your Browser!");
                }
            }
        </script>
        <script>
            $(function () {
                var order_list = JSON.parse('<?= json_encode($response); ?>');
                var order_list_html = '';
                $(order_list.entry).each(function (k, v) {
                    order_list_html += "<tr>";
                    order_list_html += "<td>" + (k + 1) + "</td>";
                    order_list_html += "<td>" + v.his_order_discipline + "</td>";
                    order_list_html += "<td>" + v.patient_id + "</td>";
                    order_list_html += "<td class='text-uppercase'>" + v.patient_name + "</td>";
                    order_list_html += "<td>" + convertDate(v.his_appointment_date) + "</td>";
                    order_list_html += "<td>" + v.his_ordered_by + "</td>";
                    order_list_html += "<td class='text-center'>" + statusAction(v.order_status) + "</td>"
                    order_list_html += "</tr>";
                })
                
                $('#all_orders tbody').html(order_list_html);
                $('#total_all').html('(' + order_list.total + ')');

                var tables = $("div[id^=table_]");

                $(tables).each(function (k, v) {
                    renderTable($(v).attr('id'), order_list);
                });

            });
        </script>
    </body>
</html>