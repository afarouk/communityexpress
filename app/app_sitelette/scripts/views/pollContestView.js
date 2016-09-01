/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    PageLayout = require('./components/pageLayout'),
    ListView = require('./components/listView'),
    PollOptionView = require('./partials/pollOptionView'),
    PrizeView = require('./partials/prizeView'),
    contestActions = require('../actions/contestActions'),
    h = require('../globalHelpers');

module.exports = PageLayout.extend({

    name: 'pollContest',

    renderData: function () {
        return $.extend(this.model, {
            activationDate: h().toPrettyTime(this.model.activationDate),
            expirationDate: h().toPrettyTime(this.model.expirationDate)
        });
    },

    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        this.on('show', this.onShow, this);
    },

    onShow: function(){
        this.addEvents({
            'click .back': 'triggerLandingView',
        });
        this.renderOptions();
        this.renderPrizes();
    },

    triggerLandingView: function() {
        Vent.trigger('viewChange', 'restaurant', this.sasl.getUrlKey(), { reverse: true });
    },

    renderPrizes: function () {
        this.$('.cmntyex_prizes_placeholder').html(
            new ListView({
                ListItemView: PrizeView,
                collection: new Backbone.Collection(this.model.prizes),
                update: false,
                dataRole: 'none',
                parent: this
            }).render().el
        );
    },

    renderOptions: function () {
        this.$('.cmntyex_options_placeholder').html(
            new ListView({
                ListItemView: PollOptionView,
                ListItemViewOptions: {
                    onClick: this.onPollClick.bind(this)
                },
                collection: new Backbone.Collection(this.model.choices),
                update: false,
                dataRole: 'none',
                parent: this
            }).render().el
        );
    },

    onPollClick: function(model) {
        this.withLogIn(function () {
            loader.show("");
            contestActions.enterPoll(
                this.sasl.sa(),
                this.sasl.sl(),
                model.get('contestUUID'),
                model.get('choiceId')
            ).then(function () {
                loader.showFlashMessage('Poll entered');
            }, function (e) {
                loader.showErrorMessage(e, 'error entering poll');
            });
        }.bind(this));
    }

});
