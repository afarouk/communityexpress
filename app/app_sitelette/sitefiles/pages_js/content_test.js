 
/*
  declare any functions here 
 */
  function successCallback(tokenResponse) {
    console.log("success  callback");
    // Populate a hidden field with the single-use token
    $("input[name='paymentToken'").val(tokenResponse.token);

    // Submit the form
    $('#paymentForm').submit();

    $('#submitPayment').prop('disabled', false);

  }

  function failureCallback(tokenResponse) {
     console.log("failure  callback");

    $('#submitPayment').prop('disabled', false);


  }
 /* following run on page load */

$(document).ready(function() {
      /*
      assign the submit button handler */

      $('#submitPayment').click(function () {
        // Prevent the user from double-clicking
        $(this).prop('disabled', true);
        // Create the payment token
        CayanCheckout.createPaymentToken({
            success: successCallback,
            error: failureCallback
        })
      });


       /* set the API key */
       CayanCheckout.setWebApiKey("ABCDEF0123456789");
      
       console.log('after setWebApiKey');



  });
