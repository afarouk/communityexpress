<div class="container-fluid discounts-block-wrapper" style="margin-top: 86px;">
	<div class="discounts-block">
		<!-- Nav tabs -->
		<ul class="nav nav-tabs" role="tablist">
			<li role="presentation" class="active"><a href="#tiles_tab"
				aria-controls="home" role="tab" data-toggle="tab">Discounts (${tileCount})</a></li>
			<li role="presentation"><a href="#list_tab"
				aria-controls="profile" role="tab" data-toggle="tab">List</a></li>
			<li role="presentation"><a href="#map_tab"
				aria-controls="profile" role="tab" data-toggle="tab">Map</a></li>
		</ul>

		<!-- Tab panes -->
		<div class="tab-content">
			<div role="tabpanel" class="tab-pane fade in active" id="tiles_tab">
				<div class="row business-block">
					<div class="business-discounts">
						<#list tiles as tile>
						<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 tile-wrapper">
							<a href="${tile.onClickURL}">
								<div class="tile">
									<div class="header">
										<img src="${tile.bannerURL}" alt="banner" class="business-banner">
										<#if tile.promoType.enumText == "UNDEFINED" >
											<img src="/sitefiles/images/promoType/OTHER.png" alt="promoType" class="promoType promo-type">
										</#if>
										<#if tile.promoType.enumText == "ACTIVITY" >
											<img src="/sitefiles/images/promoType/ACTIVITY.png" alt="promoType" class="promoType promo-type">
										</#if>
										<#if tile.promoType.enumText == "DINING_DEAL" >
											<img src="/sitefiles/images/promoType/DINING_DEAL.png" alt="promoType" class="promoType promo-type">
										</#if>
										<#if tile.promoType.enumText == "DISCOUNT" >
											<img src="/sitefiles/images/promoType/DISCOUNT.png" alt="promoType" class="promoType promo-type">
										</#if>
										<#if tile.promoType.enumText == "ENTERTAINMENT" >
											<img src="/sitefiles/images/promoType/ENTERTAINMENT.png" alt="promoType" class="promoType promo-type">
										</#if>
										<#if tile.promoType.enumText == "HAPPYHOUR" >
											<img src="/sitefiles/images/promoType/HAPPYHOUR.png" alt="promoType" class="promoType promo-type">
										</#if>
										<#if tile.promoType.enumText == "OTHER" >
											<img src="/sitefiles/images/promoType/OTHER.png" alt="promoType" class="promoType promo-type">
										</#if>
										<#if tile.promoType.enumText == "EVENT" >
											<img src="/sitefiles/images/promoType/EVENT.png" alt="promoType" class="promoType promo-type">
										</#if>
										<#if tile.promoType.enumText == "POLL" >
											<img src="/sitefiles/images/promoType/POLL.png" alt="promoType" class="promoType promo-type">
										</#if>
										<#if tile.promoType.enumText == "PHOTO_CONTEST" >
											<img src="/sitefiles/images/promoType/PHOTO_CONTEST.png" alt="promoType" class="promoType promo-type">
										</#if>
										<#if tile.promoType.enumText == "CAMPAIGN_PROMOTION" >
											<img src="/sitefiles/images/promoType/CAMPAIGN_PROMOTION.png" alt="promoType" class="promoType promo-type">
										</#if>
										<#if tile.promoType.enumText == "CAMPAIGN_SUBSCRIBE_FOR_NOTIFICATION" >
											<img src="/sitefiles/images/promoType/CAMPAIGN_SUBSCRIBE.png" alt="promoType" class="promoType promo-type">
										</#if>
										<#if tile.promoType.enumText == "AD_ALERT" >
											<img src="/sitefiles/images/promoType/AD_ALERT.png" alt="promoType" class="promoType promo-type">
										</#if>
									</div>
									<div class="body">
										<div class="img-container">
											<img src="${tile.URL}">
										</div>
										<div class="info-wrapper">
											<div class="title">${tile.title}</div>
											<div class="description">${tile.message}</div>
										</div>
									</div>
							     </div> 
							</a>
						</div>
						</#list>
					</div>
				</div>
			</div>
			<div role="tabpanel" class="tab-pane fade" id="list_tab">
				<div class="row">
					<div class="col-xs-12">
						<table class="table table-bordered businesses-table">
							<thead>
								<tr>
									<th>Name</th>
									<th>Distance</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								<#list sasls as sasl>
								<tr>
									<td class="name-conatiner"><a href="${sasl.onClickURL}">${sasl.name}</a></td>
									<td class="distance-conatiner"><a href="${sasl.onClickURL}">${sasl.distanceInMiles} miles</a></td>
								    <td class="marker-container"><a href="${sasl.onClickURL}"><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span></a></td>
								</tr>
								</#list>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div role="tabpanel" class="tab-pane fade" id="map_tab">
				<div class="row">
					<div class="col-xs-12">
						<div id="map" class="map-container"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>