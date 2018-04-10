<!DOCTYPE html>

<html>
    <head>
        <title>Device Integration | New Order List</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="assets/bootstrap/css/bootstrap-theme.min.css" />
        <link rel='stylesheet' href='assets/customs/css/cd-design.css' />
        <link rel="stylesheet" href='assets/libs/datepicker/css/datepicker.css' />
    </head>
    <body>

        <div class='container-fluid'>
            <div class="page-header text-center">
                <h1>New Order List for Devices <small>(New Request)</small></h1>
            </div>

            <ul class='breadcrumb'>
                <li ><a href='./'>Home</a></li>
                <li class='active'>New Order Request</li>
            </ul>

            <div class='panel panel-default'>
                <div class='panel-heading text-uppercase'>Order Request for Medical Devices</div>
                <div class='panel-body'>
                    <div class='row'>
                        <div class='col-sm-6'>
                            <p class="alert alert-info">Required Fields for Inserting New Device Order</p>
                            <form id='order-request' method="post" class='form-horizontal'>
                                <div class='form-group form-group-sm'>
                                    <label class='control-label col-sm-4'>HIS Order Id (Accession Number)</label>
                                    <div class='col-sm-6'>
                                        <input type='text' name='his_order_id' class='form-control precontent' required/>
                                    </div>
                                </div>

                                <div class='form-group form-group-sm'>
                                    <label class='control-label col-sm-4'>Patient MRN</label>
                                    <div class='col-sm-6'>
                                        <input type='text' name='patient_mrn' class='form-control precontent' required />
                                    </div>
                                </div>

                                <div class='form-group form-group-sm'>
                                    <label class='control-label col-sm-4'>Patient Name</label>
                                    <div class='col-sm-6'>
                                        <input type='text' name='patient_name' class='form-control precontent' required/>
                                    </div>
                                </div>

                                <div class='form-group form-group-sm'>
                                    <label class='control-label col-sm-4'>Appointment Date</label>
                                    <div class='col-sm-6'>
                                        <div class='input-group'>
                                            <input type='text' name='appointment_date' class='form-control dp' required />
                                            <span class='input-group-addon'><i class='glyphicon glyphicon-calendar'></i></span>
                                        </div>
                                    </div>
                                </div>

                                <div class='form-group form-group-sm'>
                                    <label class='control-label col-sm-4'>Discipline</label>
                                    <div class='col-sm-6'>
                                        <select name='his_discipline' class='form-control' required>
                                            <option value='ultrasound'>Ultrasound</option>
                                            <option value='spirometer'>Spirometer</option>
                                            <option value='endoscopy'>Endoscopy</option>
                                            <option value='oral'>Oral</option>
                                            <option value='fundus'>Fundus</option>
                                        </select>
                                    </div>
                                </div>

                                <div class='form-group form-group-sm'>
                                    <label class='control-label col-sm-4'>Ordered By</label>
                                    <div class='col-sm-6'>
                                        <input type='text' name='ordered_by' class='form-control' required />
                                    </div>
                                </div>

                                <div class='form-group form-group-sm'>
                                    <div class='col-sm-10 text-right'>
                                        <button type='submit' class='btn btn-primary'>Add New Order</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class='col-sm-6'>
                            <h4>POST New Order <small>create new order for devices</small></h4>
                            <div class="form-group">
                                <div class="input-group input-group-sm">
                                    <span class="input-group-addon"><strong>URI</strong></span>
                                    <input type="text" readonly class="form-control" 
                                           value="http://172.19.64.7:8081/integration/orders/neworder" />
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group input-group-sm">
                                    <span class="input-group-addon"><strong>Method</strong></span>
                                    <input type="text" readonly class="form-control" 
                                           value="POST" />
                                </div>
                            </div>

                            <h4 style="font-weight: normal;">HEADERS</h4>
                            <hr style="margin-top: 5px;">

                            <p><strong>Content-Type :</strong> application/json</p>
                            <p><strong>Authorization :</strong> Basic YWRtaW46YWRtaW4=</p>
                            <br>
                            <h4 style="font-weight: normal;">BODY</h4>
                            <hr style="margin-top: 5px;">
                            <p id="precontent" 
                               style="white-space: pre; 
                               border:1px solid #ccc; 
                               background-color: #fafafa; 
                               font-family: monospace; 
                               padding: 10px; font-size: 0.9em;
                               color:#888
                               ">

                            </p>

                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <footer class="text-center small">
                HIS@KKM | Integration R&D 2017
            </footer>
        </div>


        <script src="./assets/jquery/jquery-3.1.1.min.js"></script>
        <script src="./assets/bootstrap/js/bootstrap.min.js"></script>
        <script src='./assets/libs/datepicker/js/bootstrap-datepicker.js'></script>
        <script type="text/javascript">

            function preBuilder() {
                var patient_mrn = $('input[name=patient_mrn]').val();
                var patient_name = $('input[name=patient_name]').val();
                var his_order_id = $('input[name=his_order_id]').val();
                var appointment_date = $('input[name=appointment_date]').val();
                var his_discipline = $('select[name=his_discipline]').val();
                var ordered_by = $('input[name=ordered_by]').val();
                var precontent = {
                    patient_mrn: patient_mrn,
                    patient_name: patient_name,
                    his_order_id: his_order_id,
                    appointment_date: appointment_date,
                    his_discipline: his_discipline,
                    ordered_by: ordered_by
                }
                $('#precontent').html(JSON.stringify(precontent, null, 2));
            }

            $(function () {
                var samplepre = {
                    patient_mrn: "MRN01212131",
                    patient_name: "IRWAN IBRAHIM",
                    his_order_id: "4912212",
                    appointment_date: "09/03/2018",
                    his_discipline: "ultrasound",
                    ordered_by: "FARID AWANG"
                }
                $('#precontent').html(JSON.stringify(samplepre, null, 2));
                $('.precontent').on('keyup', function () {
                    preBuilder();
                })
                $('.dp').datepicker({
                    format: 'dd/mm/yyyy'
                });
            });
        </script>
        <?php
        if ($_POST):

            $date = explode('/', $_REQUEST['appointment_date']);
            $appointment_date = $date['2'] . '-' . $date[1] . '-' . $date[0];
            $post = array(
                "patient_mrn" => $_REQUEST['patient_mrn'],
                "patient_name" => $_REQUEST['patient_name'],
                "his_order_id" => $_REQUEST['his_order_id'],
                "his_discipline" => $_REQUEST['his_discipline'],
                "ordered_by" => $_REQUEST['ordered_by'],
                "modality" => "testonly",
                "appointment_date" => $appointment_date
            );

            $curl = curl_init();

            curl_setopt_array($curl, array(
                CURLOPT_PORT => "8081",
                CURLOPT_URL => "http://172.19.64.7:8081/integration/orders/neworder",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => json_encode($post),
                CURLOPT_HTTPHEADER => array(
                    "cache-control: no-cache",
                    "content-type: text/plain",
                    "postman-token: 17a124d2-a634-35e3-e30d-525bc8529530"
                ),
            ));

            $response = curl_exec($curl);

        endif;
        ?>
    </body>
</html>