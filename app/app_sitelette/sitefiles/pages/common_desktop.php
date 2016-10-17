<?php include_once ('sitefiles/php/detecturl.php')?>
<!DOCTYPE html>
<html lang="en">
 <head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <meta charset="utf-8">
  <meta name="description" content="">
  <meta name="keywords" content="">
  <?php
  include 'sitefiles/includes/stylesheets.html';
  ?>
  <link href="desktop/desktop.css" rel="stylesheet">
<title><?php
if (isset($saslName)) {
    echo $saslName;
} else {
    echo 'ChalkboardsToday.com';
}
?></title>

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


</head>
<body data-spy="scroll" data-target=".navbar-fixed-top" >
 <!-- Header start -->
 <?php
include ('sitefiles/includes/navbar.php');
 ?>
 <!-- Header end -->
 <?php
include ('desktop/desktop.html');
 ?>
  <?php
include ('sitefiles/includes/scriptfiles.html');
  ?>
  <script src="desktop/desktop.js"></script>
  <?php
include ('sitefiles/includes/footer.php');
  ?>
 </body>
</html>
