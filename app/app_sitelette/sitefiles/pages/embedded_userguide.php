<?php include_once ('sitefiles/php/detecturl.php') ?>
<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
 <head>
  <?php
include ('sitefiles/includes/stylesheets.html');
  ?>
  <title>Chalkboards-Userguide</title>
 </head>
 <body data-spy="scroll" data-target=".navbar-fixed-top" >
  <!-- Header start -->
  <!-- Header end -->
  <?php
include ('sitefiles/pages/common_userguide.html');
  ?>

<?php
include ('sitefiles/includes/scriptfiles.html');
?>

<script>
    $(document).ready(function(){
        // Add minus icon for collapse element which is open by default
        $(".collapse.in").each(function(){
          $(this).siblings(".panel-heading").find(".glyphicon").addClass("glyphicon-minus").removeClass("glyphicon-plus");
        });

        // Toggle plus minus icon on show hide of collapse element
        $(".collapse").on('show.bs.collapse', function(){
          $(this).parent().find(".glyphicon").removeClass("glyphicon-plus").addClass("glyphicon-minus");
        }).on('hide.bs.collapse', function(){
          $(this).parent().find(".glyphicon").removeClass("glyphicon-minus").addClass("glyphicon-plus");
        });
    });
</script>
<script>
$(document).ready(function() {
   $('#userguide').css('margin-top',"0px");
});
</script>
</body>
</html>
