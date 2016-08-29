/*global define*/

'use strict';

// require('../../../vendor/canvasResize/canvasResize');

var PopupView = require('../components/popupView'),
    RatingView = require('../partials/ratingView'),
    template = require('ejs!../../templates/newReviewView.ejs'),
    loader = require('../../loader'),
    h = require('../../globalHelpers');

var NewReview = PopupView.extend({

    template: template,

    id: 'cmntyex_new_review_popup',

    className: 'popup',

    initialize: function(options) {
        this.options = options;
        this.addEvents({
            'click .submit_button':'submitForm',
            'change .file-selector':'resize'
        });
        options.hideTitle = this.parent.hideTitle;
        this.action = options.action;

        this.renderData = {
            hideTitle: options.parent.hideTitle,
            promotionTypes: options.promotionTypes
        };

    },

    renderRating: function () {
        this.ratingView = new RatingView();
        this.ratingView.render();
        this.$('.cmntyex-rating-placeholder').html(this.ratingView.$el);
    },

    beforeShow: function () {
        $('.preview').hide();
        var h = $( window ).height();
        var w = $( window ).width();
        this.$el.css({
            'max-height': 450,
            'max-width': 300,
            'width': w * 0.8
        });
        this.renderRating();
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
        var rating = this.ratingView.val();
        console.log(this.file);
        loader.show('adding review');

        return this.action.apply(this, [this.model.sa(), this.model.sl(), this.file, title, message, rating])
        .then(function() {
            loader.showFlashMessage('review added');
            this.shut();
        }.bind(this), function(e) {
            loader.showFlashMessage(h().getErrorMessage(e, 'error adding review'));
        });

    },

    onClose: function () {
        this.ratingView.remove();
    }
});

module.exports = NewReview;
