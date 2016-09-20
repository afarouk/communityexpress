<!-- <header id="header" role="banner" >
 <nav class="navbar navbar-default navbar-fixed-top"  id="tf-menu">
  <div class="container">
   <div class="row">
    <div class="navbar-header">
     <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
      <span class="sr-only">Toggle navigation</span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
     </button>
     <div class="navbar-brand">
      <a href="/" class="page-scroll"> <img class="img-responsive" src="desktop/images/logo1.png" alt="logo"> </a>
     </div>
    </div>
    <div class="collapse navbar-collapse clearfix navMenu" role="navigation">
        
     
       <ul class="nav navbar-nav navbar-right">
      <li  <?php modifyUrlAndClass("") ?> >
       <a class="page-scroll" href=<?php echoActiveClassIfRequestMatches("index","slider-part") ?>  >Home</a>
      </li>
      <li >
       <a class="page-scroll" href=<?php echoActiveClassIfRequestMatches("index","features") ?>>Features</a>
      </li>
      <li  <?php modifyUrlAndClass("signup") ?> >
       <a href="common_signup.php" >Sign Up</a>
      </li>
      <li <?php modifyUrlAndClass("portalexpress") ?>>
       <a  href="common_portalexpress.php" >Login</a>
      </li>
           <li <?php modifyUrlAndClass("Invitation") ?>>
       <a  href="common_signup.php" >Invitation</a>
      </li>
      
      <li>
       <a class="page-scroll" href=<?php echoActiveClassIfRequestMatches("index","contact") ?>>Contact</a>
      </li>
     </ul>
    </div>
   </div>
  </div>
 </nav>
</header> -->



<header id="header" role="banner">
  <nav class="navbar navbar-default navbar-fixed-top" id="tf-menu">
    <div class="container-fluid p-r-0 p-l-0">
      <div class="col-md-10 col-md-offset-1">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <div class="navbar-brand">
            <a href="/" class="page-scroll"> <img class="img-responsive" src="sitefiles/images/logo1.png" alt="logo"> </a>
          </div>
        </div>
          
        <div class="collapse navbar-collapse clearfix navMenu" id="bs-example-navbar-collapse-1" role="navigation">
          <ul class="nav navbar-nav navbar-right">
            <li <?php modifyUrlAndClass("") ?>>
              <a class="page-scroll" href=<?php echoActiveClassIfRequestMatches("index","slider-part") ?>>Home</a>
              </li>
            <li>
              <a class="page-scroll" href=<?php echoActiveClassIfRequestMatches("index","features") ?>>Features</a>
            </li>
            <li><a href="common_signup.php">demo</a></li>
            <li>
              <a class="page-scroll" href=<?php echoActiveClassIfRequestMatches("index","contact") ?>>Contact</a>
            </li>
            <li><a href="common_signup.php" class="signup_btn">sign up/log in</a></li>
          </ul>
        </div>
      </div>
    </div><!-- container end -->
  </nav>
</header>
