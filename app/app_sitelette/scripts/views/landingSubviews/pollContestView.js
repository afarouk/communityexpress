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


    //TODO functionality!!!

    initialize: function(options) {
        options = options || {};
        this.sasl = window.saslData;
        this.sa = community.serviceAccommodatorId;
        this.sl = community.serviceLocationId;

        this.getPollContest();
    },

    render: function(poll) {
        console.log('poll', poll);
        this.poll = poll;
        this.$el.html(pollTemplate(poll));
        return this;
    },

    getHardcodedJSON: function() {
        var str = '{"activationDate":"2015-10-01T07:45:00:UTC","expirationDate":"2016-11-01T07:45:00:UTC","contestName":"Updated tree","displayText":"What is the oldest tree in the world","hiddenText":"","contestCustomerId":null,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","imageURL":"http://simfel.com/apptsvc/rest/contests/imagePollByContestID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC","shareURL":"https://appointment-service.com/cmt2_lefoodtruck?t=l&u=POLxBa08SUUR3SJx1AoAdxMoC&demo=true","previewURL":"https://appointment-service.com/cmt2_lefoodtruck?t=l&u=POLxBa08SUUR3SJx1AoAdxMoC&desktopiframe=true&embedded=true&demo=true","contestStatus":{"id":2,"enumText":"ACTIVE","displayText":"Active"},"contestType":0,"type":{"id":16,"enumText":"POLL_CONTEST","displayText":"Poll"},"daysLeft":"40","prizes":[{"contestPrizeName":"Grand Prize - Dinner for Two","contestPrizeId":1,"contestPrizeIndex":1,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","quantity":12.55,"displayText":"For the lucky winner, -an evening on us. Go ahead, enter, its free!","hiddenText":"Employees not eligible","imageUrl":"http://simfel.com/apptsvc/rest/contests/imageContestPrizeByePrizeID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&prizeId=1"},{"contestPrizeName":"A surprise dish from Chef","contestPrizeId":2,"contestPrizeIndex":2,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","quantity":12.55,"displayText":"Let our chef surprise you!","hiddenText":"Employees not eligible","imageUrl":"http://simfel.com/apptsvc/rest/contests/imageContestPrizeByePrizeID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&prizeId=2"},{"contestPrizeName":"Free dessert","contestPrizeId":3,"contestPrizeIndex":3,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","quantity":12.55,"displayText":"Select from our wonderful lineup!","hiddenText":"Employees not eligible","imageUrl":"http://simfel.com/apptsvc/rest/contests/imageContestPrizeByePrizeID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&prizeId=3"},{"contestPrizeName":"Half Price dinner for two","contestPrizeId":4,"contestPrizeIndex":4,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","quantity":12.55,"displayText":"Yes, 50% Off, it does not get better than this","hiddenText":"Employees not eligible","imageUrl":"http://simfel.com/apptsvc/rest/contests/imageContestPrizeByePrizeID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&prizeId=4"},{"contestPrizeName":"Grand Prize - Dinner for Two","contestPrizeId":5,"contestPrizeIndex":5,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","quantity":12.55,"displayText":"For the lucky winner, -an evening on us. Go ahead, enter, its free!","hiddenText":"Employees not eligible","imageUrl":"http://simfel.com/apptsvc/rest/contests/imageContestPrizeByePrizeID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&prizeId=5"}],"choiceCorrect":-1,"choiceHint":"(n/a)","choices":[{"choiceId":1,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","choiceIndex":1,"choiceValue":null,"choiceStatus":{"id":2,"enumText":"ACTIVE","displayText":"Active"},"displayText":"It is a Redwood somewhere in California","choiceName":"A Redwood","imageURL":"http://simfel.com/apptsvc/rest/contests/imagePollChoiceByID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&choiceId=1","isCorrect":false,"entryCountForThisChoice":0,"anonymousEntryCountForThisChoice":0,"percentOfTotalResponses":42,"responseCount":1,"thisIsYourChoice":false},{"choiceId":2,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","choiceIndex":2,"choiceValue":null,"choiceStatus":{"id":2,"enumText":"ACTIVE","displayText":"Active"},"displayText":"It is a Spruce somewhere in Oregon","choiceName":"A Spruce","imageURL":"http://simfel.com/apptsvc/rest/contests/imagePollChoiceByID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&choiceId=2","isCorrect":false,"entryCountForThisChoice":0,"anonymousEntryCountForThisChoice":0,"percentOfTotalResponses":85,"responseCount":0,"thisIsYourChoice":false},{"choiceId":3,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","choiceIndex":3,"choiceValue":null,"choiceStatus":{"id":2,"enumText":"ACTIVE","displayText":"Active"},"displayText":"It is a Banyan tree Germany","choiceName":"A Banyan tree","imageURL":"http://simfel.com/apptsvc/rest/contests/imagePollChoiceByID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&choiceId=3","isCorrect":false,"entryCountForThisChoice":0,"anonymousEntryCountForThisChoice":0,"percentOfTotalResponses":8,"responseCount":0,"thisIsYourChoice":false},{"choiceId":4,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","choiceIndex":4,"choiceValue":null,"choiceStatus":{"id":2,"enumText":"ACTIVE","displayText":"Active"},"displayText":"It is a Bristle Cone Pine somewhere in California","choiceName":"A Bristle Cone Pine","imageURL":"http://simfel.com/apptsvc/rest/contests/imagePollChoiceByID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&choiceId=4","isCorrect":false,"entryCountForThisChoice":0,"anonymousEntryCountForThisChoice":0,"percentOfTotalResponses":3,"responseCount":2,"thisIsYourChoice":false},{"choiceId":5,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","choiceIndex":5,"choiceValue":null,"choiceStatus":{"id":2,"enumText":"ACTIVE","displayText":"Active"},"displayText":"It is a Joshua tree in Australia","choiceName":"A Joshua tree","imageURL":"http://simfel.com/apptsvc/rest/contests/imagePollChoiceByID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&choiceId=5","isCorrect":false,"entryCountForThisChoice":0,"anonymousEntryCountForThisChoice":0,"percentOfTotalResponses":41,"responseCount":2,"thisIsYourChoice":false}],"index":0,"subType":0,"additionalInformation":null,"userPointsEarned":0,"categories":null,"tags":null,"userStatus":{"id":0,"enumText":"UNDEFINED","displayText":"Undefined"},"likes":0,"messages":0,"totalAnswers":0,"currentPointCount":0}',
            parsed;
        try {
            parsed = JSON.parse(str);
        } catch(e) {

        }
        return parsed;
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
                    //TODO manage error
                     this.displayResults();
                }.bind(this));
            this.$el.find('.submit_poll_button').slideUp('slow');
            // this.$el.find('.poll_results').slideDown('slow');
            this.$el.find('.prize_block').slideDown('slow');
        }.bind(this));
        // this.onPollClick();
    },

    displayResults: function(result) {
        var res = result || this.poll;
        this.$el.find('.poll_results').show();
        var options = jqPlotOptions.options,
            colorChoices = jqPlotOptions.colorChoices; //We need to get colors array

            var array = [], a = [], b = [];
            _.each(res.choices, function(choice) {
                a.push(choice.choiceId);
                // b.push(choice.entryCountForThisChoice);
                b.push(Math.floor(Math.random()*5));
            });
            b.reverse();
            for (var i = 0; i < a.length; i++) {
                options.axes.yaxis.ticks[i] = a.length - i;
                array.push([b[i], a[i]]);
                options.seriesColors[i] = colorChoices[i];
            }
            var dataArray = [array];

            options.seriesDefaults.renderer = $.jqplot.BarRenderer;
            options.axes.yaxis.renderer = $.jqplot.CategoryAxisRenderer;
            options.axes.yaxis.rendererOptions.tickRenderer = $.jqplot.AxisTickRenderer;
            $.jqplot('pollBar', dataArray, options);
    },

    getPollContest: function() {
        contestActions.pollBySASL(this.sa,this.sl)
            .then(function(poll) {
                if (poll) {
                    this.render(poll);
                } else {
                    this.render(this.getHardcodedJSON());
                }
            }.bind(this))
            .fail(function(err){
                //TODO manage error
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
