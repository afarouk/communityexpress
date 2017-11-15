<body>

	<audio id="addtocart" src="themes/6/tempSound/addToCart.wav" autostart="false" ></audio>
	<audio id="removefromcart" src="themes/6/tempSound/removeFromCart.wav" autostart="false" ></audio>

	<div class="popup_container"></div>

	<div id="cmtyx_header" data-role="header" class="header common_header">
		<div id="cmtyx_header_menu_button" class="menu_btn">
			<div class="menu_btn_hamburger cmtyx_special_icon_color">&#9776;</div>
			<span class="messages_counter" style="display:none;"></span>
		</div>
		<div id="cmtyx_header_back_button" data-role="button" data-icon="back">
			<span class="glyphicon glyphicon-arrow-left cmtyx_special_icon_color"></span>
		</div>
		<div class="logo_container cmtyx_special_background_color">
			<img src="${bannerImageURL}" />
		</div>
	</div>

	<div id="cmtyx_navbar" data-role="footer" data-position="fixed" class="ui-footer ui-bar-a ui-footer-fixed slideup common_footer ui-navbar" role="navigation">
		<div data-role="navbar">
			<ul class="ui-grid-c">
				<li class="ui-block-a" style="pointer-events: none;">
					<a href="#" class="menu_button_3 ui-btn">
						<div class="navbar_btn_icon"></div>
						<br>&nbsp
					</a>
				</li>
				<li class="ui-block-b" style="pointer-events: none;">
					<a href="#" class="menu_button_2 ui-btn">
						<div class="navbar_btn_icon"></div>
						<br>&nbsp
					</a>
				</li>
				<li class="ui-block-c"><a href="#" class="menu_button_4 ui-btn">
						<div class="navbar_btn_icon icon-information_ navbutton_about"></div>
						<br>About
					</a>
				</li>
				<li class="ui-block-d"><a href="#" class="menu_button_5 ui-btn">
						<div class="navbar_btn_icon icon-user_"></div>
						<br>User
					</a>
				</li>
			</ul>
		</div>
	</div>

	<!-- HOME-->
	<div id="cmtyx_landingView" data-role="page">
		<div class="home_body p-0">
			<ul>
				<li id="loyalty-bar-code" class="loyalty-bar-code">
					<!-- bar code for loyalty -->
				</li>
			
				<li id="cmtyx_welcome_block" style="pointer-events: none;">
	  			    <#if (medias)?has_content >
					   <img src="${medias[0].URL}" />
					<#else>
					   <img src="themes/6/placeholder_images/welocome_img.png"></img>
        			</#if>

					<div class="welcome_block">
					  <#if (medias)?has_content >
					    <#if (medias[0]??) >
						  <div class="title">${medias[0].title}</div>
						  <div class="undertitle">${medias[0].message}</div>
					    <#else>
					      <div class="title">(no title)</div>
						  <div class="undertitle">(no message) </div>
					    </#if>
					  </#if>
					</div>
				</li>
			</ul>

			<ul class="home_tabs_list">

				<!----- Videos  ---------------->		
				<#if (externalMedia)?has_content >
					<li id="cmtyx_video_block" class="video_block">
						<div class="header cmtyx_color_1">
							<span class="title">Instructions</span> <span class="collapse_btn">&#9660;</span>
						</div>
					    <div class="body last">
			            <ul>
					      <#list externalMedia as media>
					          <li>
				          		<span class="video_title">${media.title}</span>
		 						<#if videoNeedsPlaceholder>
				                    <div id="externalvideo${media.idMedia}" class="embedded_videos external" idmedia="${media.idMedia}" idVideo="${media.vid}" srcmedia="https://www.youtube.com/embed/${media.vid}?playsinline=1" style="background: #000 url(&quot;${media.thumbnailURL}&quot;)  no-repeat center center;">
				                      <a href="#">
				                        <img src="themes/1/mobile/css/images/play.png" alt="Play" srcmedia="https://www.youtube.com/embed/${media.vid}?playsinline=1">
				                      </a>
				                    </div>
				                    <div class="video_item_message">
			 						    <span>${media.message}</span>
			 						</div>
	                    		<#else>
				                    <div class="embedded_videos">
					                    <iframe width="100%" height="250"
										    src="https://www.youtube.com/embed/${media.vid}?playsinline=1"frameborder="0"
										    allowfullscreen="1">
									    </iframe>
									    <br>
			 						    <div class="video_item_message">
			 						    	<span>${media.message}</span>
			 						    </div>
				                    </div>
			                    </#if>

	                          </li>
							</#list>
					      </ul>
						  <!-- <div style="text-align:center;">
							  (No videos available)
						  </div> -->
						</div>
					</li>
				</#if>
					
				<!----- End of Videos  ---------------->
				
				<!----- Sweepstakes (Poll)  ---------------->
				<li id="cmtyx_poll_block" class="poll_block">
					<div class="header cmtyx_color_2">
						<span class="title">Vote</span> <span class="collapse_btn">&#9660;</span>
					</div>
					<div class="body">
                      <!-- empty -->
                      <span>Loading...</span>
                  	</div>
				</li>
				
				<!----- End of Sweepstakes (Poll)  ---------------->
			</ul>
			
			<div style="height:100px;">
				<!--empty space temporary-->
			</div>
		</div>
	</div>

	<div id="cmtyx_medicalSecureView">
		<div class="secure-container">
			<#if sasl.domainEnum.enumText=="MEDICURIS">
				<div class="medical-name">
					<span>Medicuris</span>
				</div>
				<div class="medical-logo">
					<span class="fa fa-heartbeat"></span>
				</div>		    
			<#else>
				<div class="vote-name">
					<span>Vote</span>
				</div>
				<div class="vote-logo">
					<span class="fa fa-hand-paper-o"></span>
				</div>			   
			</#if>
			<div class="ticket-container">
				<div class="ticket">
					<div class="left-waves"></div>
					<div class="left-circle-t"></div>
					<div class="small-circle-t"></div>
					<div class="ticket-center">
						<i class="fa fa-star-o star t-l" aria-hidden="true"></i>
						<i class="fa fa-star-o star t-r" aria-hidden="true"></i>
						<i class="fa fa-star-o star b-l" aria-hidden="true"></i>
						<i class="fa fa-star-o star b-r" aria-hidden="true"></i>
					</div>
					<div class="right-waves"></div>
					<div class="right-circle-t"></div>
				</div>
			</div>
			<div class="secure-block">
				<div class="left puzzle">
					<span class="t"></span>
					<span class="r"></span>
					<span class="b"></span>
					<span class="l"></span>
					<span class="secure-text">xxx</span>
				</div>
				<div class="right puzzle">
					<span class="t"></span>
					<span class="r"></span>
					<span class="b"></span>
					<span class="l"></span>
					<input type="text" pattern="\d*" maxlength="3" name="" class="secure-input" placeholder="???">
				</div>
			</div>
			<div class="approve-message">
				<div class="type-code">
					<span>* Please, type security code.</span>
				</div>
				<div class="mismatch-code">
					<span>* Security codes mismatch.</span>
				</div>
				<div class="ticket-match">
					<span>Do both numbers match your ticket?</span>
					<div class="ticket-btns">
						<button type="button" class="confirm">YES</button>
						<button type="button" class="reject">NO</button>
					</div>
				</div>
				<div class="ticket-approved">
					<span>* Ticket approved.</span>
				</div>
			</div>
		</div>
		<div class="invalid-code">
			<i class="fa fa-minus-circle" aria-hidden="true"></i>
			<span class="full-code">Full code is invalid!</span>
			<span class="ticket-no">Please do not proceed!</span>
		</div>
	</div>

	<script src="build/bundle.js"></script>
</body>
