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
        'change .poll_ans_form input': 'checkIfAnswered',
        'click .share_btn_block': 'showShareBlock',
        'click .sms_block': 'showSMSInput',
        'click .sms_send_button': 'onSendSMS'
    },

    toggleCollapse: function() {
        var $el = this.$('.body');
        $el.slideToggle('slow', _.bind(function(){
            var visible = $el.is(':visible');
            if (visible) {
                $el.parent().find('.collapse_btn').html('&#9650;');
                if (!this.slicked) this.initSlick();
            } else {
                $el.parent().find('.collapse_btn').html('&#9660;');
            }
        }, this));
    },

    initialize: function(options) {
        options = options || {};
        this.sasl = window.saslData;
        this.sa = community.serviceAccommodatorId;
        this.sl = community.serviceLocationId;
        Vent.on('openPollByShareUrl', this.openPollByShareUrl, this);
        
        var $el = this.$('.body'),
        visible = $el.is(':visible');
        this.slicked = false;
        if (visible) this.initSlick();
    },

    render: function(poll) {
        // console.log('poll', poll);
        this.poll = poll;
        this.$el.html(pollTemplate({
            contests: poll
        }));
        this.setLinksForEachPoll();
        this.initSlick();
        this.resolved();
        return this;
    },

    onShow: function() {
        this.unslick();

        var $el = this.$('.body'),
            visible = $el.is(':visible');

        this.slicked = false;
        if (visible) this.initSlick();
    },

    unslick: function() {
        var $el = this.$el.find('.body ul.poll_gallery');
        $el.find('.slick-arrow-container').remove();
        $el.slick('unslick');
    },

    initSlick: function() {
        this.slicked = true;
        //slick init
        this.$el.find('.body ul.poll_gallery').slick({
            dots: false,
            arrows: true,
            infinite: true,
            speed: 300,
            fade: false,
            cssEase: 'linear',
            slidesToShow: 1,
            adaptiveHeight: true
        });
        this.$el.find('button.slick-arrow.slick-prev').wrap( "<div class='slick-arrow-container left'></div>" );
        this.$el.find('button.slick-arrow.slick-next').wrap( "<div class='slick-arrow-container right'></div>" );
        this.$el.find('button.slick-arrow').text('');
    },

    openPollByShareUrl: function(uuid) {
        var el = this.$el.find('li[data-uuid="' + uuid + '"]').first(),
            index = el.data('slick-index');

        this.$el.find('.body ul.poll_gallery').slick('slickGoTo', index);
        Vent.trigger('scrollToBlock', '.poll_block');
    },

    showShareBlock: function(e) {
        if (this.animating) return;
        this.animating = true;
        var $target = $(e.currentTarget),
        $el = $target.next(),
        visible = $el.is(':visible'),
        visibleSMS = $el.find('.sms_input_block').is(':visible'),
        height = 50;
        if (visible && visibleSMS) {
            this.$('.sms_input_block').hide();
            height = 120;
        }
        this.changeSlideHeight($el, height);
        $el.slideToggle('slow', _.bind(function() {
            this.animating = false;
        }, this));
    },

    showSMSInput: function(e) {
        if (this.animating) return;
        this.animating = true;
        var $target = $(e.currentTarget),
        $el = $target.parent().find('.sms_input_block');
        this.changeSlideHeight($el, 70);
        $el.find('input').mask('(000) 000-0000');
        $el.slideToggle('slow', _.bind(function() {
            this.animating = false;
        }, this));
    },

    changeSlideHeight: function($target, additional, add) {
        var $el = $target.parents('.slick-list[aria-live="polite"]'),
            height = $el.height(),
            visible = $target.is(':visible');
        if (visible && !add) additional = -additional;
        $el.css('transition', '0.3s');
        $el.height(height + additional + 'px');
    },

    getLinks: function(uuid) {
        var demo = window.community.demo ? 'demo=true&' : '',
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

    setShareLinks: function($poll) {
        var $block = $poll.find('.share_block'),
            uuid = $block.data('uuid'),
            links = this.getLinks(uuid),
            $links = $block.find('a');

        $links.each(function(index){
            var link = $(this);
            link.attr('href', links[index]);
        });
    },

    setLinksForEachPoll: function() {
        var $contests = this.$el.find('.poll_item');
        $contests.each(function(index, el){
            var $poll = $(el);
            this.setShareLinks($poll);
        }.bind(this));
    },

    onSendSMS: function(e) {
        var $target = $(e.currentTarget),
            $el = $target.parent(),
            uuid = $target.parent().data('uuid'),
            demo = window.community.demo ? 'demo=true&' : '',
            shareUrl = window.location.href.split('?')[0] +
              '?' + demo + 't=p&u=' + uuid,
            val = $target.prev().val(); //(650) 617-3439

        loader.showFlashMessage('Sending message to... ' + val);
        this.changeSlideHeight($el, 70);
        $el.slideUp('slow');
        contactActions.shareURLviaSMS('POLL_CONTEST', this.sasl.serviceAccommodatorId,
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

    checkIfAnswered: function(e) {
        var $target = $(e.currentTarget),
            index = $target.data('poll-index'),
            status = this.poll[index].answerStatus;
        if (status.enumText === 'ANSWERED') {
            // $container.parent().find('.contest_prizes').show();
            // $container.parent().find('.prize_block').show();
            // this.displayResults($container, this.poll[index]);
        } else {
            //tweak for chrome input:checked issue
            $target.parents('.poll_ans_form').find('input[checked="checked"]').attr('checked', false);
            //end
        }
    },

    afterTriedToLogin: function() {
        this.getPollContests();
    },

    submitPoll: function(e) {
        var $target = $(e.currentTarget),
            uuid = $target.data('uuid'),
            $container = $target.parent();
        popupController.requireLogIn(this.sasl, function() {
            var choise = this.$el.find('input.ansRadioChoice:checked', $container).data('choice');
            console.log(choise);

            contestActions.enterPoll(this.sa,this.sl, uuid, choise)
                .then(function(result) {
                    $container.find('.submit_poll_button').slideUp('slow', _.bind(function() {
                        this.displayResults($container, result);
                    }, this));
                }.bind(this))
                .fail(function(err){
                    popupController.textPopup({ text: 'You already answered this question.'});
                }.bind(this));
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

    displayResults: function($container, result) {
        var height,
            $questions = $container.find('.poll_ans_form');

        $questions.addClass('answered');
        $container.parent().find('.contest_prizes').show();
        $container.parent().find('.prize_block').show();
        $questions.find('li').each(function(index, element){
            var choice = result.choices[index],
                percent = Math.round(choice.percentOfTotalResponses),
                $el = $(element),
                $bar = $el.find('.question_item .bar');
            $bar.find('.percent').text(percent + '%');
            $bar.find('.back').css('width', percent + '%');
        });
        // var choices = result.choices,
        //     options = _.extend(jqPlotOptions.options, {height: choices.length * 35}),
        //     colorChoices = this.getColors();

        //     var array = [], a = [], b = [];
        //     _.each(choices, function(choice, index) {
        //         var reversedIndex = choices.length - index;
        //         options.axes.yaxis.ticks[reversedIndex - 1] = Math.round(choice.percentOfTotalResponses) + '%';
        //         options.seriesColors[index] = colorChoices[index];
        //         array.push([choice.entryCountForThisChoice, reversedIndex]);
        //     });

        //     options.seriesDefaults.renderer = $.jqplot.BarRenderer;
        //     options.axes.yaxis.renderer = $.jqplot.CategoryAxisRenderer;
        //     options.axes.yaxis.rendererOptions.tickRenderer = $.jqplot.AxisTickRenderer;
        //     $.jqplot('pollBar-' + (result.contestUUID || result.uuid), [array], options);
        height = $container.parent().find('.contest_prizes').height() - 30;
        this.changeSlideHeight($container, height, true);
    },

    getPollContests: function() {
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
