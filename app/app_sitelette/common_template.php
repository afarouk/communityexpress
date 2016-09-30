<?php include_once ('sitefiles/php/detecturl.php')?>
<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
 <!-- Header start -->
 <head>
  <?php
include ('sitefiles/includes/stylesheets.html');
  ?>
  <title>Chalkboards-Template</title>


  <link href="sitefiles/css/file-input/fileinput.min.css" media="all" rel="stylesheet" type="text/css" />


 <!-- Header end -->
</head>
<body data-spy="scroll" data-target=".navbar-fixed-top" >
  <?php
  include ('sitefiles/includes/navbar.php');
  ?>
  <div class="container" style="padding-top:80px;">
    <div class="panel panel-default">
    <div class="panel-heading">
     Template testing tool.
    </div>
    <div class="panel-body">
     <form id="templateTestForm" role="form" class="form-horizontal">
      <div class="row">
       <div class="col-md-6" id="html_col_div">
        <div class="form-group">
         <label class="control-label">Select an html file</label>
         <input id="html_input" name="html_input"   class="form-control  " type = "file"    data-show-preview="false">
         <div id="htmlErrorBlock" class="help-block"></div>
        </div>
       </div>
       <div class="col-md-6" id="css_col_div">
        <div class="form-group">
         <label class="control-label">Select a css file</label>
         <input id="css_input"  name="css_input" type ="file" data-show-preview="false" >
         <div id="cssErrorBlock" class="help-block"></div>
        </div>
       </div>
      </div>

      <!-- second row -->
      <hr>
      <div class="row">

       <div class="col-md-6">
        <div class="form-group">
         <label  for="recipientEmails_input">Enter emails</label>
         <input style="width:100%;" id="recipientEmails_input"  name="recipientEmails_input" type ="text">
        </div>
       </div>
       <div class="col-md-6 selectContainer">
        <div class="form-group">
         <label for="datamodel_input"  >Data model</label>
         <select  style="width:100%;" id="datamodel_input" name="datamodel_input" class="form-control">
          <option disabled selected value> -- select a datamodel -- </option>
          <option value="sitelette">Sitelette</option>
          <option value="zazaemail">ZaZaEmail</option>
         </select>
        </div>
       </div>
      </div>
      <hr>
      <div class="row">
       <div class="col-md-offset-8 col-md-4">
        <h4  >Apply template to data</h4>
        <button type="submit" name="submit" id="applyTemplate" class="ladda-button pull-right btn btn-primary btn-lg" disabled data-style="expand-right">
         <span class="ladda-label">Submit</span><span class="ladda-spinner"></span>
        </button>

       </div>
      </div>
      <div class="row">
       <div id="applyTemplateSuccess" class="alert alert-success fade in" style="display:none;">
        <a href="#" class="close" data-dismiss="alert">&times;</a>
        <strong> Success: &nbsp; </strong><span id="applyTemplateSuccessMessage"></span>
       </div>
      </div>
      <div class="row">
       <div id="applyTemplateError" class="alert alert-danger fade in" style="display:none;">
        <a href="#" class="close" data-dismiss="alert">&times;</a>
        <strong> Error: &nbsp; </strong><span id="applyTemplateErrorMessage"></span>
       </div>
      </div>
     </form>
    </div>
   </div>

  <?php
 include ('sitefiles/includes/footer.php');
   ?>
   <?php
 include ('sitefiles/includes/scriptfiles.html');
   ?>

   <script src="sitefiles/js/file-input/plugins/canvas-to-blob.min.js" type="text/javascript"></script>
   <script src="sitefiles/js/file-input/fileinput.js"></script>
   <script src="sitefiles/js/file-input/fileinput_locale_LANG.js"></script>

   <script>
	$(document).ready(function() {
		parseCommunityURL();
		window.htmlfilename = "";
		window.cssfilename = "";
		/*
		 * ------------- bootstrap fileinput -----------
		 */
		if (window.communityRequestProfile.api_server == 'communitylive.ws')
			window.communityRequestProfile.api_server = 'simfel.com'
		window.server = window.communityRequestProfile.protocol + window.communityRequestProfile.api_server;
		console.log('server being used : ' + window.server);
		window.ladda_template_submit_button = Ladda.create(document.querySelector('#applyTemplate'));

		$("#html_input").fileinput({
      name : 'body.ftl',
			uploadAsync : true,
			uploadUrl : window.server + "/apptsvc/rest/test/template_html_upload",
			showUpload : true,
			showCaption : true,
			showPreview : false,
			elErrorContainer : '#htmlErrorBlock',
			allowedFileExtensions : ['html', 'ftl']
		});
		$("#css_input").fileinput({
			uploadAsync : true,
			uploadUrl : window.server + "/apptsvc/rest/test/template_html_upload",
			showUpload : true,
			showCaption : true,
			showPreview : false,
			elErrorContainer : '#cssErrorBlock',
			allowedFileExtensions : ['css']

		});

		$('#html_input').on('fileuploaded', function(event, data, previewId, index) {
			//var form = data.form, files = data.files, extra = data.extra, response = data.response, reader = data.reader;
			console.log('HTML uploaded ' + data.jqXHR.responseJSON.uploadedFileName);
			window.htmlfilename = data.jqXHR.responseJSON.uploadedFileName;
			//$('#applyTemplate').prop('disabled', false);
			$('#html_col_div').find('.kv-upload-progress').show();

		});

		$('#html_input').on('fileuploaderror', function(event, data, msg) {
			var form = data.form, files = data.files, extra = data.extra, response = data.response, reader = data.reader;
			console.log('File upload error');
			//$('#html_input').fileinput('clear');
			$('#html_col_div').find('.kv-upload-progress').hide();

		});

		$('#css_input').on('fileuploaded', function(event, data, previewId, index) {
			//var form = data.form, files = data.files, extra = data.extra, response = data.response, reader = data.reader;
			console.log('CSS uploaded ' + data.jqXHR.responseJSON.uploadedFileName);
			window.cssfilename = data.jqXHR.responseJSON.uploadedFileName;
			$('#css_col_div').find('.kv-upload-progress').show();
			//$('#applyTemplate').prop('disabled', false);
		});
		$('#css_input').on('fileuploaderror', function(event, data, msg) {
			var form = data.form, files = data.files, extra = data.extra, response = data.response, reader = data.reader;
			console.log('File upload error');
			$('#css_col_div').find('.kv-upload-progress').hide();
		});

		/*---- end fileinput -------------*/
		/*
		 $('#applyTemplate').on('click', function() {

		 window.email = encodeURIComponent($('#destinationemails_input').val());
		 console.log(window.email);
		 window.template = $('#emailtemplate_input').val();

		 var src = window.server + '/apptsvc/rest/test/template_apply_data?htmlfile=' + window.htmlfilename + '&cssfile=' + window.cssfilename + '&emails=' + window.email + '&emailtemplate=' + window.template;

		 alert(src);
		 });*/
	});

	/*
	 * attache bootstrap validators
	 */

	$('#templateTestForm')// IMPORTANT: You must declare .on('init.field.fv')
	// before calling .formValidation(options)
	.on('init.field.fv', function(e, data) {
		// data.fv      --> The FormValidation instance
		// data.field   --> The field name
		// data.element --> The field element

		var $icon = data.element.data('fv.icon'), options = data.fv.getOptions(), // Entire options
		validators = data.fv.getOptions(data.field).validators;
		// The field validators

		if (validators.notEmpty && options.icon && options.icon.required) {
			// The field uses notEmpty validator
			// Add required icon
			$icon.addClass(options.icon.required).show();
		}
	}).find('[name="datamodel_input"]').change(function(e) {
		// revalidate the select when it is changed
		$('#templateTestForm').formValidation('revalidateField', 'datamodel_input');
	}).end().formValidation({
		framework : 'bootstrap',
		icon : {
			required : 'glyphicon glyphicon-asterisk',
			valid : 'glyphicon glyphicon-ok',
			invalid : 'glyphicon glyphicon-remove',
			validating : 'glyphicon glyphicon-refresh'
		},
		fields : {
      /*
			recipientEmails_input : {
				validators : {
					notEmpty : {
						message : 'a valid email file is required'
					}
				}//validators

			},*/
			datamodel_input : {
				validators : {
					notEmpty : {
						message : 'The html file is required'
					}
				}//validators
			}

		}//end fields
	}).on('success.form.fv', function(e) {
		// Prevent form submission
		e.preventDefault();
		console.log("success.form.fv submit");
		window.ladda_template_submit_button.start();

		//var $form = $('#templateApplyForm');
		//var form = $('#registrationForm').get(0);
		window.recipientEmails = encodeURIComponent($('#recipientEmails_input').val());
		console.log(window.recipientEmails);
		window.datamodel = $('#datamodel_input').val();

		var src = window.server + '/apptsvc/rest/test/template_apply_data?htmlfile=' + window.htmlfilename + '&cssfile=' + window.cssfilename + '&recipientEmails=' + window.recipientEmails + '&datamodel=' + window.datamodel;

		console.log("Submittng to API:" + src);
		// Use Ajax to submit form data
		$.ajax({
			url : src,
			type : "POST"
			//dataType : "json"
		}).done(function(data, textStatus, jqXHR) {
			console.log(" apply template executed ");
			$('#applyTemplateError').fadeOut();
			$('#applyTemplateSuccessMessage').text('Please check your email.');
			$('#applyTemplateSuccess').fadeIn();
			/*
			 * reset the input fields
			 *
			 */
			$('#html_input').fileinput('refresh');
			$('#css_input').fileinput('refresh');

		}).fail(function(jqXHR, textStatus, errorThrown) {
			var extractedErrorMessage = processAjaxError(jqXHR);
			$('#applyTemplateSuccess').fadeOut();
			$('#applyTemplateErrorMessage').text(extractedErrorMessage);
			$('#applyTemplateError').fadeIn();
		}).always(function(jqXHR, textStatus, errorThrown) {
			window.ladda_template_submit_button.stop();
			/*
			 * reenable the button
			 */
			$('#templateTestForm').data('formValidation').disableSubmitButtons(false);
		});
		/*
		$.ajax({
		url : $form.attr('action'),
		data : formData,
		cache : false,
		contentType : false,
		processData : false,
		type : 'POST',
		success : function(result) {
		// Process the result ...
		}
		});
		*/

		//formValidation
	});
	/* ---- onDocumentReady()------*/
   </script>


</div>

 </body>
</html>
