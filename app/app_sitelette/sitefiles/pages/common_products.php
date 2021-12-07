<?php include_once('sitefiles/php/detecturl.php')?>
<!DOCTYPE html>
<html lang="en">
<head>
 <!-- og meta tags -->
 <meta property="og:type"               content="article" />
 <meta property="og:title"              content="A hybrid POS with built-in marketing tools"/>
 <meta property="og:description"        content="Sell more, Save more, Promote more with a new hybrid point-of-sale."/>
 <meta property="og:image"              content="sitefiles/images/ogImage.png"/>

 <!-- twitter meta tags -->
 <meta name="twitter:card"              content=" "/>
 <meta name="twitter:site"              content=" "/>
 <meta name="twitter:creator"           content="@ChalkboardsToday"/>
 <meta name="twitter:title"             content="A hybrid POS with built-in marketing tools"/>
 <meta name="twitter:description"       content="Sell more, Save more, Promote more with a new hybrid point-of-sale."/>
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
 include 'sitefiles/pages/content_products.html';
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
  $('.carousel').on('touchstart', function(event){
    const xClick = event.originalEvent.touches[0].pageX;
    $(this).one('touchmove', function(event){
      const xMove = event.originalEvent.touches[0].pageX;
      const sensitivityInPx = 5;

      if( Math.floor(xClick - xMove) > sensitivityInPx ){
        $(this).carousel('next');
      }
      else if( Math.floor(xClick - xMove) < -sensitivityInPx ){
        $(this).carousel('prev');
      }
    });
    $(this).on('touchend', function(){
      $(this).off('touchmove');
    });
  });


  
  $('.counter').counterUp({
    delay : 100,
    time : 2000
  });
</script>
<!-- <script type="text/javascript" src="sitefiles/pages_js/content_packages.js"></script> -->
<script type="text/javascript" src="sitefiles/pages_js/content_contactUs.js"></script>
</body>
</html>
