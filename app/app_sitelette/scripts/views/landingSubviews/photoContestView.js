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
        this.sasl = options.sasl;
        this.hideTitle = true;
        this.uploadPlaceHolder = 'Caption';
        // this.on('show', this.onShow, this);
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

    onSendPhoto: function() {
        //TODO send photo 
        this.enterContest();
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
