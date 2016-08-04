<!DOCTYPE html>
<html lang="en" class="js flexbox flexboxlegacy canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths ui-mobile">
 <head>

  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta charset="utf-8">
  <link rel="apple-touch-startup-image" href="styles/splash/Default-portrait@2x~iphone5.jpg">
  <link href="//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&amp;subset=latin" rel="stylesheet">

  <!-- <link rel="stylesheet" href="build/styles.css"> -->

  <meta charset="utf-8">
  <!-- Title here -->
  <title>Pree - Home</title>
  <!-- Description, Keywords and Author -->
  <meta name="description" content="Pree Trivia game">
  <meta name="keywords" content="Pree Trivia Game">
  <meta name="author" content="Orinoco Inc.">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Styles -->
  <!-- Bootstrap CSS -->
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <!-- Bootstrap datetimepicker -->
  <link href="vendor/styles/bootstrap-datetimepicker.css" rel="stylesheet">
  <!-- jQuery UI -->
  <link rel="stylesheet" href="vendor/styles/jquery-ui.css">
  <!-- jQuery Gritter -->
  <link rel="stylesheet" href="vendor/styles/jquery.gritter.css">
  <!-- Font awesome CSS -->
  <link href="vendor/styles/font-awesome.min.css" rel="stylesheet">

  <!-- Widgets stylesheet -->
  <link href="vendor/styles/widgets.css" rel="stylesheet">
  <!-- Custom CSS -->
  <link rel="stylesheet" href="./styles/common_styles.css">
  <link href="build/styles.css" rel="stylesheet">
  <!-- Favicon -->
  <link rel="apple-touch-icon" sizes="57x57" href="img/favicon/apple-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="60x60" href="img/favicon/apple-icon-60x60.png">
  <link rel="apple-touch-icon" sizes="72x72" href="img/favicon/apple-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="76x76" href="img/favicon/apple-icon-76x76.png">
  <link rel="apple-touch-icon" sizes="114x114" href="img/favicon/apple-icon-114x114.png">
  <link rel="apple-touch-icon" sizes="120x120" href="img/favicon/apple-icon-120x120.png">
  <link rel="apple-touch-icon" sizes="144x144" href="img/favicon/apple-icon-144x144.png">
  <link rel="apple-touch-icon" sizes="152x152" href="img/favicon/apple-icon-152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="img/favicon/apple-icon-180x180.png">
  <link rel="icon" type="image/png" sizes="192x192"  href="img/favicon/android-icon-192x192.png">
  <link rel="icon" type="image/png" sizes="32x32" href="img/favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="96x96" href="img/favicon/favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="16x16" href="img/favicon/favicon-16x16.png">
  <link rel="manifest" href="img/favicon/manifest.json">
  <link rel="stylesheet" href="/styles/styles.css">
 </head>

 <body>

     <script>
        window.community={};
        window.community.protocol='<?php echo $protocol?>';
        window.community.UID='<?php echo $UID ?>';
        window.community.type='<?php echo $type ?>';
        window.community.uuidURL='<?php echo $uuidURL ?>';
        window.community.demo='<?php echo  $demo==TRUE?'true':'false'?>';
        window.community.server='<?php echo $server ?>';
        window.community.host='<?php echo $serverName ?>';
        window.community.serviceAccommodatorId='<?php echo $serviceAccommodatorId ?>';
        window.community.serviceLocationId='<?php echo $serviceLocationId ?>';
        window.community.canCreateAnonymousUser=<?php echo  $canCreateAnonymousUser==TRUE?'true':'false'?>;
     </script>

     <div class="navbar navbar-default navbar-fixed-top header">
         <div class="container-fluid">
             <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1 p-r-0">

                 <div class="navbar-header">
                     <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                         <span class="sr-only">Toggle navigation</span>
                         <span class="icon-bar"></span>
                         <span class="icon-bar"></span>
                         <span class="icon-bar"></span>
                     </button>
                    <a class="navbar-brand" href="#"><img class="img-responsive" src="img/pree.png" alt=""></a>
                 </div>

                 <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

                     <ul class="nav navbar-nav navbar-right">
                       <li>
                           <a href="admin.php"> Admin </a>

                       </li>
                       <li class="dropdown">
                           <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                               <img src="images/church-bell.png" alt="">
                               <span class="menuItemText">Notifications</span>
                           </a>
                           <ul class="dropdown-menu">
                                 <li class="disabled"><a href="#">Action</a></li>
                                 <li class="disabled"><a href="#">Another action</a></li>
                                 <li class="disabled"><a href="#">Something else here</a></li>
                                 <li role="separator" class="divider"></li>
                                 <li class="disabled"><a href="#">Separated link</a></li>
                           </ul>
                       </li>
                       <li class="dropdown">
                             <a href="#" class="dropdown-toggle signin_button">
                                 <span>Sign in</span>
                                 <img class="dropdown-toggle signin_image" src="images/Sign_in.png" alt="">
                             </a>
                             <ul class="dropdown-menu">
                                 <li class="disabled"><a href="#">My Questions</a></li>
                                 <li class="disabled"><a href="#">Help</a></li>
                                 <li class="disabled"><a href="#">Blog</a></li>
                                 <li class="disabled"><a href="#">Privacy & Terms</a></li>
                                 <li role="separator" class="divider"></li>
                                 <li><a class="signout-button" href="#">Sign in</a></li>
                             </ul>
                         </li>
                     </ul>
                 </div>
             </div>
         </div>
         <div class="infoPanel"></div>
     </div>
     <div class="main_content">
         <div id="left-region" class="col-sm-3 col-md-3 col-lg-2 col-lg-offset-1 leftPanel"></div>

         <!-- This is Backbone.marionette container -->
         <div id="app-container" class="col-sm-12 col-md-6 col-lg-6 app-container"></div>
         <!-- The end of Backbone.marionette container -->

         <div id="right-region" class="col-sm-3 col-md-3 col-lg-2 rightPanel">
             <div class="createQuestionBtn">
                 <img src="images/pencil.png" alt="">
                 <span class="createQuestionText">Create a question</span>
             </div>
         </div>

     </div>
     <!-- <div id="app-container" class="app-container">  </div> -->

   <!-- Javascript files -->
   <!-- jQuery -->
   <!-- <script src="vendor/scripts/jquery.js"></script> -->
   <!-- Bootstrap JS -->
   <!-- <script src="vendor/bootstrap/js/bootstrap.min.js"></script> -->
   <!-- jQuery UI -->
   <!-- <script src="vendor/scripts/jquery-ui.min.js"></script> -->
   <!-- jQuery Flot -->
   <!-- <script src="vendor/scripts/excanvas.min.js"></script> -->
   <!-- <script src="vendor/scripts/jquery.flot.js"></script> -->
   <!-- <script src="vendor/scripts/jquery.flot.resize.js"></script> -->
   <!-- <script src="vendor/scripts/jquery.flot.pie.js"></script> -->
   <!-- <script src="vendor/scripts/jquery.flot.stack.js"></script> -->
   <!-- Sparklines -->
   <!-- <script src="vendor/scripts/sparklines.js"></script> -->
   <!-- jQuery Gritter -->
   <!-- <script src="vendor/scripts/jquery.gritter.min.js"></script> -->
   <!-- Respond JS for IE8 -->
   <!-- <script src="vendor/scripts/respond.min.js"></script> -->
   <!-- HTML5 Support for IE -->
   <!-- <script src="vendor/scripts/html5shiv.js"></script> -->

   <!-- Script for this page -->
   <!-- <script src="vendor/scripts/sparkline-index.js"></script> -->
   <!-- Custom JS -->
   <!-- <script src="scripts/custom.js"></script> -->
   <script src="vendor/scripts/iscroll/build/iscroll.js"></script>
   <script src="build/bundle.js"></script>

 </body>
</html>
