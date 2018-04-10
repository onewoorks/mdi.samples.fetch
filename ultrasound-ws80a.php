<!DOCTYPE html>

<html>
    <head>
        <title>Ultrasound HS70A</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="assets/bootstrap/css/bootstrap-theme.min.css" />
        <link rel='stylesheet' href='assets/customs/css/cd-design.css' />
    </head>
    <body>
        <br>

        <div class="container-fluid">

            <div class="page-header text-center">
                <h1>Ultrasound | Special Diagnostic Procedures Notes <small>(POC)</small></h1>
            </div>

            <ul class='breadcrumb'>
                <li ><a href='./'>Home</a></li>
                <li class='active'>Ultrasound HS70A</li>
            </ul>

            <div class="panel panel-default panel-primary">
                <div class="panel-heading text-uppercase">Patient Info</div>
                <div class="panel-body" style="font-size: 0.9em">
                    <div class="row">
                        <div class="col-sm-1">
                            <img src="./images/common/person.png" class="img-responsive" alt="mohammed bin lee"/>
                        </div>
                        <div class="col-sm-8">
                            <div class="col-sm-3" style="font-size:1.2em; font-weight: bold">Mohamed Bin Lee</div>
                            <div class="col-sm-4">
                                <ul class="list-unstyled">
                                    <li>810204085611 (New IC)</li>
                                    <li>HRPB24354234 (MRN)</li>
                                    <li>27 Years Male</li>
                                </ul>
                            </div>
                            <div class="col-sm-5">
                                <ul class="list-unstyled">
                                    <li><strong>Location :</strong> WAD (Ophthalmology) BED 06 (Third Class)</li>
                                    <li><strong>Encounter Data & Time :</strong> 04/09/2016 09:32</li>
                                    <li><strong>Admission Type :</strong> Elective</li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <ul class="list-unstyled" style="color: red">
                                <li><strong>Allergy :</strong> Paracetamol, Onion, Bee venom</li>
                                <li><strong>Alert :</strong> Epilepsy, High risk for fall</li>
                                <li><strong>Percaution :</strong> Contact (MRSA)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="panel panel-default panel-primary">
                <div class="panel-heading">Sample Dicom Retrieval</div>
                <div class="panel-body">
                    <div class="col-sm-6">
                        <div id="dicom_data" style="white-space: pre; font-family: monospace; font-size:0.8em;"></div>
                    </div>
                    <div class="col-sm-6">
                        <div id='sample_image'></div>
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
        <script language="javascript" type="text/javascript" src="assets/libs/jqplot/jquery.jqplot.min.js"></script>

        <?php
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "8090",
            CURLOPT_URL => "http://172.19.64.7:8090/integration/dicom/content/09-12-2017-0019",
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
        }
        ?>
        <script>
            $(function () {
                var ultrasound_data = JSON.parse('<?= $response; ?>');
                var his_data = ultrasound_data;
                var dicom_data = ultrasound_data.content.dicom_data;
                var images = his_data.images.images;
                var images_html = '';
                $(images).each(function (k, v) {
                    images_html += '<img class="img-responsive" src="//172.19.64.7' + v + '" /><br>';
                });
                $('#sample_image').html(images_html);
                $('#dicom_data').html(JSON.stringify(dicom_data, null, 4));
            });
        </script>
    </body>
</html>
