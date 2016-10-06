/*global define*/

'use strict';

var Vent = require('../../Vent'),
    loader = require('../../loader'),
    contactActions = require('../../actions/contactActions'),
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
        'click .submit_poll_button': 'submitPoll',
        'click .poll_ans_form': 'checkIfAnswered',
        'click .share_btn_block': 'showShareBlock',
        'click .sms_block': 'showSMSInput',
        'click .sms_send_button': 'onSendSMS'
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
          uuid = this.poll.contestUUID,
          shareUrl = window.encodeURIComponent(window.location.href.split('?')[0] + 
            '?' + demo + 't=l&u=' + uuid),
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
            uuid = this.poll.contestUUID,
            demo = window.community.demo ? 'demo=true&' : '',
            shareUrl = window.encodeURIComponent(window.location.href.split('?')[0] + 
              '?' + demo + 't=p&u=' + uuid),
            val = $target.prev().val(); //(650) 617-3439

        loader.showFlashMessage('Sending message to... ' + val);
        $el.slideUp('slow');
        contactActions.sendPollContestURLToMobileviaSMSPOST(this.sasl.serviceAccommodatorId, 
            this.sasl.serviceLocationId, val, uuid, shareUrl)
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
        var status = this.poll.answerStatus;
        if (status.enumText === 'ANSWERED') {
            this.displayResults(this.poll);
            this.$el.find('.prize_block').slideDown('slow');
        }
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
        //TODO now we have different colours in sasl then themes 
        return this.sasl.themeColors ? this.sasl.themeColors.cmtyx_color : colors;
    },

    displayResults: function(result) {
        this.$el.find('.poll_ans_form').addClass('answered');
        this.$el.find('.poll_results').show();
        var choices = result.choices,
            options = _.extend(jqPlotOptions.options, {height: choices.length * 35}),
            colorChoices = this.getColors();

            var array = [], a = [], b = [];
            _.each(choices, function(choice, index) {
                var reversedIndex = choices.length - index;
                options.axes.yaxis.ticks[reversedIndex - 1] = Math.round(choice.percentOfTotalResponses) + '%';
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
