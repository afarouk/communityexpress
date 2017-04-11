'use strict';

define([
  'ejs!../../templates/landing/loyaltyCard.ejs'
	], function(template){
	var LoyaltyCardView = Mn.View.extend({
    template: template,
    el: '#cmtyx_loyalty_program_block',
		ui: {
      qrCode: '.qr_code_block',
      no_qrCode: '.no_qr_code_block',
      prize: '.prize_container',
      status: '.loyalty_status',
      show_share_btn: '.share_btn_block',
      show_sms_block: '.sms_block',
      send_sms: '.sms_send_button',
    },
    events: {
      'click @ui.show_share_btn': 'showShareBlock',
      'click @ui.show_sms_block': 'showSMSInput',
      'click @ui.send_sms': 'onSendSMS',
      'click @ui.no_qrCode button': 'onRefresh'
    },
    initialize: function() {
      this.loyaltyProgram = saslData.loyaltyProgram || {};
    },

    render: function(loyaltyProgram) {
      this.loyaltyProgram = loyaltyProgram;
      this.$el.html(this.template(loyaltyProgram));
      this.bindUIElements();
      this.setShareLinks();
      return this;
    },

    onRefresh: function() {
      this.trigger('onRefresh');
    },

    renderQrCode: function(resp) {
      var content = '<div>'+ resp.loyaltyBlockLine1 +'</div><div>'+
                    resp.loyaltyBlockLine2 +'</div><div>' + resp.loyaltyBlockLine3 + '</div>';
      this.ui.status.html(content);
      this.ui.qrCode.find('.qr_code_container').html('<img src="' + resp.qrcodeURL + '" alt="" >');
      this.ui.no_qrCode.slideUp('slow');
      this.ui.qrCode.slideDown('slow');
      this.ui.qrCode.find('.qr_code_title.title').text(resp.qrCodeBlockLine1);
      this.ui.qrCode.find('.qr_code_title.info').text(resp.qrCodeBlockLine2);
    },

    retrieveLoyaltyStatus: function(uid) {
      loyaltyActions.updateLoyaltyStatus(uid).then(_.bind(function(resp) {
          if (resp.hasLoyaltyProgram) {
            var content = '<div>'+ resp.loyaltyBlockLine1 +'</div><div>'+
              resp.loyaltyBlockLine2 +'</div><div>' + resp.loyaltyBlockLine3 + '</div>';
            this.$(this.status).html(content);
          }
          this.$(this.qrCode).find('.qr_code_container').html('<img src="' +
            resp.qrcodeURL + '" alt="" >');
          this.$(this.qrCode).slideDown('slow', function(){
            this.resolved();
          }.bind(this));
          this.$(this.no_qrCode).slideUp('slow');
          this.$(this.qrCode).find('.qr_code_title.title').text(resp.qrCodeBlockLine1);
          this.$(this.qrCode).find('.qr_code_title.info').text(resp.qrCodeBlockLine2);
      }, this));
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
          uuid = this.loyaltyProgram.loyaltyUUID,
          demo = window.community.demo ? 'demo=true&' : '',
          shareUrl = window.location.href.split('?')[0] + 
            '?' + demo + 't=p&u=' + uuid,
          val = $target.prev().val(); //(650) 617-3439
      //todo toggle block 
      this.trigger('onSendSMS', 'LOYALTY', val, uuid, shareUrl);
    },

    getLinks: function() {
      var demo = window.community.demo ? 'demo=true&' : '',
        shareUrl = window.encodeURIComponent(window.location.href.split('?')[0] + 
          '?' + demo + 't=y&u=' + this.loyaltyProgram.loyaltyUUID),
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
	return LoyaltyCardView;
});