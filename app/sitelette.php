<!DOCTYPE html>
<html lang="en" class="js flexbox flexboxlegacy canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths ui-mobile">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<meta charset="utf-8">
<link rel="apple-touch-startup-image" href="styles/splash/Default-portrait@2x~iphone5.jpg"> 
<link href="//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&amp;subset=latin" rel="stylesheet">


<!--TODO  The following should be part of build.css -->
<link type="text/css" href="https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.css" rel="stylesheet">
 
<link rel="stylesheet" href="build/<?php echo $themeCSS ?>">  
 

<title><?php
if (!is_null($saslName)) {
    echo $saslName;
} else
    echo 'sitelette.com';
?></title>


<!-- for IOS web app-->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="viewport"
 content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">



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

<style>
* {
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    /*-webkit-user-select: none;*/
}

/*html,body{margin:0;height:100%}#cmtyx_header{font-family:arial;color:#FFF;text-align:center;background-color:blue;width:100%;height:40px}#cmtyx_navbar{font-family:arial;color:#FFF;text-align:center;background-color:green;width:100%;height:40px}#cmtyx_landingView{font-family:arial;color:#FFF;text-align:center;background-color:red;width:100%;min-height:100%;height:auto !important;height:100%;margin:0 auto -60px}*/
</style>

</head>



<body class="ui-mobile-viewport ui-overlay-a">


<script>
      window.saslData = <?php
if (!is_null($saslJSON)) {
    echo json_encode($saslJSON);
} else {
    echo '{"error":"null sasl"}';
}
?>;
  window.community={};
  window.community.protocol='<?php echo $protocol?>';
  window.community.UID='<?php echo $UID ?>';
  window.community.embedded=<?php echo  $embedded==TRUE?'true':'false'  ?>;
  window.community.desktop=<?php echo  $desktopIFrame==TRUE?'true':'false' ?>;
  window.community.publicAccess=<?php echo  $publicAccess==TRUE?'true':'false'?>;
  window.community.directAccess=<?php echo  $directAccess==TRUE?'true':'false'?>;
  window.community.demo=<?php echo  $demo==TRUE?'true':'false'?>;
  window.community.server='<?php echo $server ?>';
  window.community.host='<?php echo $serverName ?>';
  window.community.friendlyURL='<?php echo $friendlyURL ?>';
  window.community.isPrivate=<?php echo  $isPrivate==TRUE?'true':'false'?>;
  window.community.serviceAccommodatorId='<?php echo $serviceAccommodatorId ?>';
  window.community.serviceLocationId='<?php echo $serviceLocationId ?>';
  window.community.canCreateAnonymousUser=<?php echo  $canCreateAnonymousUser==TRUE?'true':'false'?>;

</script>

<?php
if (!is_null($siteletteJSON)) {
   echo $siteletteJSON['headerDiv'];
   echo $siteletteJSON['navbarDiv'];
   echo $siteletteJSON['landingViewDiv'];
}
?>

<script  src="build/bundle.js"></script>
 

<!--TODO  The following should be part of build.js  --> 
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
<script src="vendor/scripts/jquery.jqplot.min.js"></script>
<script src="vendor/scripts/jqplot.barRenderer.min.js"></script>
<script src="vendor/scripts/jqplot.categoryAxisRenderer.min.js"></script>
<script src="vendor/scripts/jqplot.pointLabels.min.js"></script>
<script src="vendor/scripts/jquery-radiobutton.min.js"></script>  

<!--TODO  The following should be part of updateAction.js -->
<script  src="scripts/alex_please_include_in_updateActions.js"></script>


</body>
</html>
