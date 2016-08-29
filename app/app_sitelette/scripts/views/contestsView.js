/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    viewFactory = require('../viewFactory'),
    PageLayout = require('./components/pageLayout'),
    ListView = require('./components/listView'),
    ContestView = require('./partials/contestItemView');

var ContestsView = PageLayout.extend({

    name: 'contests',

    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        this.contests = options.contests;
        this.on('show', this.onShow, this);
    },

    onShow: function(){
        this.addEvents({
            'click .back': 'triggerLandingView',
        });
        this.renderContests();
    },

    renderContests: function() {
        this.$('.cmntyex-contests_placeholder').html(new ListView({
            ListItemView: ContestView,
            ListItemViewOptions: {
                onClick: this.goToContest.bind(this)
            },
            className: 'ui-listview',
            collection: this.contests,
            update: false,
            parent: this
        }).render().el);
    },

    goToContest: function (type, id) {
        switch (type) {
            case 'PHOTO_CONTEST':
                Vent.trigger('viewChange', 'photoContest', {
                    sasl: this.sasl.getUrlKey(),
                    id:id
                });
                break;
            case 'POLL_CONTEST':
                Vent.trigger('viewChange', 'pollContest', {
                    sasl: this.sasl.getUrlKey(),
                    id:id
                });
                break;
            case 'CHECKIN_CONTEST':
                Vent.trigger('viewChange', 'checkinContest', {
                    sasl: this.sasl.getUrlKey(),
                    id:id
                });
                break;
        }
    },

    triggerLandingView: function() {
        Vent.trigger('viewChange', 'restaurant', this.sasl.getUrlKey(), { reverse: true });
    },

});

module.exports = ContestsView;
