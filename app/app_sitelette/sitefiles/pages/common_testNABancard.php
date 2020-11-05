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
<title><?php
if (isset($saslName)) {
    echo $saslName;
} else {
    echo 'Chalkboards - Test';
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
include 'sitefiles/pages/content_testNABancard.html';
 ?>
  <?php
include 'sitefiles/includes/scriptfiles.html';
  ?>
  <!-- insert page specific javascript here -->

  <script src="sitefiles/js/bootstrap-select.min.js"></script>
  <script src="sitefiles/pages_js/content_testNABancard.js"></script>
  <script src="https://api.cert.nabcommerce.com/1.3/post.js"></script>
  <script src="https://www.google.com/recaptcha/api.js" async defer></script>
  <script type="text/javascript">
     var responseCaptcha = function(response) {
         document.getElementById('reCaptcha').value = response;
     };
  </script>
  <script>
     function velocitySuccessCallback(msg) {
       alert('Success: ' + msg);
     }
     function velocityFailureCallback(msg){
       alert('Failure: ' + msg);
     }
</script>


  <?php
include 'sitefiles/includes/footer.php';
  ?>
 </body>
</html>
