<body>

	<audio id="addtocart" src="themes/7/tempSound/addToCart.wav" autostart="false" ></audio>
	<audio id="removefromcart" src="themes/7/tempSound/removeFromCart.wav" autostart="false" ></audio>

	<div class="popup_container"></div>

	<div id="cmtyx_header" data-role="header" class="header common_header">
		<div id="cmtyx_header_menu_button" class="menu_btn">
			<div class="menu_btn_hamburger cmtyx_special_icon_color">&#9776;</div>
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
			<div id="cmtyx_chat_block" class="chat-container">
				<!-- chat content here-->
			</div>
		</div>
	</div>

	<div id="cmtyx_medicalSecureView">
		<div class="secure-container">
			<div class="chat-logo">
              <div class="chat-name">
                <span>Secure chat</span>
              </div>
              <!-- <img src="themes/7/placeholder_images/medicuris-logo.png"></img> -->
              <span class="fa fa-weixin" aria-hidden="true"></span>
            </div>    
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
					<input type="text" pattern="\d*" maxlength="3" name="" value="" class="secure-input" placeholder="???">
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
