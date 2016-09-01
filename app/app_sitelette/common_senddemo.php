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
  <link href="sitefiles/css/bootstrap-select.min.css" rel="stylesheet">
  <link href="sitefiles/css/style.css" rel="stylesheet">
<title><?php
if (isset($saslName)) {
    echo $saslName;
} else {
    echo 'Chalkboards Demo';
}
?></title>
<!-- insert page specific css here -->
</head>
<body data-spy="scroll" data-target=".navbar-fixed-top" >
 <!-- Header start -->
 <?php
include 'sitefiles/includes/navbar.php';
 ?>
 <!-- Header end -->
 <?php
include 'sitefiles/pages/content_senddemo.html';
 ?>
  <?php
include 'sitefiles/includes/scriptfiles.html';
  ?>
  <!-- insert page specific javascript here -->
  <script src="sitefiles/js/bootstrap-select.min.js"></script>
  <script src="sitefiles/pages_js/content_senddemo.js"></script>

  <?php
include 'sitefiles/includes/footer.php';
  ?>
 </body>
</html>
