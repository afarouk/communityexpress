'use strict';

define([
  'ejs!../../templates/landing/loyaltyCard.ejs'
	], function(template){
	var PhotoContestView = Mn.View.extend({
    template: template,
    el: '#cmtyx_photo_contest_block',
		ui: {
      show_share_btn: '.share_btn_block',
      show_sms_block: '.sms_block',
      send_sms: '.sms_send_button',
      send_photo: '.send_photo_btn'
    },
    events: {
      'click @ui.send_photo': 'onClickSendPhoto',
    },
    initialize: function() {

      this.setShareLinks();
    },

    render: function() {
      this.bindUIElements();
      return this;
    },

    onRefresh: function() {
      this.trigger('onRefresh');
    },

    onClickSendPhoto: function(e) {
        var btn = $(e.currentTarget),
            $container = btn.parent();
        this.dispatcher.get('popups').requireLogIn(function() {
            var $el = btn.next();
            btn.slideUp('slow');
            $el.show();
            this.initUploader($el);
        }.bind(this));
    },

    initUploader: function($el) {
        $el.find('.dropzone').html5imageupload({
            ghost: false,
            save: false,
            canvas: true,
            data: {},
            resize: false,
            onSave: this.onSaveImage.bind(this, $el),
            onAfterSelectImage: function(){
                $(this.element).addClass('added');
            },
            onToolsInitialized: function(){
                $el.find('.dropzone').find('.btn').addClass('cmtyx_text_color_1');
                var height = -($el.find('.dropzone').height() - 100);
                this.changeSlideHeight($el, height);
            }.bind(this),
            onAfterProcessImage: function(){
                $(this.element).find('.btn').addClass('cmtyx_text_color_1');
                var height = 450;
                this.changeSlideHeight($el, height);
            }.bind(this),
            onAfterCancel: function() {
                $el.find('.dropzone').removeClass('added');
                var height = 400;
                this.changeSlideHeight($el, height);
            }.bind(this)
        });
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
          uuid = this.photoUUID,
          demo = window.community.demo ? 'demo=true&' : '',
          shareUrl = window.location.href.split('?')[0] + 
            '?' + demo + 't=p&u=' + uuid,
          val = $target.prev().val(); //(650) 617-3439
      //todo toggle block 
      this.trigger('onSendSMS', 'PHOTO', val, uuid, shareUrl);
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
    }

	});
	return PhotoContestView;
});