var loadBusinessurl;
parseCommunityURL();
var global_sa = "";
var global_sl = "";

function update_url() {
    loadBusinessurl = communityRequestProfile.protocol + communityRequestProfile.api_server + '/apptsvc/rest/sasl/getSASLByURLkey?urlKey=';
    retriveBannerUrl = communityRequestProfile.protocol + communityRequestProfile.api_server + '/apptsvc/rest/sasl/retrieveSASLbanner?';
    retriveIconUrl = communityRequestProfile.protocol + communityRequestProfile.api_server + '/apptsvc/rest/sasl/retrieveATC192bySASL?';
    applyThemeUrl = communityRequestProfile.protocol + communityRequestProfile.api_server + '/apptsvc/rest/sasl/setThemeColors?';
    getAppliedThemeColor = communityRequestProfile.protocol + communityRequestProfile.api_server + '/apptsvc/rest/sasl/retrieveThemeColors?';




    //    console.log("$serviceAccommodatorId" + serviceAccommodatorId);
    //    console.log("$serviceLocationId" + serviceLocationId);
}
update_url();
$(document).ready(function () {
    var api_server_before_demo_switch = "";
    var serviceLocationId = "";
    var serviceAccommodatorId = "";
    $('#theme_demo_true_switch').on('change', function (e) {
        var evt = e ? e : window.event;
        if (evt.preventDefault) evt.preventDefault();
        evt.returnValue = false;
        var demoChecked = $('#theme_demo_true_switch').prop('checked');
        if (demoChecked) {
            api_server_before_demo_switch = communityRequestProfile.api_server;
            communityRequestProfile.api_server = 'chalkboardsdemo.dev';
        }
        else {
            communityRequestProfile.api_server = api_server_before_demo_switch;
        }
        update_url();
        $("#load_url").val("");
        $("#theme_banner").html('');
        $("#theme_appicon").html('');
        serviceLocationId = "";
        serviceAccommodatorId = "";
    });
    $("#loadBannerIcon").on('click', function () {
        $("#theme_banner").html('');
        $("#theme_appicon").html('');
        serviceLocationId = "";
        serviceAccommodatorId = "";
        var load_url = $("#load_url").val();
        if (load_url.trim() == "") {
            alert('Please enter the URL prefix for your business');
            return false;
        }
        var request = $.get(loadBusinessurl + load_url);
        request.success(function (data) {
            console.log(data);
            if (data.serviceLocationId && data.serviceAccommodatorId) {
                serviceLocationId = data.serviceLocationId;
                serviceAccommodatorId = data.serviceAccommodatorId;
                last_part = "serviceAccommodatorId=" + serviceAccommodatorId + "&serviceLocationId=" + serviceLocationId;
                appliedColor(last_part);
                $("#theme_banner").html('<img src="' + retriveBannerUrl + last_part + '">');
                $("#theme_appicon").html('<img src="' + retriveIconUrl + last_part + '">');


            }
            else {
                alert('This is not a valid URL prefix.');
                return false;
            }
        });
        request.error(function (data) {
            console.log(data);
            alert('This is not a valid URL prefix.');
        });
    });

    function appliedColor(lastpart){
      var request = $.get(getAppliedThemeColor + lastpart);
      request.success(function (data) {
        if(data.error){

        }else{
           $("#color1").val(data.background);
           $("#color2").val(data.foregroundLight);
           $("#color3").val(data.foregroundDark);
           $("#color4").val(data.background2);

           if(data.barFontColors){
             arr=data.barFontColors.split("background-color:");
             $("#color5").val(arr[1].split(" ")[0]);
             $("#color6").val(arr[2].split(" ")[0]);
             $("#color7").val(arr[3].split(" ")[0]);
             $("#color8").val(arr[4].split(" ")[0]);

           }
           $("#color1").focus();
           $("#color2").focus();
           $("#color3").focus();
           $("#color4").focus();
           $("#color5").focus();
           $("#color6").focus();
           $("#color7").focus();
           $("#color8").focus();
           $("#color9").focus();



        }

      });
      request.error(function (data) {

      });
    }
    $("#colorApply").on('click', function () {
        if (!serviceLocationId || !serviceAccommodatorId) {
            alert('Please load the url prefix');
            return false;
        }
        else {
            last_part = "serviceAccommodatorId=" + serviceAccommodatorId + "&serviceLocationId=" + serviceLocationId + "&UID=UID";
            new_applyThemeUrl = applyThemeUrl + last_part;
            var color1 = '#'+$("#color1").val();
            var color2 = '#'+$("#color2").val();
            var color3 = '#'+$("#color3").val();
            var color4 = '#'+$("#color4").val();
            var color5 = '#'+$("#color5").val();
            var color6 = '#'+$("#color6").val();
            var color7 = '#'+$("#color7").val();
            var color8 = '#'+$("#color8").val();




            var allcolor = ".cmtyx_color_1 { background-color:" + color5 + " !important; }" + ".cmtyx_border_color_1 { border-color: " + color5 + " !important; }" + ".cmtyx_text_color_1 { color: " + color5 + " !important; }" + ".cmtyx_color_2 { background-color:" + color6 + " !important; }" + ".cmtyx_border_color_2 { border-color: " + color6 + " !important; }" + ".cmtyx_text_color_2 { color: " + color6 + " !important; }" + ".cmtyx_color_3 { background-color:" + color7 + " !important; }" + ".cmtyx_border_color_3 { border-color: " + color7 + " !important; }" + ".cmtyx_text_color_3 { color: " + color7 + " !important; }" + ".cmtyx_color_4 { background-color:" + color8 + " !important; }" + ".cmtyx_border_color_4 { border-color: " + color8 + " !important; }" + ".cmtyx_text_color_4 { color: " + color8 + " !important; }"

            var dataobj = {
                          "barFontColors": "" + allcolor,
                          "background": color1,
                          "foregroundLight":color2,
                          "foregroundDark": color3,
                          "background2": color4
            };
            $.ajax({
                url: new_applyThemeUrl
                , data: JSON.stringify(dataobj)
                , contentType: 'application/json'
                , dataType: 'json'
                , type: 'POST'
                , async: false
                , success: function (data) {
                    alert('Successfully applied');
                }
                , error: function (data) {
                    alert('Error occurred');
                }
            });
        }
    });
});
