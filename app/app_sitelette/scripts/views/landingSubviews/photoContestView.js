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

    // renderData: function () {
    //     return $.extend(this.model, {
    //         activationDate: h().toPrettyTime(this.model.activationDate),
    //         expirationDate: h().toPrettyTime(this.model.expirationDate)
    //     });
    // },

    events: {
        'click .header': 'toggleCollapse',
        'click .send_photo_btn': 'onClickSendPhoto',
        'click .body>img': 'checkIfAnswered',
        'click .share_btn_block': 'showShareBlock',
        'click .sms_block': 'showSMSInput',
        'click .sms_send_button': 'onSendSMS'
    },

    initialize: function(options) {
        options = options || {};
        this.sasl = window.saslData;
        this.sa = community.serviceAccommodatorId;
        this.sl = community.serviceLocationId;
    },

    render: function(contest) {
        console.log('contest', contest);
        this.contest = contest;
        this.$el.html(photoContestTemplate(contest));
        this.setShareLinks();
        return this;
    },

    showShareBlock: function() {
        var $el = this.$el.find('.share_block');
        $el.slideToggle('slow');
    },

    showSMSInput: function() {
        var $el = this.$el.find('.sms_input_block');
        $el.slideToggle('slow');
        $el.find('input').mask('(000) 000-0000');
    },

    getLinks: function() {
        var demo = window.community.demo ? 'demo=true&' : '',
          uuid = this.contest.contestUUID,
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

    setShareLinks: function() {
        var $block = this.$el.find('.share_block'),
          links = this.getLinks(),
          $links = $block.find('a');

        $links.each(function(index){
          var link = $(this);
          link.attr('href', links[index]);
        });
    },

    onSendSMS: function(e) {
        var $el = this.$el.find('.sms_input_block'),
            $target = $(e.currentTarget),
            uuid = this.contest.contestUUID,
            val = $target.prev().val(); //(650) 617-3439

        loader.showFlashMessage('Sending message to... ' + val);
        $el.slideUp('slow');
        contactActions.sendAppURLForSASLToMobileviaSMS(this.sasl.serviceAccommodatorId, this.sasl.serviceLocationId, val, uuid)
          .then(function(res){
            loader.showFlashMessage('Sending message success.');
          }.bind(this))
          .fail(function(res){
            if (res.responseJSON && res.responseJSON.error) {
              loader.showFlashMessage(res.responseJSON.error.message);
            }
          }.bind(this));
    },

    checkIfAnswered: function() {
        var status = this.contest.responseStatus;
        if (status.enumText === 'ANSWERED') {
            this.showPrizes();
        }
    },

    afterTriedToLogin: function() {
        this.getPhotoContest();
    },

    onClickSendPhoto: function(e) {
        var btn = $(e.currentTarget);
        popupController.requireLogIn(this.sasl, function() {
            btn.slideUp('slow');
            this.$el.find('.photo_contest_upload_image').show();
            this.initUploader();
        }.bind(this));
    },

    initUploader: function() {
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

    dataURLtoBlob: function(data) {
        var mimeString = data.split(',')[0].split(':')[1].split(';')[0];
        var byteString = atob(data.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var bb = (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder);
        if (bb) {
            bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)();
            bb.append(ab);
            return bb.getBlob(mimeString);
        } else {
            bb = new Blob([ab], {
                'type': (mimeString)
            });
            return bb;this.showPrizes();
        }
    },

    showPrizes: function() {
        this.$el.find('.prizes_container').slideDown('slow');
    },

    onSaveImage: function(image) {
        var message = this.$el.find('.comntyex-upload_message_input').val(),
            contestUUID = this.contest.contestUUID,
            file = this.dataURLtoBlob(image.data);

        contestActions.enterPhotoContest(this.sa, this.sl, 
            contestUUID, file, message)
            .then(function(result) {
                this.$el.find('.photo_contest_upload_image').slideUp('slow');
                this.showPrizes();
                loader.showFlashMessage('contest entered');
            }.bind(this))
            .fail(function(err){
                //TODO manage error
                loader.showErrorMessage(e, 'error uploading photo');
            }.bind(this));
    },

    // renderPrizes: function () {
    //     this.$('.cmntyex_prizes_placeholder').html(
    //         new ListView({
    //             ListItemView: PrizeView,
    //             collection: new Backbone.Collection(this.model.prizes),
    //             update: false,
    //             dataRole: 'none',
    //             parent: this
    //         }).render().el
    //     );
    // },

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
