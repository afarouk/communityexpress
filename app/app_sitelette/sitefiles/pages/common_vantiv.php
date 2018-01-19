<?php include_once ('sitefiles/php/detecturl.php')?>
<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
 <head>
  <?php
include ('sitefiles/includes/stylesheets.html');
  ?>
  <title>Chalkboards-Vantiv</title>

  <script>
  	window.HostedPaymentStatus = '<?php echo $HostedPaymentStatus ?>';
  </script>
 </head>
 <body>
  <?php
include ('sitefiles/includes/scriptfiles.html');
  ?>
  <?php
include ('sitefiles/includes/vantiv_returnToOrder.html');
  ?>
 </body>
</html>
