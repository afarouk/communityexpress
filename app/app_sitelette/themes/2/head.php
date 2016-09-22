<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- combined common css -->
    <link href="build/styles.css" rel="stylesheet">
    <!-- themes specific css -->
    <link href="themes/2/css/style.css" rel="stylesheet">

    <script src="build/mobile.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDon847P6x8IUl-pBwSMvvuZd3g2186uhQ"></script>

    <link rel="apple-touch-startup-image" href="themes/2/splash/Default-portrait@2x~iphone5.jpg">

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
        window.community.embedded = <?php echo  $embedded==TRUE?'true':'false'  ?>;
        window.community.desktop = <?php echo  $desktopIFrame==TRUE?'true':'false' ?>;
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
    </script>
    <title><?php echo $saslName?></title>
</head>
