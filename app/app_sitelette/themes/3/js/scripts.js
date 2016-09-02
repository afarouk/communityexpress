//$( document ).on( "pageinit", function( event ) {
//    $('.ui-page-theme-a a.ui-btn.ui-btn-active').css('background-color', $('.cmtyx_background_color1').css('background-color'));
//    $('.material-textfield.yellow input:focus').css('border-color', $('.cmtyx_color1').css('border-color'));
//});

$(function () {
    
    $( "#user_reviews li:even" ).css( "background-color", "#363636" );
    
    $(document).on('scrollstart', function(){ 
        if( $('#home').scrollTop() > 350 ) { 
            $('.home_footer').fadeOut("slow");
            $('#home > .header').fadeOut("slow");
        }
        else {
            $('.home_footer').fadeIn("fast");
            $('#home > .header').fadeIn("fast");
        }
    });
    $(document).on('scrollstop', function(){ 
        if( $('#home').scrollTop() > 350 ) { 
            $('.home_footer').fadeOut("slow");
            $('#home > .header').fadeOut("slow");
        }
        else {
            $('.home_footer').fadeIn("fast");
            $('#home > .header').fadeIn("fast");
        }
    });
    
    
    $(document).on('scrollstart', function(){ 
        if( $('#roster').scrollTop() > 350 ) { 
            $('.main_header').slideUp("fast");
        }
        else {
            $('.main_header').slideDown("fast");
        }
    });
    $(document).on('scrollstop', function(){ 
        if( $('#roster').scrollTop() > 350 ) { 
            $('.main_header').slideUp("fast");
        }
        else {
            $('.main_header').slideDown("fast");
        }
    });
    
    var mapCanvas = document.getElementById("home_map");
    var mapOptions = {
        center: new google.maps.LatLng(51.5, -0.2), 
        zoom: 10,
        disableDefaultUI:true
    };
    var map = new google.maps.Map(mapCanvas, mapOptions);
    var myCenter=new google.maps.LatLng(51.508742,-0.120850);
    var marker = new google.maps.Marker({
      position:myCenter,
      animation:google.maps.Animation.BOUNCE
    });

    marker.setMap(map);
    
    var infowindow = new google.maps.InfoWindow({
      content:"Our address is..."
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });
    
    
    $(".gallery_block .header").click(function(){
        $(".gallery_block .body").slideToggle("slow");
    });
    $(".events_block .header").click(function(){
        $(".events_block .body").slideToggle("slow");
    });
    $(".questions_block .header").click(function(){
        $(".questions_block .body").slideToggle("slow");
    });
    $(".about_us_block .header").click(function(){
        $(".about_us_block .body").slideToggle("slow");
    });
    $(".loyalty_program_block .header").click(function(){
        $(".loyalty_program_block .body").slideToggle("slow");
    });
    $(".reviews_block .header").click(function(){
        $(".reviews_block .body").slideToggle("slow");
    });
    $(".promotion_block .header").click(function(){
        $(".promotion_block .body").slideToggle("slow");
    });
    $(".photo_contest_block .header").click(function(){
        $(".photo_contest_block .body").slideToggle("slow");
    });
    $(".video_block .header").click(function(){
        $(".video_block .body").slideToggle("slow");
    });
    
//    $(".events_block .body .add_to_calendar_btn").click(function(){
//        $(".events_block .qr_code_block").fadeIn("slow");
//    });
//    $(".events_block .qr_code_block .close_btn").click(function(){
//        $(".events_block .qr_code_block").fadeOut("slow");
//    });  
    
    $(".loyalty_program_block .body .discount_container").click(function(){
        $(".loyalty_program_block .qr_code_block").fadeIn("slow");
    });
    $(".loyalty_program_block .qr_code_block .close_btn").click(function(){
        $(".loyalty_program_block .qr_code_block").fadeOut("slow");
    });
    
    
    $('.gallery').slick({
        dots: false
        , arrows: false
        , infinite: true
        , speed: 700
        , fade: true
        , cssEase: 'linear'
        , slidesToShow: 1
        , autoplay: true
        , autoplaySpeed: 3000      

//                    , prevArrow: $('.prev')
//                    , nextArrow: $('.next')
    });
    
    $('.select_picture_gallery').slick({
        dots: false
        , arrows: true
        , infinite: true
        , speed: 300
        , cssEase: 'linear'
        , slidesToShow: 4  
        , focusOnSelect: true
        , adaptiveHeight: false
    });
    
    $(".my-rating").starRating({
        initialRating: 3.5,
        strokeColor: '#894A00',
        strokeWidth: 10,
        starSize: 25
    });
    
    $('.current_rating').text($('.my-rating').starRating('getRating'));
    
    card = new Skeuocard($("#skeuocard"));
    
//    BUTTON CLICKS
    $(".open_menu_btn").click(function () {
        location.href = '#roster';
    });
    $("#choose_shipping_address_page .nav_back_btn").click(function () {
        location.href = '#roster';
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
        location.href = '#roster';
    });
    $(".build_combo_back_btn").click(function () {
        location.href = '#roster';
    });
    $(".choose_extr_btn").click(function () {
        location.href = '#sides_extras';
    });
    $(".sides_extras_back_btn").click(function () {
        location.href = '#roster';
    });
    $(".order_btn").click(function () {
        location.href = '#choose_shipping_address_page';
    });
    $(".user_reviews_btn").click(function () {
        location.href = '#user_reviews';
    });
    $(".business_hours_btn").click(function () {
        location.href = '#business_hours';
    });
    $(".chat_btn").click(function () {
        location.href = '#chat';
    });
    $(".appointments_btn").click(function () {
        location.href = '#appointments';
    });
    $(".contact_us_btn").click(function () {
        location.href = '#contact_us';
    });
    $(".send_photo_btn").click(function () {
        location.href = '#upload_photo';
    });
    $("#upload_photo .cancel_btn").click(function () {
        location.href = '#home';
    });
    $(".header .back_arr_icon").click(function () {
        location.href = '#home';
    });

   
    
//    OTHER
    $('input[type="text"]').on("focus", function () {
        $(".back_next_btns").hide();
    });
    
    $('input[type="text"]').on("blur", function () {
        $(".back_next_btns").show();
    });
    
    $('textarea').on("focus", function () {
        $(".back_next_btns").hide();
    });
    
    $('textarea').on("blur", function () {
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

$(document).on("pageinit", "#roster", function () {
    $(document).on("swipeleft swiperight", "#roster", function (e) {
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