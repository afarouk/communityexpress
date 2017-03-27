'use strict';

'use strict';

define([
	'../../scripts/appCache'
	], function(appCache){
	var CatalogsController = Mn.Object.extend({
		manageCatalog: function() {
			var saslData = appCache.get('saslData');
	        if (saslData) {
	            switch (saslData.retailViewType) {
	                case 'ROSTER':
	                    this.showRosterView(saslData);
	                    break;
	                case 'CATALOGS':
	                    this.showCatalogsView(saslData);
	                    break;
	                case 'CATALOG':
	                    this.showSingleCatalog(saslData);
	                    break;
	            default:
	            }
	        }
		},

		showRosterView: function(saslData) {

		},

		showCatalogsView: function(saslData) {
			
		},

		showSingleCatalog: function(saslData) {

		}
	});
	return new CatalogsController();
});