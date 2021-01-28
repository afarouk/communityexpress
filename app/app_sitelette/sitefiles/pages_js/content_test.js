
/*
  declare any functions here
 */


  function successCallback(tokenResponse) {
	$('#submitPayment').prop('disabled', false);
    console.log("success  callback");


    console.log(" response   token:"+tokenResponse.token);
    console.log(" response created:"+tokenResponse.created);
    console.log(" response expires:"+tokenResponse.token);

    // Populate a hidden field with the single-use token
    $("input[name='paymentToken'").val(tokenResponse.token);

    // CALL Community API with token and Amount


    // Submit the form
   // $('#paymentForm').submit();



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

     // console.log('Done with setup');



  });



Web API Key: CAQIJ8EHM0VHSCC8