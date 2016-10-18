/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    mediaActions = require('../actions/mediaActions'),
    popupController = require('../controllers/popupController'),
    h = require('../globalHelpers'),
    template= require('ejs!../templates/uploadPhotoView.ejs');

var UploadPhotoView = Backbone.View.extend({
    name: 'upload_photo',
    id: 'cmtyx_uploadPhoto',

    events: {
        'click .add_new_photo_btn': 'onClickAddNewPhoto',
        'click .save_button': 'onSendPhoto',
        'click .close_button': 'goBack',
        'keydown .upload_title': 'removeTitleError',
        'keydown .upload_description': 'removeDescriptionError',
        'change select': 'removeSelectError'
    },

    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        this.restaurant = options.restaurant;
        this.on('show', this.onShow, this);
        //temp hardcoded
        this.renderData = {
            models: options.pics,
            promotionTypes: options.types
        };
        this.render();
        if (options.pics.length > 0) {
            this.initSlick();
        }
    },
    render: function(){
        this.$el.html(template(this.renderData));
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    renderContent : function (options){
        return this.$el;
    },

    onShow:  function() {
        loader.hide();
    },

    initSlick: function() {
        this.$el.find('.gallery').slick({
            dots: false,
            arrows: true,
            infinite: true,
            speed: 300,
            fade: false,
            cssEase: 'linear',
            slidesToShow: 3
        });
        this.$el.find('button.slick-arrow').css("top", 
            this.$el.find('.body ul').height() + 30 + "px");
        this.$el.find('button.slick-prev.slick-arrow').text('').css("border-right-color", $('.cmtyx_color_3').css('background-color'));
        this.$el.find('button.slick-next.slick-arrow').text('').css("border-left-color", $('.cmtyx_color_3').css('background-color'));
        this.$el.find('.gallery .slick-slide').on('click', function(e){
            this.$el.find('.gallery_item').removeClass('selected');
            $(e.currentTarget).addClass('selected');
            this.$el.find('.gallery_block').removeClass('error');
        }.bind(this));
        setTimeout(function(){ //tweak for slick gallery
            this.$el.find('button.slick-next').trigger('click');
        }.bind(this), 100);
    },

    onClickAddNewPhoto: function(e) {
        this.addNewPhoto = true;
        this.$('.gallery_block').slideUp('slow');
        this.$el.find('.upload_photo').show();
        this.initUploader();
    },

    initUploader: function() {
        var that = this;
        this.$el.find('.dropzone').html5imageupload({
            ghost: false,
            save: false,
            canvas: true,
            data: {},
            resize: false,
            onSave: this.onSaveImage.bind(this),
            onAfterSelectImage: function(){
                $(this.element).addClass('added');
            },
            onToolsInitialized: function(){
                $(this.element).find('.btn').addClass('cmtyx_text_color_1');
            },
            onAfterProcessImage: function(){
                $(this.element).find('.btn').addClass('cmtyx_text_color_1');
            },
            onAfterCancel: function() {
                $(this.element).removeClass('added');
                that.file = null;
            }
        });
    },

    onSaveImage: function(image) {
        this.file = h().dataURLtoBlob(image.data);
        this.$el.find('.upload_photo').removeClass('error');
    },

    onSendPhoto: function () {
        var error = false,
            description = this.$el.find('.upload_description').val(),
            title = this.$el.find('.upload_title').val(),
            promotionType = this.$('select[name=promotiontype]').val() || '';

        if (this.addNewPhoto) {
            if (!this.file) {
                this.$el.find('.upload_photo').addClass('error');
                error = true;
            }
        } else {
            this.$el.find('.gallery_block').addClass('error');
            error = true;
            //TODO check if selected and use it for upload???
        }
        if (!promotionType) {
            this.$el.find('.promotions_block').addClass('error');
            error = true;
        }
        if (!title) {
            this.$el.find('.title_block').addClass('error');
            error = true;
        }
        if (!description) {
            this.$el.find('.description_block').addClass('error');
            error = true;
        }
        if (error) return;

        loader.show('uploading');

        mediaActions.uploadUserMedia(this.sasl.sa(), this.sasl.sl(), this.file, title, description, promotionType)
            .then(function () {
                loader.hide();
                popupController.textPopup(
                    { text: 'Photo was uploaded successfully' }, 
                    this.goBack.bind(this));
            }.bind(this), function (e) {
                loader.showFlashMessage(h().getErrorMessage(e, 'error uploading'));
            });
    },

    removeTitleError: function() {
        this.$el.find('.title_block').removeClass('error');
    },

    removeDescriptionError: function() {
        this.$el.find('.description_block').removeClass('error');
    },

    removeSelectError: function() {
        this.$el.find('.promotions_block').removeClass('error');
    },

    goBack: function() {
        Vent.trigger( 'viewChange', 'restaurant', this.sasl.getUrlKey());
    }
});

module.exports = UploadPhotoView;
