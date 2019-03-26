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
  <link href="sitefiles/css/droplet_theme_style.css" rel="stylesheet">
<title>Compare Chalkboard</title>
<!-- insert page specific css here -->
</head>
<body data-spy="scroll" data-target=".navbar-fixed-top" >
 <!-- Header start -->
 <?php
include 'sitefiles/includes/navbar.php';
 ?>
 <!-- Header end -->


<section id="compare">
  <div class="container-fluid">
    <div class="row  ">
      <div class="col-lg-offset-2 col-md-offset-2 col-sm-offset-2 col-xs-12 col-sm-8   col-md-8   col-lg-8">
        <div>
          <p class="push_down"> Compare Chalkboards</p> <!--  -->
           <br>
         </div>
      </div>
    </div>
  </div>
 <?php
   include 'sitefiles/pages/common_compare.html';
 ?>
</section>




  <?php
include 'sitefiles/includes/scriptfiles.html';
  ?>
  <!-- insert page specific javascript here -->
  <script src="sitefiles/js/bootstrap-select.min.js"></script>
  <script src="sitefiles/pages_js/content_support.js"></script>

  <?php
include 'sitefiles/includes/footer.php';
  ?>
 </body>
</html>
