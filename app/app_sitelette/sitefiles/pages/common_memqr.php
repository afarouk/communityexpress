<?php include_once('sitefiles/php/detecturl.php')?>
<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php
include('sitefiles/includes/stylesheets.html');
?>
<link href="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" rel="stylesheet"/>
<link href="/sitefiles/css/memqr.css" rel="stylesheet"/>
<title>Chalkboards</title>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" />

<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<link rel="apple-touch-icon"  href="sitefiles/images/memqr/memqrIcon.png" />
<link rel="icon" sizes="192x192" href="sitefiles/images/memqr/memqrIcon.png" />
<link rel="apple-touch-startup-image" href="sitefiles/images/memqr/memqrIcon.png" />

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
<script type="text/javascript" src="sitefiles/js/cleave.min.js"></script>
<script type="text/javascript" src="sitefiles/js/cleave-phone.us.js"></script>
<script type="text/javascript" src="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
<script type="text/javascript" src="sitefiles/pages_js/common_memqr.js"></script>

<?php
include('sitefiles/includes/footer-memqr.php');
?>
</body>
</html>
