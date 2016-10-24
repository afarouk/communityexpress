
$.get( "http://simfel.com/apptsvc/rest/billing/getPacakgesByDomain", function( data ) {
    console.log(data);
    var class_arr = ['orangeBg', 'voiletBg', 'greenBg'];
    var packageBlock = "";
    var counter=0;
    for (var i=0; i<data.length; i++){
        if(data[i].state == 'ACTIVE' && !data[i].isHidden) {
        packageBlock = packageBlock + '<div class="col-sm-4 col-md-4 pricingListing"><div class="pricing_inner_block"><h3 class="pricing_heading '+class_arr[counter]+'">'+data[i].displayText+'</h3><div class="price_wrap"><p><sup>$</sup> '+data[i].packagePricing.monthlyPrice+' <sub>/month</sub><p></div><ul class="pricing_features_list_wrap">';
        for (var j=0; j<data[i].features.length; j++){
          var tickhtml="";
          if(data[i].features[j].preSelected){
            tickhtml='<span class="precing_features_active_circle '+class_arr[counter]+'"><img src="sitefiles/images/landing/tick.png" alt="" class="tick"></span>';
          }
          packageBlock = packageBlock + '<li>'+data[i].features[j].displayText+tickhtml+'</li>';
        }
        packageBlock = packageBlock + '</ul><div class="prcing_bottom_btn_wrap"><a href="javascript:void(0)" class="pricing_demo_button '+class_arr[counter]+'">Schedule a demo</a></div></div></div>';

        counter++;
        }
    }
    $( ".packageListDyn" ).html( packageBlock );
});



$(document).ready(function() {

  setTimeout(function(){
    $('.pricingListing').each(function(){
          var highestBox = 0;

          $('.pricing_inner_block').each(function(){

            if($(this).height() > highestBox) {
              highestBox = $(this).height();
            }

          });
          $('.pricing_inner_block').height(highestBox);

        });

  }, 2000);
});
