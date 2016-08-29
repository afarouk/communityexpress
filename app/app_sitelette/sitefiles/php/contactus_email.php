<?php


$toemail = 'contact@chalkboardstoday.com'; // change this to your email id
$name    =  $_REQUEST['name'] ;
$email   = $_REQUEST['email'] ;

$msg =$_REQUEST['message'] ;

$subject = 'Contact from Chalkboard.today';

$headers = "From:chalkboard.today \r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=iso-8859-1 \r\n";
$headers .= 'From:'.$email. "\r\n";
ini_set("sendmail_from",$email);

$message = "Name :" . $name;
$message .= ', Email :' . $email;
$message .= ', Message :'.$msg;

$mailsendresult=mail($toemail, $subject, $message, $email, $headers );



// Prevent caching.
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 01 Jan 2050 00:00:00 GMT');

// The JSON standard MIME header.
header('Content-type: application/json');
$data = new StdClass();
if ($mailsendresult) {
    $data->success     = "TRUE";
    $data->explanation = "OK";
} else {
    $data->success     = FALSE;
    $data->explanation = "Could not send message";
}
// Send the data.
echo json_encode($data);

?>