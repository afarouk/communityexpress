'use strict';

define([
  'ejs!../../templates/landing/poll.ejs'
	], function(template){
	var PollView = Mn.View.extend({
    template: template,
    el: '#cmtyx_poll_block',
		ui: {
      show_share_btn: '.share_btn_block',
      show_sms_block: '.sms_block',
      send_sms: '.sms_send_button'
    },
    events: {
      'click @ui.show_share_btn': 'showShareBlock',
      'click @ui.show_sms_block': 'showSMSInput',
      'click @ui.send_sms': 'onSendSMS',
      'click .submit_poll_button': 'submitPoll',
      'click .question_thumbnail': 'onImageExpand'
    },
    initialize: function() {
      this.securityType = window.saslData.domainEnum === 'MEDICURIS' ||
          window.saslData.domainEnum === 'MOBILEVOTE' ? window.saslData.domainEnum : false;
      if (!this.securityType) {
        this.setShareLinks();
      }
    },

    render: function(poll) {
      this.poll = poll;
      this.$el.html(this.template({
          contests: poll,
          securityType: this.securityType
      }));
      if (poll && poll.length) {
        this.$el.show();
      } else {
        this.$el.hide();
      }
      this.bindUIElements();
      return this;
    },

    onRefresh: function() {
      this.trigger('onRefresh');
    },

    showShareBlock: function(e) {
      var $target = $(e.currentTarget),
         $el = $target.parent().next();

      $el.slideToggle();
    }, 

    showSMSInput: function(e) {
      e.preventDefault();
      var $target = $(e.currentTarget),
         $el = $target.parent().parent().prev();

      $el.slideToggle();
    },

    onSendSMS: function(e) {
      var $el = this.$el.find('.sms_input_block'),
          $target = $(e.currentTarget),
          uuid = $target.parent().parent().data('uuid'),
          demo = window.community.demo ? 'demo=true&' : '',
          shareUrl = window.location.href.split('?')[0] + 
            '?' + demo + 't=p&u=' + uuid,
          val = $target.prev().val(); //(650) 617-3439
      //todo toggle block 

      this.trigger('onSendSMS', 'POLL_CONTEST', val, uuid, shareUrl);
    },

    getLinks: function() {
      var demo = window.community.demo ? 'demo=true&' : '',
        shareUrl = window.encodeURIComponent(window.location.href.split('?')[0] + 
          '?' + demo + 't=y&u=' + this.photoUUID),
        links = [
            '',
            'mailto:?subject=&body=' + shareUrl,
            'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl,
            'https://twitter.com/intent/tweet?text=' + shareUrl
        ];
      return links;
    },

    setShareLinks: function() {
        var $block = this.$el.find('.share-block'),
          links = this.getLinks(),
          $links = $block.find('a');

        $links.each(function(index){
          var link = $(this);
          link.attr('href', links[index]);
        });
    },

    submitPoll: function(e) {
        var $target = $(e.currentTarget),
            uuid = $target.data('uuid'),
            $container = $target.parent(),
            choise = this.$el.find('input.ansRadioChoice:checked', $container).data('choice');

        this.trigger('onEnterPoll', uuid, choise, function(result){
          if (this.securityType) {
              this.displayAnsweredMessage($container);
          } else {
            $container.find('.submit_poll_button').slideUp('slow', _.bind(function() {
                this.displayResults($container, result);
            }, this));
          }
        }.bind(this));
    },

    displayAnsweredMessage: function($container) {
        var $questions = $container.find('.poll_ans_form');
        $questions.addClass('answered');
        this.dispatcher.get('popups').showMessage({
          message: 'poll answered.',
          loader: true
        });
        $container.find('.submit_poll_button').slideUp('slow', _.bind(function() {
            $questions.addClass('medical');
        }, this));
        $questions.find('.medical-answered').off('click').on('click', function() {
            $questions.removeClass('answered medical');
            $container.find('.submit_poll_button').slideDown('slow');
        }.bind(this));
    },

    displayResults: function($container, result) {
        var $questions = $container.find('.poll_ans_form');

        $questions.addClass('answered');
        $questions.find('li').each(function(index, element){
            var choice = result.choices[index],
                percent = Math.round(choice.percentOfTotalResponses),
                $el = $(element),
                $bar = $el.find('.question_item .bar');
            $bar.find('.percent').text(percent + '%');
            $bar.find('.back').css('width', percent + '%');
        });
    },

    onImageExpand: function(e) {
        var $target = $(e.currentTarget),
            imgSource = $target.data('src'),
            title = $target.data('title');
        this.dispatcher.get('popups').expandImage(imgSource, title);
    }

	});
	return PollView;
});