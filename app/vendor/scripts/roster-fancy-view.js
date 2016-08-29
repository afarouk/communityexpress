$(function () {
    card = new Skeuocard($("#skeuocard"));
    
//    BUTTON CLICKS
    $("#choose_shipping_address_page .nav_back_btn").click(function () {
        location.href = '#sitelette';
    });
    $("#choose_shipping_address_page .nav_next_btn").click(function () {
        if ($('#add_another').is(':checked')) {
            location.href = '#shipping_page';
        }
        else {
            location.href = '#payment_page';
        }
    });
     $("#shipping_page .nav_back_btn").click(function () {
        location.href = '#choose_shipping_address_page';
    });
    $("#shipping_page .nav_next_btn").click(function () {
        location.href = '#payment_page';
    });
     $("#payment_page .nav_back_btn").click(function () {
        location.href = '#shipping_page';
    });
    $("#payment_page .nav_next_btn").click(function () {
        if ($('#use_another').is(':checked')) {
            location.href = '#payment_card_page';
        }
        else {
            location.href = '#summary';
        }
    });
    $("#payment_card_page .nav_back_btn").click(function () {
        location.href = '#payment_page';
    });
    $("#payment_card_page .nav_next_btn").click(function () {
        location.href = '#summary';
    });
    $("#summary .nav_back_btn").click(function () {
        location.href = '#payment_page';
    });
    $("#summary .nav_next_btn").click(function () {});
    $(".build_btn").click(function () {
        location.href = '#build_combo';
    });
    $(".add_to_cart_btn").click(function () {
        location.href = '#sitelette';
    });
    $(".build_combo_back_btn").click(function () {
        location.href = '#sitelette';
    });
    $(".choose_extr_btn").click(function () {
        location.href = '#sides_extras';
    });
    $(".sides_extras_back_btn").click(function () {
        location.href = '#sitelette';
    });
    $(".order_btn").click(function () {
        location.href = '#choose_shipping_address_page';
    });

   
    
//    OTHER
    $('input[type="text"]').on("focus", function () {
        $(".back_next_btns").hide();
    });
    
    $('input[type="text"]').on("blur", function () {
        $(".back_next_btns").show();
    });
    
    $("#left-panel.cart").css("height", $(window).height() + "px");

//    BUILD COMBO COLOR PANELS
    $(".collapsibleSet div:nth-child(1)").addClass("color1");
    $(".collapsibleSet div:nth-child(2)").addClass("color2");
    $(".collapsibleSet div:nth-child(3)").addClass("color3");
    $(".collapsibleSet div:nth-child(4)").addClass("color4");
    $(".combo_item_container div").addClass("combo_item_color");
    $(".sides_extras_container").addClass("sides_extras_color");
    
    
//    if ($('.combo_item_input').is(':checked')) {
//        $('.tickImg').show();
//    }
//    else {
//        $('.tickImg').hide();
//    }

});

$(document).on("pageinit", "#sitelette", function () {
    $(document).on("swipeleft swiperight", "#sitelette", function (e) {
        if ($.mobile.activePage.jqmData("panel") !== "open") {
            if (e.type === "swiperight") {
                $("#left-panel").panel("open");
            }
        }
    });
});

$(document).on("pageinit", "#build_combo", function () {
    $(document).on("swipeleft swiperight", "#build_combo", function (e) {
        if ($.mobile.activePage.jqmData("panel") !== "open") {
            if (e.type === "swiperight") {
                $("#left-panel").panel("open");
            }
        }
    });
});

$(document).on("pageinit", "#sides_extras", function () {
    $(document).on("swipeleft swiperight", "#sides_extras", function (e) {
        if ($.mobile.activePage.jqmData("panel") !== "open") {
            if (e.type === "swiperight") {
                $("#left-panel").panel("open");
            }
        }
    });
});