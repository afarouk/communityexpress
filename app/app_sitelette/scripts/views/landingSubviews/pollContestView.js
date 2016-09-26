/*global define*/

'use strict';

var Vent = require('../../Vent'),
    loader = require('../../loader'),
    gateway = require('../../APIGateway/gateway.js'),
    ListView = require('../components/listView'),
    jqPlotOptions = require('./jqPlotOptions'),
    PollOptionView = require('../partials/pollOptionView'),
    PrizeView = require('../partials/prizeView'),
    contestActions = require('../../actions/contestActions'),
    userController = require('../../controllers/userController'),
    popupController = require('../../controllers/popupController'),
    pollTemplate = require('ejs!../../templates/landingSubviews/pollTemplateView.ejs'),
    h = require('../../globalHelpers');

module.exports = Backbone.View.extend({

    name: 'pollContest',

    el: '#cmtyx_poll_block',

    events: {
        'click .header': 'toggleCollapse',
        'click .submit_poll_button': 'submitPoll'
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

    initialize: function(options) {
        options = options || {};
        this.sasl = window.saslData;
        this.sa = community.serviceAccommodatorId;
        this.sl = community.serviceLocationId;
    },

    render: function(poll) {
        console.log('poll', poll);
        this.poll = poll;
        this.$el.html(pollTemplate(poll));
        return this;
    },

    afterTriedToLogin: function() {
        this.getPollContest();
    },

    submitPoll: function() {
        popupController.requireLogIn(this.sasl, function() {
            var choise = this.$el.find('input.ansRadioChoice:checked').data('choice');
            console.log(choise);
            contestActions.enterPoll(this.sa,this.sl, this.poll.contestUUID, choise)
                .then(function(result) {
                    this.displayResults(result);
                }.bind(this))
                .fail(function(err){
                    popupController.textPopup({ text: 'You already answered this question.'});
                }.bind(this));
            this.$el.find('.submit_poll_button').slideUp('slow');
            this.$el.find('.prize_block').slideDown('slow');
        }.bind(this));
    },

    getColors: function() {
        var $elements = this.$el.find('.answer_color_container'),
            colors = [];
        $elements.each(function(){
            colors.push($(this).css('background-color'));
        });

        return colors;
    },

    displayResults: function(result) {
        this.$el.find('.poll_results').show();
        var choices = result.choices,
            options = jqPlotOptions.options,
            colorChoices = this.getColors();

            var array = [], a = [], b = [];
            _.each(choices, function(choice, index) {
                var reversedIndex = choices.length - index;
                options.axes.yaxis.ticks[reversedIndex - 1] = choice.percentOfTotalResponses + '%';
                options.seriesColors[index] = colorChoices[index];
                array.push([choice.entryCountForThisChoice, reversedIndex]);
            });

            options.seriesDefaults.renderer = $.jqplot.BarRenderer;
            options.axes.yaxis.renderer = $.jqplot.CategoryAxisRenderer;
            options.axes.yaxis.rendererOptions.tickRenderer = $.jqplot.AxisTickRenderer;
            $.jqplot('pollBar', [array], options);
    },

    getPollContest: function() {
        contestActions.pollBySASL(this.sa,this.sl)
            .then(function(poll) {
                if (poll) {
                    this.render(poll);
                } else {
                    this.$el.hide();
                }
            }.bind(this))
            .fail(function(err){
                //TODO manage error
                this.$el.hide();
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
