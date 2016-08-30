<!DOCTYPE html>
<html lang="en">
 <head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <meta charset="utf-8">
  <meta name="description" content="">
  <meta name="keywords" content="">
<title><?php
if (isset($saslName)) {
  echo $saslName;
} else
  echo 'chalkboardstoday.com';
?></title>
  <!--[if IE]>
  <script src="https://html5shim.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->

  <link href="desktop/bootstrap/bootstrap.min.css" rel="stylesheet">
  <link href="desktop/owl.carousel.min.css" rel="stylesheet">
  <link href="desktop/owl.theme.default.min.css" rel="stylesheet">
  <link href="desktop/owl.transitions.css" rel="stylesheet">
  <link href="desktop/formvalidation/formValidation.min.css" rel="stylesheet">
  <link href="desktop/ladda-bootstrap/ladda-themeless.min.css" rel="stylesheet">

  <link href="desktop/desktop.css" rel="stylesheet">
 </head>
 <body>
  <div class="container-fluid   picture_background">
   <div class="row">
    <div class="col-sm-12">
     <div class="container top_gap">
      <div class="row">
       <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 phone_bar" style="min-width:370px;">
        <div class="phone_wrapper"  >
           <iframe id="communityexpress" class=" " width=320 height=568  src="" frameborder="0" ></iframe>
        </div>
       </div>

       <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
        <!--  FORM row  -->
        <div id="demosite_form_row" class="row  " style="height: 500px;">
         <div style="height:40px;"></div>
         <h2>Send the app to your smartphone. </h2>
         <form id="demosite_email_form" role="form" class="form-horizontal">
          <div class="form-group">
           <label class="col-xs-3 control-label">Email</label>
           <div class="col-xs-9">
            <input id="share_email" type="text" class="form-control" name="share_email" placeholder="email" />
           </div>
          </div>
          <div class="form-group">
           <div class="col-xs-9 col-xs-offset-3">
            <div class="checkbox">
             <label>
              <input id="certify_email" type="checkbox" name="certify_email" value="certify_email" />
              I
              certify that the recipient has agreed. </label>
            </div>
           </div>
          </div>
          <div class="form-group">
           <div class="col-xs-9 col-xs-offset-3">
            <button id="submit_email" type="submit" class="btn btn-primary ladda-button" data-style="expand-left"
            name="submit_email" value="submit_email">
             Send
            </button>
           </div>
          </div>
         </form>
         <hr style="height: 30px; border: none;" />

         <form id="demosite_mobile_form" role="form" class="form-horizontal">
          <div class="form-group">
           <label class="col-xs-3 control-label">Mobile</label>
           <div class="col-xs-9">
            <input id="share_mobile" type="text" class="form-control" name="share_mobile" placeholder="mobile number" />
           </div>
          </div>
          <div class="form-group">
           <div class="col-xs-9 col-xs-offset-3">
            <div class="checkbox">
             <label>
              <input id="certify_mobile" type="checkbox" name="certify_mobile" value="certify_mobile" />
              I
              certify that the recipient has agreed. </label>
            </div>
           </div>
          </div>
          <div class="form-group">
           <div class="col-xs-9 col-xs-offset-3">
            <button id="submit_mobile" type="submit" class="btn btn-primary ladda-button" data-style="expand-left"
            name="submit_mobile" value="submit_mobile">
             Send
            </button>
           </div>
          </div>
         </form>

        </div>
        <!-- ERROR row -->
        <div id="demosite_error_row" class="row  " style="display: none; height: 500px;">
         <h2>Error</h2>
         <div id="demosite_error_message">
          Invalid request
         </div>
        </div>
        <!-- RESULTS row -->
        <div id="demosite_result_row" class="row  " style="display: none; height: 500px;">
         <h2>Results</h2>
         <div id="demosite_message"></div>
        </div>
       </div>

       <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">

        <!-- Owl Slider -->

        <div>
         <div id="demoinstructions_carousel" class="owl-carousel owl-theme" >
          <div>
           <img src="desktop/images/demosite/demosite_carousel_1.jpg" width=100px  alt="First slide">
          </div>
          <div>
           <img src="desktop/images/demosite/demosite_carousel_2.jpg" width=100px alt="Second slide">
          </div>
          <div>
           <img src="desktop/images/demosite/demosite_carousel_3.jpg" width=100px alt="Third slide">
          </div>
          <div>
           <img src="desktop/images/demosite/demosite_carousel_4.jpg" width=100px alt="Fourth slide">
          </div>
          <div>
           <img src="desktop/images/demosite/demosite_carousel_5.jpg" width=100px alt="Fifth slide">
          </div>
         </div>
        </div>

        <!-- END Carousel -->
        <hr style="border: none;" />
        <hr style="border: none;" />
       </div>

      </div>
     </div>
    </div>

   </div>
  </div>
  <script src="desktop/jquery.js"></script>

  <script src="desktop/URI.min.js"></script>
  <script src="desktop/common_utility.js"></script>

  <script src="desktop/bootstrap/bootstrap.min.js"></script>

  <script src="desktop/owl.carousel.min.js"></script>

  <script src="desktop/ladda-bootstrap/spin.min.js"></script>
  <script src="desktop/ladda-bootstrap/ladda.jquery.min.js"></script>
  <script src="desktop/ladda-bootstrap/ladda.min.js"></script>
  <script src="desktop/formvalidation/formValidation.min.js"></script>
  <script src="desktop/formvalidation/formValidation.min.js"></script>
  <script src="desktop/formvalidation/framework/bootstrap.min.js"></script>
  <script src="desktop/formvalidation/mandatoryIcon.min.js"></script>

  <script src="desktop/desktop.js"></script>

 </body>
</html>
