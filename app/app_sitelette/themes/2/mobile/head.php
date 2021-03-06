<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" />
    <!-- combined common css -->
    <link href="build/styles.css" rel="stylesheet">
    <!-- themes specific css -->
    <style  type="text/css">
    <?php
     if (isset($barFontColors)) {
      echo $barFontColors;
     } else {
      include_once 'themes/2/mobile/css/barFontColors.css';
     }
    ?>
    </style>
    <link href="themes/2/mobile/css/style.css" rel="stylesheet">

    <script src="build/mobile.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDon847P6x8IUl-pBwSMvvuZd3g2186uhQ"></script>
    <script src="https://connect.facebook.net/en_US/sdk.js"></script>

    <link rel="apple-touch-startup-image" href="themes/2/mobile/splash/Default-portrait@2x~iphone5.png">

    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">

    <link rel="apple-touch-icon"  href="<?php
    if (!is_null($appleTouchIcon60URL)) {
        echo $appleTouchIcon60URL;
    } else {
        echo 'someicon';
    }
    ?>">

    <link rel="icon" sizes="192x192" href="<?php
    if (!is_null($androidHomeScreenIconURL)) {
        echo $androidHomeScreenIconURL;

    } else {
        echo 'someicon';
    }
    ?>">

    <link rel="icon" href="themes/2/favicon.ico?v=1.1">

    <!-- TODO splash screen styles
      temporary for demo
    -->
    <style type="text/css">
        body {
            background-color: black;
            background-image: url("themes/2/mobile/splash/Default-portrait@2x~iphone5.jpg");
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }
    </style>
    <!-- end -->

    <script>
        window.saslData = <?php
            if (!is_null($saslJSON)) {
                echo json_encode($saslJSON);
            } else {
                echo '{"error":"null sasl"}';
            }
            ?>;
        window.community = {};
        window.community.themeId = <?php echo $themeId ?>;
        window.community.domain = '<?php echo $domain ?>';
        window.community.protocol = '<?php echo $protocol?>';
        window.community.UID = '<?php echo $UID ?>';
        window.community.type = '<?php echo $type ?>';
        window.community.uuidURL = '<?php echo $uuidURL ?>';
        window.community.catalogId = '<?php echo $catalogId ?>';
        window.community.embedded = <?php echo  $embedded==TRUE?'true':'false'  ?>;
        window.community.desktop = <?php echo  $isDesktop==TRUE?'true':'false' ?>;
        window.community.publicAccess = <?php echo  $urlKeyAccess==TRUE?'true':'false'?>;
        window.community.directAccess = <?php echo  $saslAccess==TRUE?'true':'false'?>;
        window.community.demo = <?php echo  $demo==TRUE?'true':'false'?>;
        window.community.server = '<?php echo $server ?>';
        window.community.host = '<?php echo $serverName ?>';
        window.community.friendlyURL = '<?php echo $friendlyURL ?>';
        window.community.isPrivate = <?php echo  $isPrivate==TRUE?'true':'false'?>;
        window.community.serviceAccommodatorId = '<?php echo $serviceAccommodatorId ?>';
        window.community.serviceLocationId = '<?php echo $serviceLocationId ?>';
        window.community.canCreateAnonymousUser = <?php echo  $canCreateAnonymousUser==TRUE?'true':'false'?>;
        window.community.hasAddress = <?php echo $hasAddress==TRUE?'true':'false' ?>;
        if (window.community.hasAddress) {
            window.community.deliveryAddress = {};
            window.community.deliveryAddress.city = '<?php echo $city ?>';
            window.community.deliveryAddress.street = '<?php echo $street ?>';
            window.community.deliveryAddress.number = '<?php echo $number ?>';
        }

        window.fbAsyncInit = function() {
          FB.init({
            appId      : '<?php echo $FacebookAppId ?>',
            cookie     : true,
            status     : true,
            xfbml      : true,
            version    : 'v2.10'
          });
        }
    </script>



        <!-- Sharing meta data -->
        <meta name="description" content="A Chalkboards App">
        <meta name="keywords" content="Chalkboardstoday">
        <meta name="author" content="chalkboardstoday.com">


        <meta property="og:type"               content="article" />
        <meta property="og:title"              content="<?PHP echo $og_title?>"/>
        <meta property="og:description"        content="<?PHP echo $og_description?>"/>
        <meta property="og:image"              content="<?PHP echo $og_image?>"/>
        <meta property="og:url"                content="<?PHP echo $og_url?>"/>

        <meta name="twitter:card"              content="<?PHP echo $twitter_card?>"/>
        <meta name="twitter:site"              content="<?PHP echo $twitter_site?>"/>
        <meta name="twitter:creator"           content="@chalkboardstoday"/>
        <meta name="twitter:title"             content="<?PHP echo $twitter_title?>"/>
        <meta name="twitter:description"       content="<?PHP echo $twitter_description?>"/>
        <meta name="twitter:image"             content="<?PHP echo $twitter_image?>"/>
        <meta name="twitter:url"               content="<?PHP echo $twitter_url?>"/>

        <!--  End sharing meta data -->

    <title><?php echo $saslName?></title>
</head>
