<?php include_once('sitefiles/php/detecturl.php')?>
<!DOCTYPE html>
<html lang="en">
 <head>
 <!-- og meta tags -->
 <meta property="og:type"               content="article" />
 <meta property="og:title"              content="A smarter POS with built-in marketing tools"/>
 <meta property="og:description"        content="Make your coupons and discounts work harder for you. Get Chalkboards for your business."/>
 <meta property="og:image"              content="sitefiles/images/ogImage.png"/>

 <!-- twitter meta tags -->
 <meta name="twitter:card"              content=" "/>
 <meta name="twitter:site"              content=" "/>
 <meta name="twitter:creator"           content="@ChalkboardsToday"/>
 <meta name="twitter:title"             content="A new marketing tool for your small business"/>
 <meta name="twitter:description"       content="Make your coupons and discounts work harder for you. Get Chalkboards for your business."/>
 <meta name="twitter:image"             content="sitefiles/images/ogImage.png"/>

 <meta name="apple-mobile-web-app-title" content="Chalkboards">
 <link rel="apple-touch-icon" href="sitefiles/images/appIcon.png">

  <?php
include 'sitefiles/includes/stylesheets.html';
  ?>
  <title>Chalkboards </title>
  <style type="text/css">
     .form-control-feedback
    {
        /*top:38px !important;*/
    }
    .form-control{
        color:red;
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
<!-- AF: check if we have tiles, if yes, add section with tiles -->

  <?php
  if ($showSASLTiles) {
     echo $saslTilesHTML;
  }
  ?>

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
<!--   <script>
	$.backstretch(["sitefiles/images/bg/bg1.jpg", "sitefiles/images/bg/bg2.jpg", "sitefiles/images/bg/bg3.jpg"], {
		fade : 950,
		duration : 10000
	});

  </script> -->
  <script>
	$('.counter').counterUp({
		delay : 100,
		time : 2000
	});
  </script>
     <!-- <script type="text/javascript" src="sitefiles/pages_js/content_packages.js"></script> -->
     <script type="text/javascript" src="sitefiles/pages_js/content_contactUs.js"></script>
 </body>
</html>
