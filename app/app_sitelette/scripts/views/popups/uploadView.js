/*global define*/

'use strict';

// require('../../../vendor/canvasResize/canvasResize');

var PopupView = require('../components/popupView'),
    template = require('ejs!../../templates/uploadView.ejs'),
    loader = require('../../loader'),
    h = require('../../globalHelpers');

var UploadView = PopupView.extend({

    template: template,

    id: 'cmntyex_upoad_popup',

    className: 'popup',

    initialize: function(options) {
        this.options = options;
        this.addEvents({
            'click .submit_button':'submitForm',
            'change .file-selector':'resize'
        });

        this.action = options.action;

        this.renderData = {
            uploadPlaceHolder: options.parent.uploadPlaceHolder,
            hideTitle: options.parent.hideTitle,
            promotionTypes: options.promotionTypes
        };
    },

    beforeShow: function(){
        $('.preview').hide();
        var h = $( window ).height();
        var w = $( window ).width();
        this.$el.css({
            // 'max-height': 450,
            'max-width': 300,
            'width': w * 0.85
        });
    },

    resize: function() {
        $('.preview').show();
        var file = this.$('.file-selector')[0].files[0],
            img,
            blob;

        if (file) {
            img = this.$('.preview');
            canvasResize(file, {
                width: 320,
                height: 0,
                crop: false,
                quality: 80,
                callback: function(data, width, height) {
                    $(img).attr('src', data);
                    blob = new Blob([data],{type:'image/jpeg'});
                    blob.name = file.name;
                    this.file = canvasResize('dataURLtoBlob', data);
                }.bind(this)
            });
        }
    },

    submitForm: function() {
        if(typeof(this.$('input[name=title]').val()) != "undefined" && this.$('input[name=title]').val() !== null)
        {
            if (this.$('input[name=title]').val().length <= 0) {
                $('#err_text').html("Select Title.");
                $('#err_text').css("display","block");
                $('#title').css("border","1px solid #FF0000");
                return;
            }
            else
            {
                $('#title').css("border","0");
            }
        }
        
        if(typeof(this.$('textarea').val()) != "undefined" && this.$('textarea').val() !== null)
        {
            if (this.$('textarea').val().length <= 0) {
                $('#err_text').html("Select Message.");
                $('#err_text').css("display","block");
                $('#message').css("border","1px solid #FF0000");
                return;
            }
            else
            {
                $('#message').css("border","0");
            }
        }
        if ( !this.file && !this.options.imageOptional ) {
            $('#err_text').html("Choose Photo.");
            $('#err_text').css("display","block");
            $('#file').css("border","1px solid #FF0000");
            return;
        }
        else
        {
            $('#file').css("border","0");
        }
        
        var title = this.$('input[name=title]').val();
        var message = this.$('textarea').val();
        var promotionType = this.$('select[name=promotiontype]').val();

        return this.action.apply(this, [this.model.sa(), this.model.sl(), this.file, message, title, promotionType])
            .then(function() {
                this.shut();
            }.bind(this));
        }
});

module.exports = UploadView;
