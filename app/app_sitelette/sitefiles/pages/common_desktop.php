<?php include_once ('sitefiles/php/detecturl.php')?>
<!DOCTYPE html>
<html lang="en">
 <head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <meta charset="utf-8">
  <meta name="description" content="">
  <meta name="keywords" content="">
  <?php
  include 'sitefiles/includes/stylesheets.html';
  ?>
  <link href="desktop/desktop.css" rel="stylesheet">
<title><?php
if (isset($saslName)) {
    echo $saslName;
} else {
    echo 'ChalkboardsToday.com';
}
?></title>
</head>
<body data-spy="scroll" data-target=".navbar-fixed-top" >
 <!-- Header start -->
 <?php
include ('sitefiles/includes/navbar.php');
 ?>
 <!-- Header end -->
 <?php
include ('desktop/desktop.html');
 ?>
  <?php
include ('sitefiles/includes/scriptfiles.html');
  ?>
  <script src="desktop/desktop.js"></script>
  <?php
include ('sitefiles/includes/footer.php');
  ?>
 </body>
</html>
