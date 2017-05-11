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
								<div class="tile">
									<#if (tile.onClickURL)?has_content >
				                        <a href="${tile.onClickURL}">
											<div class="header">
												<img src="${tile.bannerURL}" alt="banner"> <i class="icon-clothes"></i>
											</div>
										</a>
				                    <#else>
				                        <div class="header">
											<img src="${tile.bannerURL}" alt="banner"> <i class="icon-clothes"></i>
										</div>
				                    </#if>
									<div class="body">
										<div class="img-container">
											<img src="http://placehold.it/320x240">
										</div>
										<div class="info-wrapper">
											<div class="title">${tile.title}</div>
											<div class="description">${tile.message}</div>
										</div>
									</div>
								</div>
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
								<tr>
									<td>Zaza grill</td>
									<td>0.45 miles</td>
									<td class="marker-container"><span
										class="glyphicon glyphicon-map-marker" aria-hidden="true"></span></td>
								</tr>
								<tr>
									<td>Ciceros pizza</td>
									<td>0.54 miles</td>
									<td class="marker-container"><span
										class="glyphicon glyphicon-map-marker" aria-hidden="true"></span></td>
								</tr>
								<tr>
									<td>Vibha Fashion</td>
									<td>0.16 miles</td>
									<td class="marker-container"><span
										class="glyphicon glyphicon-map-marker" aria-hidden="true"></span></td>
								</tr>
								<tr>
									<td>Toy Store</td>
									<td>0.23 miles</td>
									<td class="marker-container"><span
										class="glyphicon glyphicon-map-marker" aria-hidden="true"></span></td>
								</tr>
								<tr>
									<td>Hair Cair</td>
									<td>0.25 miles</td>
									<td class="marker-container"><span
										class="glyphicon glyphicon-map-marker" aria-hidden="true"></span></td>
								</tr>
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