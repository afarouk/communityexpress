<?php include_once('sitefiles/php/detecturl.php')?>
<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
<?php
include('sitefiles/includes/stylesheets.html');
?>
<title>Chalkboards-Members</title>
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
