<?php include_once('sitefiles/php/detecturl.php')?>
<!DOCTYPE html>
<html lang="en">
 <head>
  <?php
include 'sitefiles/includes/stylesheets.html';
  ?>
  <title>Chalkboards </title>
<style type="text/css">
     .form-control-feedback
    {
        top:38px !important;
    }
    .form-control{
        color:#fff;
    }
    .help-block
    {
        color: red;
    }
    .validationErrorMessageClass {
        margin-top: -10px;
    }
     </style>
 </head>
 <body data-spy="scroll" data-target=".navbar-fixed-top" >

  <!-- Header start -->
  <?php
include 'sitefiles/includes/navbar.php';
  ?>
  <!-- Header end -->

  <?php
include 'sitefiles/pages/content_index.html';
  ?>

  <?php
include 'sitefiles/includes/footer.php';
  ?>

  <?php
include 'sitefiles/includes/scriptfiles.html';
  ?>
  <script>
	new WOW().init();
  </script>
  <script>
	$.backstretch(["sitefiles/images/bg/bg1.jpg", "sitefiles/images/bg/bg2.jpg", "sitefiles/images/bg/bg3.jpg"], {
		fade : 950,
		duration : 10000
	});

  </script>
  <script>
	$('.counter').counterUp({
		delay : 100,
		time : 2000
	});
  </script>
     <script type="text/javascript" src="sitefiles/pages_js/content_contactUs.js"></script>
 </body>
</html>
