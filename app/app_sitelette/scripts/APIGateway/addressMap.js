/* global define */
'use strict';

module.exports = {
    getAddressMap: function(){
        return {
            getRestaurantSummaryByUIDAndLocation: ['GET', '/sasl/getSASLSummaryByUIDAndLocation'],
            getRestaurantSummaryByUIDAndAddress: ['POST', '/sasl/getSASLSummaryByUIDAndAddress'],
            getRestaurantByURLkey: ['GET', '/sasl/getSASLByURLkey'],
            getRestaurantBySASL: ['GET', '/sasl/getSASLById'],
            getOpeningHours: ['GET', '/sasl/getOpeningHours'],
            getAboutUs: ['GET', '/html/getAboutUSForSASL'],

            updateLocation: ['PUT', '/liveupdate/updateSASLLocationStatus'],

            getLegendInfo: ['GET', '/sasl/getLegendInfo'],

            retrieveAugmentedMediaMetaDataBySASL: ['GET', '/media/retrieveAugmentedMediaMetaDataBySASL'],
            retrieveMediaMetaDataBySASL: ['GET', '/media/retrieveMediaMetaDataBySASL'],
            retrieveThumbnailsBySASL: ['GET', '/media/retrieveThumbnailsBySASL'],
            getUserPictures: ['GET', '/media/retrieveMediaMetaDataBySASL'],
            activateMedia: ['PUT', '/media/activateMediaByIdAfterId'],
            deactivateMedia: ['DELETE', '/media/retireMediaById'],
            createAdhocMedia: ['POST', '/media/createAdhocMedia'],

            createAdhocPromotion: ['POST', '/promotions/createAdhocPromotion'],
            fetchPromotionUUIDsBySasl: ['GET', '/promotions/retrievePromotionSATierPromoUUIDs'],
            fetchPromotionByUUID: ['GET', '/promotions/getPromotionMetaDataClientByPromoUUID'],
            getPromotionFeedback: ['GET', '/promotions/getPromotionFeedback'],
            givePromotionFeedback: ['PUT', '/promotions/givePromotionFeedback'],
            getPromotionTypes: ['GET', '/promotions/getPromotionTypes'],
            retrievePromotionsBySASL: ['GET', '/promotions/retrievePromotionSATiersMetaDataBySASL'],
            activatePromotion: ['PUT', '/promotions/activatePromotionSATier'],
            deActivatePromotion: ['PUT', '/promotions/deActivatePromotionSATier'],

            createWNewPictureNewMetaData: ['POST', '/usersasl/createWNewPictureNewMetaData'],

            getFavoriteSASLSummary: ['GET', '/usersasl/getFavoriteSASLSummaryByUID'],
            fetchFavoriteSASLs: ['GET', '/usersasl/retrieveFavoriteSASLs'],
            addSASLToFavorites: ['POST', '/usersasl/addSASLToFavorites'],
            deleteURLFromFavorites: ['DELETE', '/usersasl/deleteURLFromFavorites'],


            getAvailablePseudoTimeSlots: ['GET', '/reservations/getAvailablePseudoTimeSlots'],
            getAvailablePseudoTimeSlotsForPromotion: ['GET', '/reservations/getAvailablePseudoTimeSlotsForPromotion'],

            retrievePseudoReservationsForUser: ['GET', '/reservations/retrievePseudoReservationsForUser'],
            createPseudoReservation: ['POST', '/reservations/createPseudoReservation'],
            requestSASLReservationModification: ['PUT', '/reservation/requestSASLReservationModification'],

            getUserAndCommunity: ['GET', '/authentication/getUserAndCommunity'],

            fetchConversation: ['GET', '/communication/getConversationBetweenUserSASL'],
            sendMessageToSASL: ['POST', '/communication/sendMessageToSASL'],

            retrievePostsOnSASL: ['GET', '/communication/retrievePostsOnSASL'],
            commentOnPostFromSASL: ['POST', '/communication/commentOnPostFromSASL'],
            likeDislikePost: ['GET', '/communication/likeDislikePost'],

            getNotificationsByUIDAndLocation: ['GET', '/communication/getNotificationsByUIDAndLocation'],
            markAsRead: ['PUT', '/communication/markAsReadUser'],

            retrieveReviews: ['GET', '/communication/retrieveReviews'],
            addReview: ['POST', '/usersasl/createReview'],

            login: ['POST', '/authentication/login'],
            enterInvitationCode: ['POST', '/authentication/login'],
            logout: ['GET', '/authentication/logout'],
            registerNewMember: ['POST', '/authentication/registerNewMemberViaPostBody'],
            getAuthenticationStatus: ['GET', '/authentication/getAuthenticationStatus'],
            registerNewMemberWithInvitationCode: ['POST', '/authentication/registerNewMemberWithInvitationCode'],
            createAnonymousUser: ['POST', '/authentication/registerAnonymousAdhocMember'],

            retrieveLoyaltyStatus: ['GET', '/retail/retrieveLoyaltyStatus'],

            getDomainAndFilterOptions: ['GET', '/sasl/getDomainAndFilterOptions'],
            getDomainOptions: ['GET', '/sasl/getDomainOptions'],
            getSASLFilterOptions: ['GET', '/sasl/getSASLFilterOptions'],

            getCatalog: ['GET', '/retail/retrieveCatalog'],
            getCatalogs: ['GET', '/retail/retrieveCatalogs'],
            getRoster: ['GET', '/retail/retrieveRoster'],
            createUserOrder: ['POST', '/retail/createUserOrderClient'],
            // getCreditCardTypes: ['GET', '/retail/getCreditCardTypes'],
            getCreditCardInfo: ['GET', '/retail/getCreditCardInfo'],
            getPriceAddons: ['GET', '/retail/retrieveRetailPriceAddon'],

            retrieveContestsForClient: ['GET', '/contests/retrieveContestsForClient'],
            retrievePhotoContest: ['GET', '/contests/retrievePhotoContestClient'],
            retrievePollContest: ['GET', '/contests/retrievePollContestClient'],
            retrieveCheckinContest: ['GET', '/contests/retrieveCheckinContestClient'],
            enterPoll: ['POST', '/contests/enterPoll'],
            enterCheckIn: ['POST', '/contests/enterCheckinContest'],
            enterPhotoContest: ['POST', '/contests/enterPhotoContest'],

            getEventByUUID: ['GET', '/reservations/getEventByUUID'],

            sendPromoURLToEmail: ['GET', '/html/sendPromoURLToEmail'],
            sendPromoURLToMobileviaSMS: ['GET', '/html/sendPromoURLToMobileviaSMS'],
            sendAppURLForSASLToMobileviaSMS: ['GET', '/html/sendAppURLForSASLToMobileviaSMS'],

            sendCustomerSupportEmail: ['POST', '/html/sendCustomerSupportEmail']

        };
    }
};
