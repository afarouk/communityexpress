<body>

	<audio id="addtocart" src="themes/6/tempSound/addToCart.wav" autostart="false" ></audio>
	<audio id="removefromcart" src="themes/6/tempSound/removeFromCart.wav" autostart="false" ></audio>

	<div class="popup_container"></div>

	<div id="cmtyx_header" data-role="header" class="header common_header">
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
						<ul class="poll_gallery">
        					<#list polls as poll>
            					<li class="poll_item" data-uuid="${poll.contestUUID}">
                					<div class="contest_container">
                						<div class="poll_block_title">&nbsp</div>
					                    <img class="poll_image" src="${poll.imageURL}"></img>
					                    <span class="poll_displaytext">${poll.displayText}?</span>
					                    <ul class="poll_ans_form <#if poll.answerStatus.enumText == 'ANSWERED'>answered</#if>">
				                    		<#list poll.choices as choice>
					                            <li>
					                                <div class="ui-grid-a">
					                                    <div class="ui-block-a">
					                                        <input data-role="none" type="radio" name="radio-choice-ans" id="ans_${choice_index}-${poll.contestUUID}" data-uuid="${poll.contestUUID}" data-choice="${choice.choiceId}" class="ansRadioChoice" <#if choice_index == 0>checked="checked"</#if> >
					                                        <label for="ans_${choice_index}-${poll.contestUUID}"><span><span></span></span></label>
					                                        <div class="question_item">
					                                            <div class="bar">
					                                            	<div class="back cmtyx_color_${(choice_index % 4) + 1}"></div>
                                                    				<span class="percent"></span>
					                                            </div>
					                                            <p class="question_text">${choice.displayText}</p>
					                                        </div>
					                                    </div>
					                                </div>
					                            </li>
					                        </#list>
					                    </ul>
					                    <#if poll.answerStatus.enumText != "ANSWERED">
					                        <button class="submit_poll_button open_menu_btn cmtyx_border_color_1 cmtyx_text_color_1 ui-btn ui-corner-all" data-uuid="${poll.contestUUID}">submit</button>
					                    </#if>
					                    <div class="ui-grid-a prizes_title">
						                    <div class="ui-block-a">
						                        <div class="medal_icon"></div>
						                    </div>
						                    <div class="ui-block-b">All uploads are confidential</div>
						                </div>
						                <ul class="contest_prizes <#if poll.answerStatus.enumText == 'ANSWERED'>shown</#if>">
						                    <#list poll.prizes as prize>
						                        <li>
						                            <div class="prize_block">
						                                <div class="ui-grid-a prize_container">
						                                    <#if prize.imageUrl??>
						                                      <div class="ui-block-a">
						                                        <img src="${prize.imageUrl}"></img>
						                                      </div>
						                                    </#if>
						                                    <div class="ui-block-b ">
						                                        <div class="prize_text_block">
						                                            <span class="prize_text">${prize.contestPrizeName}</span>
						                                            <span class="prize_condition">${prize.displayText}</span>
						                                            <span class="prize_date">${prize.quantity}</span>
						                                        </div>
						                                    </div>
						                                </div>
						                            </div>
						                        </li>
						                    </#list>
						                </ul>
						            </div>
						        </li>
							</#list>
						</ul>
					</div>
				</li>
				
			<!----- End of Sweepstakes (Poll)  ---------------->

			<#if sasl.domainEnum.enumText=="MEDICURIS">
			<!----- Selfie Contest (Photo contest)  ---------------->				
				
				<li id="cmtyx_photo_contest_block" class="photo_contest_block">
					<div class="header cmtyx_color_4">
						<span class="title">Upload Picture</span> <span
							class="collapse_btn">&#9660;</span>
					</div>
					<div class="body">
						<ul class="photo_gallery">
							<#list photocontests as photo>
					            <li class="photo_item" data-uuid="${photo.contestUUID}">
					                <div class="contest_container">
					                    <div class="photo_block_title"><p>&nbsp</p></div>
					                    <img src="${photo.imageURL}" class="photo_image"></img>
					                    <span class="contest_task">${photo.displayText}</span>
				                        <button class="ui-btn ui-corner-all back_btn send_photo_btn cmtyx_border_color_1 cmtyx_text_color_1">SEND A PHOTO</button>
				                        <div class="photo_contest_upload_image" data-uuid="${photo.contestUUID}">
				                            <textarea autocapitalize="off" placeholder="Message" class="comntyex-upload_message_input ui-input-text ui-shadow-inset ui-body-inherit ui-textinput-autogrow" id="message" name="message" data-corners="false" style="height: 60px;"></textarea>
				                            <div class="dropzone" data-width="320" data-height="568" style="width: 100%;">
				                                <input type="file" name="thumb" />
				                            </div>
				                        </div>
					                </div>
					            </li>
					        </#list>
					    </ul>
					</div>
				</li>
				
			<!----- End of Selfie Contest (Photo contest)  ---------------->
			</#if>	

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
