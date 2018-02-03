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
    window.vantiv = {};
    window.vantiv.transactionId1 = '<?php echo $vantivTransactionId1 ?>';
    window.vantiv.transactionId2 = '<?php echo $vantivTransactionId2 ?>';
    window.vantiv.transactionId3 = '<?php echo $vantivTransactionId3 ?>';
    window.vantiv.transactionId4 = '<?php echo $vantivTransactionId4 ?>';
    window.vantiv.transactionId5 = '<?php echo $vantivTransactionId5 ?>';
    window.vantiv.transactionId6 = '<?php echo $vantivTransactionId6 ?>';
    window.vantiv.transactionId7 = '<?php echo $vantivTransactionId7 ?>';
    window.vantiv.transactionId8 = '<?php echo $vantivTransactionId8 ?>';
    window.vantiv.transactionId9 = '<?php echo $vantivTransactionId9 ?>';
    window.vantiv.transactionId10 = '<?php echo $vantivTransactionId10 ?>';
    window.vantivValidationCode = '<?php echo $vantivValidationCode ?>';
  </script>
 </head>
 <body>
  <?php
include ('sitefiles/includes/scriptfiles.html');
  ?>
  <?php
include ('sitefiles/pages/content_vantivResponseParser.html');
  ?>
 </body>
</html>
