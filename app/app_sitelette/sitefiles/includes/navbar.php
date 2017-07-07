<header id="header" role="banner">
  <nav class="navbar navbar-default navbar-fixed-top" id="tf-menu">
    <div class="container-fluid p-r-0 p-l-0">
      <div class="col-md-10 col-md-offset-1">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-role="none" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
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
            <!--
            <li>
              <a class="page-scroll" href=<?php echoActiveClassIfRequestMatches("index","features") ?>>Features</a>
            </li>
            -->
            <!--
              <li class="li_demo"><a href="sendsample">Try It</a></li>
            -->
              <li class="li_flayer"><a href="testflyer">Flyers</a></li>
              <!-- <li class="li_flayer"><a href="themeoption">Theme</a></li> -->
            <li>
              <a class="page-scroll p-r-30 p-r-15" href=<?php echoActiveClassIfRequestMatches("index","contact") ?>>Contact</a>
            </li>
            <!--
            <li class="li_signin" <?php modifyUrlAndClass("signup") ?> >
              <a href="signup" class="signup_btn">Sign up</a>
            </li>
            -->
            <li class="li_login" <?php modifyUrlAndClass("portalexpress") ?> >
              <a href="portalexpress" class="login_btn">Log in</a>
            </li>
            <li class="li_support"><a href="support">Support</a></li>
            <li class="li_paypal"><a target="_blank" href="paypalsetup">Paypal Support</a></li>
            <li>
          </ul>
        </div>
      </div>
    </div><!-- container end -->
  </nav>
</header>
