/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    viewFactory = require('../viewFactory'),
    ListView = require('./components/listView'),
    PrizeView = require('./partials/prizeView'),
    contestActions = require('../actions/contestActions'),
    h = require('../globalHelpers');

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
                $(this).parent().find('.collapse_btn').removeClass('down');
            } else {
                $(this).parent().find('.collapse_btn').addClass('down');
            }
        });
    },

    onSendPhoto: function() {
        //TODO send photo 
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

    // enterContest: function () {
    //     this.withLogIn(function () {
    //         this.openSubview('upload', this.sasl, {
    //             action: function (sa, sl, file, message) {
    //                 loader.show('');
    //                 return contestActions.enterPhotoContest(sa, sl, this.model.contestUUID, file, message)
    //                     .then(function () {
    //                         loader.showFlashMessage('contest entered');
    //                     }, function (e) {
    //                         loader.showErrorMessage(e, 'error uploading photo');
    //                     });
    //             }.bind(this)
    //         });
    //     }.bind(this));
    // }

});
