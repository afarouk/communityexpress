<?php include_once('sitefiles/php/detecturl.php')?>
<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php
include('sitefiles/includes/stylesheets.html');
?>
<title>Chalkboards</title>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" />

<link rel="apple-touch-startup-image" href="">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<link rel="apple-touch-icon"  href=" ">
<link rel="icon" sizes="192x192" href=" ">

</head>
<body data-spy="scroll" data-target=".navbar-fixed-top" >
<!-- Header start -->
<?php
include('sitefiles/includes/navbar-memqr.php');
?>
<!-- Header end -->
<?php
include('sitefiles/pages/common_memqr.html');
?>
<?php
include('sitefiles/includes/scriptfiles.html');
?>

<!-- <script type="text/javascript" src="sitefiles/pages_js/content_signup.js"></script> -->
<script type="text/javascript" src="sitefiles/pages_js/common_memqr.js"></script>

<?php
include('sitefiles/includes/footer-memqr.php');
?>
</body>
</html>
