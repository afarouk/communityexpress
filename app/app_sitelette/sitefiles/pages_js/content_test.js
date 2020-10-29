 
/*
  declare any functions here 
 */

 
  function successCallback(tokenResponse) {
    console.log("success  callback");

     
    console.log(" response   token:"+tokentResponse.token);
    console.log(" response created:"+tokentResponse.created);
    console.log(" response expires:"+tokentResponse.token);
 
    // Populate a hidden field with the single-use token
    $("input[name='paymentToken'").val(tokenResponse.token);

    // Submit the form
    $('#paymentForm').submit();

    $('#submitPayment').prop('disabled', false);

  }

  function failureCallback(errorArray) {

    for(let i = 0; i < errorArray.length; i++){
      console.log(errorArray[i].error_code+"  "+errorArray[i].reason);
    }



    $('#submitPayment').prop('disabled', false);


  }


/* following code is run on page load */

$(document).ready(function() {
      /*
      set the submit button handler */

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
      CayanCheckout.setWebApiKey("CAQIJ8EHM0VHSCC8");
      
      console.log('Done with setup');



  });
