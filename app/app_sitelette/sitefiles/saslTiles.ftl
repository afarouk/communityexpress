<div class="container-fluid discounts-block-wrapper" style="margin-top:86px;">
	<div class="discounts-block">
		<!-- Nav tabs -->
		<ul class="nav nav-tabs" role="tablist">
			<li role="presentation" class="active"><a href="#tiles_tab" aria-controls="home" role="tab" data-toggle="tab">Discounts(${tileCount})</a></li>
			<li role="presentation"><a href="#list_tab" aria-controls="profile" role="tab" data-toggle="tab">List</a></li>
			<li role="presentation"><a href="#map_tab" aria-controls="profile" role="tab" data-toggle="tab">Map</a></li>
		</ul>

		<!-- Tab panes -->
		<div class="tab-content">
			<div role="tabpanel" class="tab-pane fade in active" id="tiles_tab">
				<div class="row business-block">
					<div class="business-discounts">
						<#list tiles as tile>
						   <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 tile-wrapper">
						   		<#if tile.onClickURL?? >
						   			<a href="${tile.onClickURL}">
						   		</#if>
									<div class="tile">
				                        <div class="header">
											<img src="${tile.bannerURL}" alt="banner">
											<#if tile.promoType.enumText == "DINING_DEAL" >
												<span class="glyphicon glyphicon-cutlery" aria-hidden="true" style="color:${tile.promoType.color}"></span>
											</#if>
											<#if tile.promoType.enumText == "DISCOUNT" >
												<span class="glyphicon glyphicon-tags" aria-hidden="true" style="color:${tile.promoType.color}"></span>
											</#if>
											<#if tile.promoType.enumText == "ENTERTAINMENT" >
												<span class="glyphicon glyphicon-music" aria-hidden="true" style="color:${tile.promoType.color}"></span>
											</#if>
											<#if tile.promoType.enumText == "HAPPYHOUR" >
												<span class="glyphicon glyphicon-glass" aria-hidden="true" style="color:${tile.promoType.color}"></span>
											</#if>
										</div>
										<div class="body">
											<div class="img-container">
												<img src="${tile.url}">
											</div>
											<div class="info-wrapper">
												<div class="title">${tile.title}</div>
												<div class="description">${tile.message}</div>
											</div>
										</div>
									</div>
								<#if tile.onClickURL?? >
						   			</a>
						   		</#if>
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
										<td><a href="${sasl.friendyURL}"></a>${sasl.name}</td>
										<td>${sasl.distanceInMiles} miles</td>
										<td class="marker-container"><a href="${sasl.friendyURL}"><span
											class="glyphicon glyphicon-map-marker" aria-hidden="true"></span></a></td>
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

<script>
	var map,
	center = {
		lat : -25.363,
		lng : 131.044
	};
	function initMap() {
		map = new google.maps.Map(document
				.getElementById('map'), {
			zoom : 4,
			center : center,
			scrollwheel: false
		});
		var marker = new google.maps.Marker({
			position : center,
			map : map
		});
	}

	var elem = document.querySelectorAll("a[href='#map_tab']");

	elem[0].addEventListener('click', function() { 
		initMap();
		setTimeout(function() {
			google.maps.event.trigger(map, 'resize');
			map.setCenter(new google.maps.LatLng(center.lat, center.lng));
		}, 1000);
	}, false);

</script>
<script async defer
	src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDV7jH2GL811-d_q2COrnU88dfkWqCL6gY&callback=initMap">
</script>