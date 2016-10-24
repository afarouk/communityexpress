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
    },

    render: function(photos) {
        console.log('contest', photos);
        this.contest = photos;
        this.$el.html(photoContestTemplate({
            contests: photos
        }));
        this.setLinksForEachPhoto();
        this.initSlick();
        return this;
    },

    initSlick: function() {
        //slick init
        this.$el.find('.body ul.photo_gallery').slick({
            dots: false,
            arrows: true,
            infinite: true,
            speed: 300,
            fade: false,
            cssEase: 'linear',
            slidesToShow: 1
        });
        this.$el.find('button.slick-arrow.slick-prev').wrap( "<div class='slick-arrow-container left'></div>" );
        this.$el.find('button.slick-arrow.slick-next').wrap( "<div class='slick-arrow-container right'></div>" );
        this.$el.find('button.slick-arrow').text('');
    },

    openPhotoByShareUrl: function(uuid) {
        var el = this.$el.find('li[data-uuid="' + uuid + '"]').first(),
            index = el.data('slick-index');

        this.$el.find('.body ul.photo_gallery').slick('slickGoTo', index);
        Vent.trigger('scrollToBlock', '.photo_contest_block');
    },

    showShareBlock: function(e) {
        var $target = $(e.currentTarget),
        $el = $target.next();
        $el.slideToggle('slow');
    },

    showSMSInput: function(e) {
        var $target = $(e.currentTarget),
        $el = $target.parent().find('.sms_input_block');
        $el.find('input').mask('(000) 000-0000');
        $el.slideToggle('slow');
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
        var btn = $(e.currentTarget);
        popupController.requireLogIn(this.sasl, function() {
            var $el = btn.next();
            btn.slideUp('slow');
            $el.show();
            this.initUploader($el);
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
                $(this.element).find('.btn').addClass('cmtyx_text_color_1');
            },
            onAfterProcessImage: function(){
                $(this.element).find('.btn').addClass('cmtyx_text_color_1');
            },
            onAfterCancel: function() {
                $(this.element).removeClass('added');
            }
        });
    },

    toggleCollapse: function() {
        var $el = this.$('.body');
        $el.slideToggle('slow', function(){
            var visible = $(this).is(':visible');
            if (visible) {
                $(this).parent().find('.collapse_btn').html('&#9650;');
            } else {
                $(this).parent().find('.collapse_btn').html('&#9660;');
            }
        });
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
                $el.slideUp('slow');
                this.showPrizes($el);
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
