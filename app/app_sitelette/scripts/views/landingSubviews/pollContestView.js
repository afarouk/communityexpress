/*global define*/

'use strict';

var Vent = require('../../Vent'),
    loader = require('../../loader'),
    ListView = require('../components/listView'),
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
                $(this).parent().find('.collapse_btn').removeClass('down');
            } else {
                $(this).parent().find('.collapse_btn').addClass('down');
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
    },

    reRender: function(poll) {
        //TODO temporary commented because looks bad
        // this.$el.html(pollTemplate(poll));
        console.log(poll);
        return this;
    },

    //should be changed when new API will be ready
    onLogin: function() {
        // this.getContests();
        var poll = this.getHardcodedJSON();
        if (poll) {
            this.reRender(poll);
        }
    },

    onLogout: function() {
    
    },

    getHardcodedJSON: function() {
        var str = '{"activationDate":"2015-10-01T07:45:00:UTC","expirationDate":"2016-11-01T07:45:00:UTC","contestName":"Updated tree","displayText":"What is the oldest tree in the world","hiddenText":"","contestCustomerId":null,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","imageURL":"http://simfel.com/apptsvc/rest/contests/imagePollByContestID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC","shareURL":"https://appointment-service.com/cmt2_lefoodtruck?t=l&u=POLxBa08SUUR3SJx1AoAdxMoC&demo=true","previewURL":"https://appointment-service.com/cmt2_lefoodtruck?t=l&u=POLxBa08SUUR3SJx1AoAdxMoC&desktopiframe=true&embedded=true&demo=true","contestStatus":{"id":2,"enumText":"ACTIVE","displayText":"Active"},"contestType":0,"type":{"id":16,"enumText":"POLL_CONTEST","displayText":"Poll"},"daysLeft":"40","prizes":[{"contestPrizeName":"Grand Prize - Dinner for Two","contestPrizeId":1,"contestPrizeIndex":1,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","quantity":12.55,"displayText":"For the lucky winner, -an evening on us. Go ahead, enter, its free!","hiddenText":"Employees not eligible","imageUrl":"http://simfel.com/apptsvc/rest/contests/imageContestPrizeByePrizeID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&prizeId=1"},{"contestPrizeName":"A surprise dish from Chef","contestPrizeId":2,"contestPrizeIndex":2,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","quantity":12.55,"displayText":"Let our chef surprise you!","hiddenText":"Employees not eligible","imageUrl":"http://simfel.com/apptsvc/rest/contests/imageContestPrizeByePrizeID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&prizeId=2"},{"contestPrizeName":"Free dessert","contestPrizeId":3,"contestPrizeIndex":3,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","quantity":12.55,"displayText":"Select from our wonderful lineup!","hiddenText":"Employees not eligible","imageUrl":"http://simfel.com/apptsvc/rest/contests/imageContestPrizeByePrizeID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&prizeId=3"},{"contestPrizeName":"Half Price dinner for two","contestPrizeId":4,"contestPrizeIndex":4,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","quantity":12.55,"displayText":"Yes, 50% Off, it does not get better than this","hiddenText":"Employees not eligible","imageUrl":"http://simfel.com/apptsvc/rest/contests/imageContestPrizeByePrizeID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&prizeId=4"},{"contestPrizeName":"Grand Prize - Dinner for Two","contestPrizeId":5,"contestPrizeIndex":5,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","quantity":12.55,"displayText":"For the lucky winner, -an evening on us. Go ahead, enter, its free!","hiddenText":"Employees not eligible","imageUrl":"http://simfel.com/apptsvc/rest/contests/imageContestPrizeByePrizeID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&prizeId=5"}],"choiceCorrect":-1,"choiceHint":"(n/a)","choices":[{"choiceId":1,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","choiceIndex":1,"choiceValue":null,"choiceStatus":{"id":2,"enumText":"ACTIVE","displayText":"Active"},"displayText":"It is a Redwood somewhere in California","choiceName":"A Redwood","imageURL":"http://simfel.com/apptsvc/rest/contests/imagePollChoiceByID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&choiceId=1","isCorrect":false,"entryCountForThisChoice":0,"anonymousEntryCountForThisChoice":0,"percentOfTotalResponses":null,"responseCount":null,"thisIsYourChoice":false},{"choiceId":2,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","choiceIndex":2,"choiceValue":null,"choiceStatus":{"id":2,"enumText":"ACTIVE","displayText":"Active"},"displayText":"It is a Spruce somewhere in Oregon","choiceName":"A Spruce","imageURL":"http://simfel.com/apptsvc/rest/contests/imagePollChoiceByID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&choiceId=2","isCorrect":false,"entryCountForThisChoice":0,"anonymousEntryCountForThisChoice":0,"percentOfTotalResponses":null,"responseCount":null,"thisIsYourChoice":false},{"choiceId":3,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","choiceIndex":3,"choiceValue":null,"choiceStatus":{"id":2,"enumText":"ACTIVE","displayText":"Active"},"displayText":"It is a Banyan tree Germany","choiceName":"A Banyan tree","imageURL":"http://simfel.com/apptsvc/rest/contests/imagePollChoiceByID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&choiceId=3","isCorrect":false,"entryCountForThisChoice":0,"anonymousEntryCountForThisChoice":0,"percentOfTotalResponses":null,"responseCount":null,"thisIsYourChoice":false},{"choiceId":4,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","choiceIndex":4,"choiceValue":null,"choiceStatus":{"id":2,"enumText":"ACTIVE","displayText":"Active"},"displayText":"It is a Bristle Cone Pine somewhere in California","choiceName":"A Bristle Cone Pine","imageURL":"http://simfel.com/apptsvc/rest/contests/imagePollChoiceByID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&choiceId=4","isCorrect":false,"entryCountForThisChoice":0,"anonymousEntryCountForThisChoice":0,"percentOfTotalResponses":null,"responseCount":null,"thisIsYourChoice":false},{"choiceId":5,"contestUUID":"POLxBa08SUUR3SJx1AoAdxMoC","choiceIndex":5,"choiceValue":null,"choiceStatus":{"id":2,"enumText":"ACTIVE","displayText":"Active"},"displayText":"It is a Joshua tree in Australia","choiceName":"A Joshua tree","imageURL":"http://simfel.com/apptsvc/rest/contests/imagePollChoiceByID?contestUUID=POLxBa08SUUR3SJx1AoAdxMoC&choiceId=5","isCorrect":false,"entryCountForThisChoice":0,"anonymousEntryCountForThisChoice":0,"percentOfTotalResponses":null,"responseCount":null,"thisIsYourChoice":false}],"index":0,"subType":0,"additionalInformation":null,"userPointsEarned":0,"categories":null,"tags":null,"userStatus":{"id":0,"enumText":"UNDEFINED","displayText":"Undefined"},"likes":0,"messages":0,"totalAnswers":0,"currentPointCount":0}',
            parsed;
        try {
            parsed = JSON.parse(str);
        } catch(e) {

        }
        return parsed;
    },

    submitPoll: function() {
        popupController.requireLogIn(null, function() {
            this.$el.find('.submit_poll_button').slideUp('slow');
            this.$el.find('.poll_results').slideDown('slow');
            this.$el.find('.prize_block').slideDown('slow');
            var choise = this.$el.find('input.ansRadioChoice:checked').data('choice');
            console.log(choise);
        }.bind(this));
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
