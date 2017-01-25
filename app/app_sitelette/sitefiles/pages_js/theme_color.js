

var loadBusinessurl;
parseCommunityURL();
var global_sa="";
var global_sl="";

function update_url() {
  loadBusinessurl = communityRequestProfile.protocol +
      communityRequestProfile.api_server +
      '/apptsvc/rest/sasl/getSASLByURLkey?urlKey=';
  retriveBannerUrl = communityRequestProfile.protocol +
          communityRequestProfile.api_server +
          '/apptsvc/rest/sasl/retrieveSASLbanner?serviceAccommodatorId=&serviceLocationId=';
  retriveIconUrl = communityRequestProfile.protocol +
              communityRequestProfile.api_server +
              '/apptsvc/rest/sasl/retrieveATC192bySASL?serviceAccommodatorId=&serviceLocationId=';
  applyThemeUrl = communityRequestProfile.protocol +
                  communityRequestProfile.api_server +
                '/apptsvc/rest/sasl/setThemeColors?serviceAccommodatorId=&serviceLocationId=&UID=';
}
update_url();
$(document).ready(function() {
var api_server_before_demo_switch="";
  $('#theme_demo_true_switch').on('change', function(e) {
      var evt = e ? e : window.event;
      if (evt.preventDefault)
          evt.preventDefault();
      evt.returnValue = false;
      var demoChecked = $('#theme_demo_true_switch').prop('checked');
      if (demoChecked) {
          api_server_before_demo_switch = communityRequestProfile.api_server;
          communityRequestProfile.api_server = 'simfel.com';
      } else {
          communityRequestProfile.api_server = api_server_before_demo_switch;
      }
      update_url();
      console.log("Server is now :" + communityRequestProfile.api_server);

  });
  $("#loadBannerIcon").on('click', function(){
    var load_url=  $("#load_url").val();
    if(load_url.trim()==""){
      alert('Please enter the URL prefix for your business');
      return false;
    }
      $.get( loadBusinessurl+load_url, function( data ) {
          console.log(data);
      });

  });

});
