/*global define*/

'use strict';

var Vent = require('../../Vent'),
    loader = require('../../loader'),
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
        'click .send_photo_btn': 'onSendPhoto'
    },

    initialize: function(options) {
        options = options || {};
        this.sasl = window.saslData;
        this.sa = community.serviceAccommodatorId;
        this.sl = community.serviceLocationId;
        this.getPhotoContest();
    },

    render: function(contest) {
        console.log('contest', contest);
        this.contest = contest;
        // this.$el.html(photoContestTemplate(contest));

        this.$el.html(photoContestTemplate());
        return this;
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
                //TODO manage error
                this.render();
            }.bind(this));
    },

    onSendPhoto: function(e) {
        $(e.currentTarget).slideUp();
        this.$el.find('.photo_contest_upload_image').show();
        this.$el.find('.dropzone').html5imageupload({
            save: false,  // use custom method
            canvas: true, // should be true for handle
            data: {},
            resize: false, // doesn't work correct when true, should be chacked
            onSave: this.onSaveImage.bind(this),
            onAfterSelectImage: function(){
                $(this.element).addClass('added');
            },
            onAfterCancel: function() {
                $(this.element).removeClass('added');
            }
        });
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
            return bb;
        }
    },

    onSaveImage: function(image) {
        var message = this.$el.find('.comntyex-upload_message_input').val(),
            //temporary commennted
            contestUUID = this.contest ? this.contest.contestUUID : '8Moo4I68SMKk1B6bkhbvTQ',
            file = this.dataURLtoBlob(image.data);

        contestActions.enterPhotoContest(this.sa, this.sl, 
            contestUUID, file, message)
            .then(function(result) {
                debugger;
            }.bind(this))
            .fail(function(err){
                //TODO manage error
                debugger;
            }.bind(this));
        //TODO render prises, etc...
    },

    //TODO start with new data in landing subviews
    updateModel: function(model) {
        this.model = model;
    },

    // onShow: function(){
    //     this.addEvents({
    //         'click .back': 'triggerLandingView',
    //         'click .enter_button': 'enterContest'
    //     });
    //     this.renderPrizes();
    // },

    // triggerLandingView: function() {
    //     Vent.trigger('viewChange', 'restaurant', this.sasl.getUrlKey(), { reverse: true });
    // },

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

    //TODO
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
