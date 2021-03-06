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
            markAsRead: ['PUT', '/communication/markAsReadSASLUser'],

            retrieveReviews: ['GET', '/communication/retrieveReviews'],
            addReview: ['POST', '/usersasl/createReview'],

            login: ['POST', '/authentication/login'],
            loginWithFacebook: ['POST', '/authentication/exchangeFacebookIdForUID'],
            enterInvitationCode: ['POST', '/authentication/login'],
            logout: ['GET', '/authentication/logout'],
            userForgotPassword: ['PUT', '/authentication/sendEmailForResetPassword'],
            registerNewMember: ['POST', '/authentication/registerNewMemberViaPostBody'],
            getAuthenticationStatus: ['GET', '/authentication/getAuthenticationStatus'],
            registerNewMemberWithInvitationCode: ['POST', '/authentication/registerNewMemberWithInvitationCode'],
            createAnonymousUser: ['POST', '/authentication/registerAnonymousAdhocMember'],
            doesUIDexist: ['GET', '/authentication/doesUIDexist'],

            retrieveLoyaltyStatus: ['GET', '/retail/retrieveLoyaltyStatus'],

            getDomainAndFilterOptions: ['GET', '/sasl/getDomainAndFilterOptions'],
            getDomainOptions: ['GET', '/sasl/getDomainOptions'],
            getSASLFilterOptions: ['GET', '/sasl/getSASLFilterOptions'],

            getCatalog: ['GET', '/retail/retrieveCatalog'],
            getCatalogs: ['GET', '/retail/retrieveCatalogsIds'],
            getSubItems: ['GET', '/retail/retrieveSubItems'],
            getRoster: ['GET', '/retail/retrieveRoster'],
            createAdhocOrderWeb: ['POST', '/retail/createAdhocOrderWeb'],
            createUserEventOrderSingleton: ['POST', '/reservations/createAdhocOrderWebSingleton'],
            getItemDetailsForPromoItem: ['GET', '/retail/retreiveItemDetailsForPromo'],
            getEventDetails: ['GET', '/reservations/retreiveEventDetailsForPurchase'],

            getOrderPrefillInfo: ['GET', '/retail/getOrderPrefillInfo'],

            retrieveOrdersByUID: ['GET', '/retail/retrieveOrdersByUID'],
            retrieveOrderByID: ['GET', '/html/retrieveOrderByID'],
            retrieveOrderByUUID: ['GET', '/retail/retrieveOrderByUUID'],

            validatePromoCode: ['POST', '/retail/validateRetailPromoCode'],
            retrievePromoCodeByUUID: ['GET', '/retail/retrieveRetailPromoCodeByUUID'],
            retrieveRetailPromoCodes: ['GET', '/retail/retrieveRetailPromoCodes'],

            retrieveContestsForClient: ['GET', '/contests/retrieveContestsForClient'],
            retrievePhotoContest: ['GET', '/contests/retrievePhotoContestClient'],
            retrievePollContest: ['GET', '/contests/retrievePollContestClient'],
            retrieveCheckinContest: ['GET', '/contests/retrieveCheckinContestClient'],

            retrievePollContestsBySASL: ['GET', '/contests/retrievePollContestsBySASL'],
            retrievePhotoContestsBySASL: ['GET', '/contests/retrievePhotoContestsBySASL'],

            enterPoll: ['POST', '/contests/enterPoll'],
            enterCheckIn: ['POST', '/contests/enterCheckinContest'],
            enterPhotoContest: ['POST', '/contests/enterPhotoContest'],

            getEventByUUID: ['GET', '/reservations/getEventByUUID'],

            sendPromoURLToEmail: ['GET', '/html/sendPromoURLToEmail'],

            shareURLviaSMS: ['POST', '/html/shareURLviaSMS'],

            sendContactUsEmail: ['POST', '/html/sendContactUsEmail'],

            sendCustomerSupportEmail: ['POST', '/html/sendCustomerSupportEmail'],

            getAppointments: ['GET', '/appointments/fc_retrieveEvents'],
            bookAppointment: ['PUT', '/appointments/fc_bookappointment'],

            simfelAuthentication: ['POST', '/test/simfelAuthentication'],
            medicurisAuthentication: ['POST', '/test/medicurisAuthentication'],
            secureChatAuthentication: ['POST', '/test/secureChatAuthentication'],
            getSASLcodeByPIN: ['POST', '/test/getSASLcodeByPIN'],
            verifySASLcodeAndRetrieveUID: ['POST', '/test/verifySASLcodeAndRetrieveUID'],

            vantivTransactionSetup: ['POST', '/ext/vantivTransactionSetup']
        };
    }
};
