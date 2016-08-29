/*global define*/

'use strict';

var Vent = require('../Vent'),
    appCache = require('../appCache.js'),
    config = require('../appConfig'),
    loader = require('../loader'),
    viewFactory = require('../viewFactory'),
    saslActions = require('../actions/saslActions'),
    contactActions = require('../actions/contactActions'),
    promotionActions = require('../actions/promotionActions'),
    configurationActions = require('../actions/configurationActions'),
    promotionsController = require('../controllers/promotionsController'),
    galleryActions = require('../actions/galleryActions'),
    catalogActions = require('../actions/catalogActions'),
    mediaActions = require('../actions/mediaActions'),
    updateActions = require('../actions/updateActions'),
    PageLayout = require('./components/pageLayout'),
    h = require('../globalHelpers');

var LandingView = PageLayout.extend({

    name: 'landing',

    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        this.contests = options.contests;
        this.on('show', this.onShow, this);
        this.on('hide', this.onHide, this);
        $('#landing').css({
            'min-height': '0',
            'margin-bottom': '0px'
        });

        // Check if user launches event URL or photoContest URL
        // and open page with current event/photoContest
        switch (community.type) {
            case 'e':
                this.triggerEventView();
            break;
            case 'h':
                this.triggerPhotoContestView();
            break;
            case 'r':
                this.triggerRosterViewFromURL();
            break;
        };
    },

    renderData: function(){
        return _.extend( {}, this.model.attributes, {
            imagePath: config.imagePath,
            isFavorite: this.user.hasFavorite(this.model.get('serviceAccommodatorId'), this.model.get('serviceLocationId'))
        });
    },

    onShow: function(){
        this.addEvents({
            'click .openingHours': 'openHours',
            'click .userMediaService': 'openUpload',
            'click .userReviewsService': 'triggerReviewsView',
            'click .messagingService': 'triggerChatView',
            'click .catalog': 'triggerCatalogsView',
            'click .appointmentService': 'triggerAppointmentView',
            'click .wallService': 'triggerPostsView',
            'click .lVphotoContestButton': 'triggerPhotoContestView',
            'click .poll_submit_button': 'submitPollAction',
            'click .embedded_video': 'activateVideoPlayer',
            'click .theme2_generic_banner': 'triggerAboutUsView',
            'click .theme2_event_entry_right_top_row_calendar a': 'triggerEventView',
            'click #sms_button': 'openSMSInput',
            'click #sms_send_button': 'sendSMSToMobile',

            'click .promotionService': 'openPromotions',
            'click .userPictures': 'openUserPictures',
            'click .uploadPromtion': 'openUploadPromotion',
            'click .uploadGallery': 'openUploadGallery',
            'click .activatePromotion': 'triggerActivatePromotion',
            'click .deActivatePromotion': 'triggerDeActivatePromotion',
            'click .activateGallery': 'triggerActivateGallery',
            'click .deActiveGallery': 'triggerDeActivateGallery',
            'click .outofNetworkPromotions': 'showOutOfNetworkText',
            'click .outofNetworkOpeningHours': 'showOutOfNetworkText',
            'click .outofNetworkUserReviews': 'showOutOfNetworkText'
        });

        this.renderGallery();

        try {
            addToHomescreen().show();
        } catch (e) {
            console.warn(' failed showing addToHomescreen');
        }
    },

    onHide: function() {
        this.$('#cmtyx_staticView').hide();
    },

    renderGallery: function(password) {
        this.$('#cmtyx_staticView').show();
    },

    triggerAboutUsView: function() {
        Vent.trigger('viewChange', 'aboutUs', this.model.getUrlKey());
    },

    triggerRosterViewFromURL: function() {

        var uuid;
        if (community.type == 'r') {
            uuid = community.uuidURL;
            delete community.type;
            delete community.uuidURL;
        } else {
            uuid = $(e.target).attr('uuid');
        };

        Vent.trigger('viewChange', 'roster', {
            sasl: this.model.id,
            id: uuid,
            backToRoster:false,
            rosterId:uuid,
            launchedViaURL:true
         }, { reverse: false });
    },
    openHours: function() {
        loader.show('retrieving opening hours');
        saslActions.getOpeningHours(this.model.sa(), this.model.sl())
            .then(function (hours) {
                this.openSubview('openingHours', hours);
                loader.hide();
            }.bind(this), function () {
                loader.showFlashMessage('error retrieving opening hours');
            });
    },

    openUpload: function() {
        this.withLogIn(function () {
            this.openSubview('upload', this.model, {
                action: function () {
                    loader.show('uploading');
                    return mediaActions.uploadUserMedia.apply(null, arguments)
                        .then(function () {
                            loader.showFlashMessage('upload successful');
                        }, function (e) {
                            loader.showFlashMessage(h().getErrorMessage(e, 'error uploading'));
                        });
                }
            });
        }.bind(this));
    },

    // Go to the clicked on mediascreen photoContest
    triggerPhotoContestView: function(e) {
        var uuid;
        if (community.type == 'h') {
            uuid = community.uuidURL;
            delete community.type;
            delete community.uuidURL;
        } else {
            uuid = $(e.target).attr('uuid');
        };
        Vent.trigger('viewChange', 'photoContest', {
            sasl: this.model.id,
            id: uuid
        });
    },

    triggerEventView: function(e) {
        var uuid;
        if (community.type == 'e') {
            uuid = community.uuidURL;
            delete community.type;
            delete community.uuidURL;
        } else {
            uuid = $(e.target).attr('href').split('=')[1];
        }
        Vent.trigger('viewChange', 'eventActive', {
            sasl: this.model.id,
            id: uuid
        });
    },

    // Clicked poll_submit_button on mediascreen
    submitPollAction: function(e) {
        var uuid = $(e.target).attr('uuid');
        var choice = $('#' + uuid + " input[type='radio']:checked").val();
        updateActions.pollContestAction(uuid,choice);
    },

    // Activate clicked video on mediascreen
    activateVideoPlayer: function(e) {
        var src = $(e.target).closest('.embedded_video').attr('srcmedia');
        $(e.target).closest('.embedded_video').html('<iframe width=\"320\" height=\"240\" src=\"' + src + '\" frameborder=\"0\" allowfullscreen></iframe>').css('background', 'none');
    },

    triggerReviewsView: function() {
        Vent.trigger('viewChange', 'reviews', this.model.getUrlKey() );
    },

    triggerChatView: function() {
        this.withLogIn(function () {
            Vent.trigger('viewChange', 'chat',  this.model.getUrlKey() );
        }.bind(this));
    },

    triggerCatalogsView: function() {
      var saslData = appCache.get('saslData');
      var showRoster=false;
      if (saslData && saslData.services.catalog.catalogAggregationType==='ROSTERIZED') {
        showRoster=true;
      }

      if (showRoster) {
          this.triggerRosterView();
      } else {
          Vent.trigger('viewChange', 'catalogs', this.model.getUrlKey() );
      }

    },

    triggerRosterView: function() {

        /* TODO: need to pull up roster id from api retrieveRosters */
        var uuid = 'ROSTER';//,
            //modelId = this.options.page.model.id;
        Vent.trigger('viewChange', 'roster', {
            //sasl: modelId,
            id: uuid,
            backToRoster:false,
            rosterId:uuid,
            launchedViaURL:false
         }, { reverse: false });
    },

    triggerAppointmentView: function() {
        console.log('open appointment info');
    },

    triggerPostsView: function() {
        Vent.trigger('viewChange', 'posts', this.model.getUrlKey() );
    },

    openPromotions: function(pid) {
        loader.show('retrieving promotions');
        promotionsController.fetchPromotionUUIDsBySasl(
            this.model.get('serviceAccommodatorId'),
            this.model.get('serviceLocationId'),
            this.user.getUID()
        ).then(function(promotions) {
            if(promotions.length < 1) {
                loader.showFlashMessage('No promotions were found');
            } else {
                this.openSubview('promotions', promotions, {pid: pid});
            }
        }.bind(this), function () {
            loader.showFlashMessage('error retrieving promotions');
        });
    },

    openUserPictures: function() {
        loader.show('retrieving user pictures');
        mediaActions.getUserPictures(this.model.sa(), this.model.sl())
            .then(function (pics) {
                this.openSubview('userPictures', pics);
                loader.hide();
            }.bind(this), function () {
                loader.showFlashMessage('error retrieving user pictures');
            });
    },

    openUploadPromotion: function() {
        loader.show('loading');
        promotionActions.getPromotionTypes()
            .then(function (promotionTypes) {
                this.openSubview('upload', this.model, {
                    promotionTypes: promotionTypes,
                    action: function () {
                        loader.show('adding promotion');
                        return promotionActions.createAdhocPromotion.apply(null, arguments)
                            .then(function () {
                                loader.showFlashMessage('promotion added');
                            }, function (e) {
                                loader.showFlashMessage(h().getErrorMessage(e, 'error adding promotion'));
                            });
                    }
                });
                loader.hide();
            }.bind(this), function () {
                loader.showFlashMessage('error retrieving promotion types');
            });
    },

    openUploadGallery: function () {
        loader.show('uploading');
        this.openSubview('upload', this.model, {
            action: function (sa, sl, file, title, message) {
                return galleryActions.createAdhocGalleryItem()
                    .then(function () {
                        loader.showFlashMessage('upload successful');
                    }.bind(this), function (e) {
                        loader.showFlashMessage(h().getErrorMessage(e, 'error uploading'));
                    });
            }
        });
    },

    triggerActivatePromotion: function() {
        Vent.trigger('viewChange', 'editable', {
            sasl: [this.model.sa(), this.model.sl()],
            item: 'promotion',
            action: 'activate'
        });
    },

    triggerDeActivatePromotion: function() {
        Vent.trigger('viewChange', 'editable', {
            sasl: [this.model.sa(), this.model.sl()],
            item: 'promotion',
            action: 'delete'
        });
    },

    triggerActivateGallery: function() {
        Vent.trigger('viewChange', 'editable', {
            sasl: [this.model.sa(), this.model.sl()],
            item: 'gallery',
            action: 'activate'
        });
    },

    triggerDeActivateGallery: function() {
        Vent.trigger('viewChange', 'editable', {
            sasl: [this.model.sa(), this.model.sl()],
            item: 'gallery',
            action: 'delete'
        });
    },

    showOutOfNetworkText: function () {
        var text = "To see live updates and content from this business, please ask them to signup. It is easy and free.";
        this.openSubview('text', {}, {text: text});
    },

    openSMSInput: function() {
        $('.phone_us').mask('(000) 000-0000');
        $("#sms_input_block").slideToggle('1000');
        $('#sms_input').val('').focus();
    },

    sendSMSToMobile: function(e) {
        e.preventDefault();
        e.stopPropagation();

        var mobile = $('.phone_us').val();

        contactActions.sendAppURLForSASLToMobileviaSMS(this.model.sa(), this.model.sl(), mobile)
            .then(function(response, status){
                loader.showFlashMessage( 'Sending message... ' + mobile);
                this.shut();
            }.bind(this), function(jqXHR, status) {
                var errorMessage = "Operation failed";
                if (status === "timeout") {
                    errorMessage = 'Service Unavailable';
                } else {
                    if (typeof jqXHR.responseJSON !== 'undefined') {
                        if (typeof jqXHR.responseJSON.error !== 'undefined') {
                            errorMessage = jqXHR.responseJSON.error.message;
                        }
                    }
                };
                loader.showFlashMessage(errorMessage);
            }.bind(this));
    }

});

module.exports = LandingView;
