var loadBusinessurl;
parseCommunityURL();
var global_sa = "";
var global_sl = "";

function update_url() {
    loadBusinessurl = communityRequestProfile.protocol + communityRequestProfile.api_server + '/apptsvc/rest/sasl/getSASLByURLkey?urlKey=';
    retriveBannerUrl = communityRequestProfile.protocol + communityRequestProfile.api_server + '/apptsvc/rest/sasl/retrieveSASLbanner?';
    retriveIconUrl = communityRequestProfile.protocol + communityRequestProfile.api_server + '/apptsvc/rest/sasl/retrieveATC192bySASL?';
    applyThemeUrl = communityRequestProfile.protocol + communityRequestProfile.api_server + '/apptsvc/rest/sasl/setThemeColors?';
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
            communityRequestProfile.api_server = 'simfel.com';
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
            var allcolor = ".cmtyx_color_1 { background-color:" + color1 + " !important; }" + ".cmtyx_border_color_1 { border-color: " + color1 + " !important; }" + ".cmtyx_text_color_1 { color: " + color1 + " !important; }" + ".cmtyx_color_2 { background-color:" + color2 + " !important; }" + ".cmtyx_border_color_2 { border-color: " + color2 + " !important; }" + ".cmtyx_text_color_2 { color: " + color2 + " !important; }" + ".cmtyx_color_3 { background-color:" + color3 + " !important; }" + ".cmtyx_border_color_3 { border-color: " + color3 + " !important; }" + ".cmtyx_text_color_3 { color: " + color3 + " !important; }" + ".cmtyx_color_4 { background-color:" + color4 + " !important; }" + ".cmtyx_border_color_4 { border-color: " + color4 + " !important; }" + ".cmtyx_text_color_4 { color: " + color4 + " !important; }"
            var dataobj = {
                "barFontColors": "" + allcolor
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
