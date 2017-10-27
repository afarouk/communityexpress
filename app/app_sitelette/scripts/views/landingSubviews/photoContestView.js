/*global define*/

'use strict';

var Vent = require('../../Vent'),
    loader = require('../../loader'),
    contactActions = require('../../actions/contactActions'),
    appCache = require('../../appCache.js'),
    viewFactory = require('../../viewFactory'),
    ListView = require('../components/listView'),
    PrizeView = require('../partials/prizeView'),
    contestActions = require('../../actions/contestActions'),
    popupController = require('../../controllers/popupController'),
    userController = require('../../controllers/userController'),
    contestActions = require('../../actions/contestActions'),
    photoContestTemplate = require('ejs!../../templates/landingSubviews/photoContestView.ejs'),
    h = require('../../globalHelpers');

module.exports = Backbone.View.extend({
    name: 'photoContest',
    el: '#cmtyx_photo_contest_block',

    events: {
        'click .header': 'toggleCollapse',
        'click .send_photo_btn': 'onClickSendPhoto',
        'click .photo_image': 'checkIfAnswered',
        'click .share_btn_block': 'showShareBlock',
        'click .sms_block': 'showSMSInput',
        'click .sms_send_button': 'onSendSMS'
    },

    initialize: function(options) {
        options = options || {};
        this.sasl = window.saslData;
        this.sa = community.serviceAccommodatorId;
        this.sl = community.serviceLocationId;
        Vent.on('openPhotoByShareUrl', this.openPhotoByShareUrl, this);

        this.medicalType = window.saslData.domainEnum === 'MEDICURIS' ||
            window.saslData.domainEnum === 'MOBILEVOTE' ? true : false;
    },

    render: function(photos) {
        // console.log('contest', photos);
        this.contest = photos;
        this.$el.html(photoContestTemplate({
            contests: photos,
            medical: this.medicalType
        }));
        if (!this.medicalType) {
            this.setLinksForEachPhoto();
        }
        
        var $el = this.$('.body'),
        visible = $el.is(':visible');
        this.slicked = false;
        if (visible) this.initSlick();

        this.resolved();
        return this;
    },

    onShow: function() {
        this.unslick();

        var $el = this.$('.body'),
            visible = $el.is(':visible');

        this.slicked = false;
        if (visible) this.initSlick();
    },

    unslick: function() {
        var $el = this.$el.find('.body ul.photo_gallery'),
            initialized = $el.hasClass('slick-initialized');
        if (!initialized) return;
        $el.find('.slick-arrow-container').remove();
        $el.slick('unslick');
    },

    initSlick: function() {
        this.slicked = true;
        //slick init
        this.$el.find('.body ul.photo_gallery').slick({
            dots: false,
            arrows: true,
            infinite: true,
            speed: 300,
            fade: false,
            cssEase: 'linear',
            slidesToShow: 1,
            adaptiveHeight: true
        });
        this.$el.find('button.slick-arrow.slick-prev').wrap( "<div class='slick-arrow-container left'></div>" );
        this.$el.find('button.slick-arrow.slick-next').wrap( "<div class='slick-arrow-container right'></div>" );
        this.$el.find('button.slick-arrow').text('');
      },

    openPhotoByShareUrl: function(uuid) {
        var callback = _.bind(function() {
            var el = this.$el.find('li[data-uuid="' + uuid + '"]').first(),
                index = el.data('slick-index');

            this.$el.find('.body ul.photo_gallery').slick('slickGoTo', index);
            Vent.trigger('scrollToBlock', '.photo_contest_block');
        }, this);
        this.toggleCollapse(callback);
    },

    showShareBlock: function(e) {
        if (this.animating) return;
        this.animating = true;
        var $target = $(e.currentTarget),
            $el = $target.next(),
            visible = $el.is(':visible'),
            visibleSMS = $el.find('.sms_input_block').is(':visible'),
            height = 70;
        if (visible && visibleSMS) {
            this.$('.sms_input_block').hide();
            height = 140;
        }
        this.changeSlideHeight($el, height);
        $el.slideToggle('slow', _.bind(function() {
            this.animating = false;
        }, this));
    },

    showSMSInput: function(e) {
        if (this.animating) return;
        this.animating = true;
        var $target = $(e.currentTarget),
            $el = $target.parent().find('.sms_input_block');
        this.changeSlideHeight($el, 70);
        $el.find('input').mask('(000) 000-0000');
        $el.slideToggle('slow', _.bind(function() {
            this.animating = false;
        }, this));
    },

    changeSlideHeight: function($target, additional) {
        var $el = $target.parents('.slick-list[aria-live="polite"]'),
            height = $el.height(),
            visible = $target.is(':visible');
        if (visible) additional = -additional;
        $el.css('transition', '0.3s');
        $el.height(height + additional + 'px');
    },

    getLinks: function(uuid) {
        var demo = window.community.demo ? 'demo=true&' : '',
          shareUrl = window.encodeURIComponent(window.location.href.split('?')[0] +
            '?' + demo + 't=h&u=' + uuid),
          links = [
              '',
              'mailto:?subject=&body=' + shareUrl,
              'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl,
              'https://twitter.com/intent/tweet?text=' + shareUrl
          ];
        return links;
    },

    setShareLinks: function($photo) {
        var $block = $photo.find('.share_block'),
            uuid = $block.data('uuid'),
            links = this.getLinks(uuid),
            $links = $block.find('a');

        $links.each(function(index){
            var link = $(this);
            link.attr('href', links[index]);
        });
    },

    setLinksForEachPhoto: function() {
        var $contests = this.$el.find('.photo_item');
        $contests.each(function(index, el){
            var $photo = $(el);
            this.setShareLinks($photo);
        }.bind(this));
    },

    onSendSMS: function(e) {
        var $target = $(e.currentTarget),
            $el = $target.parent(),
            uuid = $target.parent().data('uuid'),
            demo = window.community.demo ? 'demo=true&' : '',
            shareUrl = window.location.href.split('?')[0] +
              '?' + demo + 't=p&u=' + uuid,
            val = $target.prev().val(); //(650) 617-3439

        loader.showFlashMessage('Sending message to... ' + val);
        this.changeSlideHeight($el, 70);
        $el.slideUp('slow');
        contactActions.shareURLviaSMS('PHOTO_CONTEST', this.sasl.serviceAccommodatorId,
            this.sasl.serviceLocationId, val, uuid, shareUrl)
          .then(function(res){
            loader.showFlashMessage('Sending message success.');
          }.bind(this))
          .fail(function(res){
            if (res.responseJSON && res.responseJSON.error) {
              loader.showFlashMessage(res.responseJSON.error.message);
            }
          }.bind(this));
    },

    checkIfAnswered: function(e) {
        var $target = $(e.currentTarget),
            $uploader = $target.parent().find('.photo_contest_upload_image'),
            index = $target.data('index'),
            status = this.contest[index].responseStatus;
        if (status.enumText === 'ANSWERED') {
            this.showPrizes($uploader);
        }
    },

    afterTriedToLogin: function() {
        this.getPhotoContest();
    },

    onClickSendPhoto: function(e) {
        var btn = $(e.currentTarget),
            $container = btn.parent();
        popupController.requireLogIn(this.sasl, function() {
            var $el = btn.next();
            btn.slideUp('slow');
            $el.show();
            this.initUploader($el);
            var height = -($container.find('.photo_contest_upload_image').height() - btn.height());
            this.changeSlideHeight($el, height);
        }.bind(this));
    },

    initUploader: function($el) {
        $el.find('.dropzone').html5imageupload({
            ghost: false,
            save: false,
            canvas: true,
            data: {},
            resize: false,
            onSave: this.onSaveImage.bind(this, $el),
            onAfterSelectImage: function(){
                $(this.element).addClass('added');
            },
            onToolsInitialized: function(){
                $el.find('.dropzone').find('.btn').addClass('cmtyx_text_color_1');
                var height = -($el.find('.dropzone').height() - 100);
                this.changeSlideHeight($el, height);
            }.bind(this),
            onAfterProcessImage: function(){
                $(this.element).find('.btn').addClass('cmtyx_text_color_1');
                var height = 450;
                this.changeSlideHeight($el, height);
            }.bind(this),
            onAfterCancel: function() {
                $el.find('.dropzone').removeClass('added');
                var height = 400;
                this.changeSlideHeight($el, height);
            }.bind(this)
        });
    },

    toggleCollapse: function(callback) {
        var $el = this.$('.body');
        $el.slideToggle('slow', _.bind(function(){
            var visible = $el.is(':visible');
            if (visible) {
                $el.parent().find('.collapse_btn').html('&#9650;');
                if (!this.slicked) this.initSlick();
                if (typeof callback === 'function') callback();
            } else {
                $el.parent().find('.collapse_btn').html('&#9660;');
            }
        }, this));
    },

    getPhotoContest: function() {
        contestActions.photoBySASL(this.sa,this.sl)
            .then(function(contest) {
                if (contest) {
                    this.render(contest);
                }
            }.bind(this))
            .fail(function(err){
                this.$el.hide();
            }.bind(this));
    },

    showPrizes: function($el) {
        $el.next().slideDown('slow');
    },

    onSaveImage: function($el, image) {
        var message = $el.find('.comntyex-upload_message_input').val(),
            contestUUID = $el.data('uuid'),
            file = h().dataURLtoBlob(image.data);

        contestActions.enterPhotoContest(this.sa, this.sl,
            contestUUID, file, message)
            .then(function(result) {
                if (this.medicalType) {
                    this.render(this.contest);
                } else {
                    $el.slideUp('fast', function() {
                        $el.next().slideDown('fast', function() {

                        }.bind(this));
                    }.bind(this));
                }
                // this.showPrizes($el);
                loader.showFlashMessage('contest entered');
            }.bind(this))
            .fail(function(err){
                //TODO manage error
                loader.showErrorMessage(e, 'error uploading photo');
            }.bind(this));
    },

    enterContest: function () {
        var user = userController.getCurrentUser(),
            sasl = user.favorites.at(0);
        popupController.requireLogIn(sasl, function() {
            popupController.upload(sasl, {
                action: function (sa, sl, file, message) {
                    loader.show('');
                    // this.model.contestUUID null because we should get contests
                    return contestActions.enterPhotoContest(sa, sl, null, file, message)
                        .then(function () {
                            loader.showFlashMessage('contest entered');
                        }, function (e) {
                            loader.showErrorMessage(e, 'error uploading photo');
                        });
                }.bind(this)
            });
        }.bind(this));
    }

});
