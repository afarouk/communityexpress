/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    ListView = require('./components/listView'),
    PollOptionView = require('./partials/pollOptionView'),
    PrizeView = require('./partials/prizeView'),
    contestActions = require('../actions/contestActions'),
    h = require('../globalHelpers');

module.exports = Backbone.View.extend({

    name: 'pollContest',

    el: '#cmtyx_poll_block',

    events: {
        'click .header': 'toggleCollapse'
    },

    // renderData: function () {
    //     return $.extend(this.model, {
    //         activationDate: h().toPrettyTime(this.model.activationDate),
    //         expirationDate: h().toPrettyTime(this.model.expirationDate)
    //     });
    // },

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

    //TODO functionality!!!

    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        this.sa = community.serviceAccommodatorId;
        this.sl = community.serviceLocationId;
        Vent.on('login_success', this.onLogin, this);
        Vent.on('logout_success', this.onLogout, this);
        // Temporary
        this.$el.find('.poll_results').hide()
            .before('<button class="submit_poll_button open_menu_btn cmtyx_border_color_1 cmtyx_text_color_1 ui-btn ui-corner-all">submit</button>');
        this.$el.find('.submit_poll_button').click(_.bind(this.submitPoll, this));
    },

    onLogin: function() {
        this.getContests();
    },

    onLogout: function() {
    
    },

    submitPoll: function() {
        this.$el.find('.submit_poll_button').slideUp('slow');
        this.$el.find('.poll_results').slideDown('slow');
        var choise = this.$el.find('input.ansRadioChoice:checked').attr('id');
        console.log(choise);

        // this.onPollClick();
    },

    getContests: function() {
        contestActions.getContests(this.sa,this.sl)
            .then(function(contests) {
                console.log('contests', contests);
            });
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

    // renderOptions: function () {
    //     this.$('.cmntyex_options_placeholder').html(
    //         new ListView({
    //             ListItemView: PollOptionView,
    //             ListItemViewOptions: {
    //                 onClick: this.onPollClick.bind(this)
    //             },
    //             collection: new Backbone.Collection(this.model.choices),
    //             update: false,
    //             dataRole: 'none',
    //             parent: this
    //         }).render().el
    //     );
    // },

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
