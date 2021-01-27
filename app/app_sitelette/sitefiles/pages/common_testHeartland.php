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
include 'sitefiles/pages/content_testHeartland.html';
 ?>
  <?php
include 'sitefiles/includes/scriptfiles.html';
  ?>
  <!-- insert page specific javascript here -->

  <script src="sitefiles/js/bootstrap-select.min.js"></script>
  <script src="sitefiles/pages_js/content_testHeartland.js"></script>
  <script src="https://hps.github.io/token/gp-1.0.0/globalpayments.js"></script>
  <script src="https://www.google.com/recaptcha/api.js" async defer></script>
  <script type="text/javascript">

  // Configure account
  GlobalPayments.configure({
    publicApiKey: "pkapi_cert_bXkCMqQvfOTdXnjPGE"
  });

  // Create Form
  const cardForm = GlobalPayments.ui.form({
    fields: {
      "card-holder-name": {
        placeholder: "Jane Smith",
        target: "#credit-card-card-holder"
      },
      "card-number": {
        placeholder: "•••• •••• •••• ••••",
        target: "#credit-card-card-number"
      },
      "card-expiration": {
        placeholder: "MM / YYYY",
        target: "#credit-card-card-expiration"
      },
      "card-cvv": {
        placeholder: "•••",
        target: "#credit-card-card-cvv"
      },
      "submit": {
        value: "Submit",
        target: "#credit-card-submit"
      }
    },
    styles: {
      // Your styles
    }
  });

  // form-level event handlers. examples:
  cardForm.ready(() => {
    console.log("Registration of all credit card fields occurred");
  });
  cardForm.on("token-success", (resp) => {
    // add payment token to form as a hidden input
    const token = document.createElement("input");
    token.type = "hidden";
    token.name = "payment-reference";
    token.value = resp.paymentReference;

    console.log("token value=" + token.value);

    // submit data to the integration's backend for processing
    const form = document.getElementById("payment-form");
    //form.submit();
  });
  cardForm.on("token-error", (resp) => {
    // show error to the consumer
  });

  // field-level event handlers. example:
  cardForm.on("card-number", "register", () => {
    console.log("Registration of Card Number occurred");
  });





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
