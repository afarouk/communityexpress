<body>

	<audio id="addtocart" src="themes/5/tempSound/addToCart.wav" autostart="false" ></audio>
	<audio id="removefromcart" src="themes/5/tempSound/removeFromCart.wav" autostart="false" ></audio>

	<div class="popup_container"></div>

	<div id="cmtyx_header" data-role="header" class="header common_header">
		<div id="cmtyx_header_prev_page_button" class="prev_page_button"></div>
		<!-- <div id="cmtyx_header_menu_button" class="menu_btn">
			<div class="menu_btn_hamburger cmtyx_special_icon_color">&#9776;</div>
			<span class="messages_counter" style="display:none;"></span>
		</div> -->
		<div class="qrCode_btn" id="cmtyx_header_qrCode_button">
			<div class="qr_image"></div>
		</div>
		<div id="cmtyx_header_back_button" data-role="button" data-icon="back">
			<span class="glyphicon glyphicon-arrow-left cmtyx_special_icon_color"></span>
		</div>
		<div class="logo_container cmtyx_special_background_color">
			<!--  <img src="themes/5/placeholder_images/ZAZA-Grill.png" /> -->
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
			
				<li id="cmtyx_welcome_block">
	  			    <#if (medias)?has_content >
					   <img src="${medias[0].URL}" />
					<#else>
					   <img src="themes/5/placeholder_images/welocome_img.png"></img>
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
					
						<!-- Share This Site ------------------------>
							<li id="cmtyx_share_block" class="share_block"><span
							class="title"> Share this site </span>
							<div class="ui-grid-c">
								<div class="sms_input_block">
									<input class="phone_us sms_input" type="tel" name="sms_input" placeholder="(US mobile)" value="" size="14" maxlength="64" data-role="none">
									<span class="sms_send_button cmtyx_color_1 cmtyx_border_color_1">Send</span>
								</div>
								<div class="ui-block-a text sms_block">
									<a href="" class="share_sms">
										<div class="share_icons_round_block">
											<i class="cmtyx_share_icon_color share_icon_round fa fa-mobile"></i>
										</div>
									</a>
								</div>
								<div class="ui-block-b text email_block">
									<a href="" class="share_email">
										<div class="share_icons_round_block">
											<i class="cmtyx_share_icon_color share_icon_round fa fa-envelope"></i>
										</div>
									</a>
								</div>
								<div class="ui-block-c text facebook_block">
									<a href="" target="_blank" class="share_facebook">
										<div class="share_icons_round_block">
											<i class="cmtyx_share_icon_color share_icon_round fa fa-facebook"></i>
										</div>
									</a>
								</div>
								<div class="ui-block-d text twitter_block">
									<a href="" target="_blank" class="share_twitter">
										<div class="share_icons_round_block">
											<i class="cmtyx_share_icon_color share_icon_round fa fa-twitter"></i>
										</div>
									</a>
								</div>
							</div>
						</li>
					
						<!-- Share This Site -------------------->

			<!--    APPOINTMENTS-->

				<li id="cmtyx_appointments_block" class="appointments-block">
					<div class="header cmtyx_color_1">
						<span class="title">Appointments</span> 
						<span class="collapse_btn">&#9660;</span>
					</div>
					<div class="body">
						<div class="navigation_block">
							<span class="arr back_arr"> <span
								class="arr_icon back_arr_icon"></span>
							</span> <span class="date">Aug, 24, 2016</span> <span class="arr next_arr">
								<span class="arr_icon next_arr_icon"></span>
							</span>
						</div>
						<div class="schedule_block">
							<table>
								<tr>
									<td rowspan="2" class="hour cmtyx_text_color_1 right_border">10:00</td>
									<td rowspan="2" class="event">
										<div class="event_description">We are passionate about
											coffee. Our founder has a PhD in Coffiology, from the Columbian
											Beverage Science Academy.</div>
									</td>
								</tr>
								<tr>
								</tr>
								<tr>
									<td rowspan="2" class="hour cmtyx_text_color_1 right_border">11:00</td>
									<td rowspan="2" class="event">
										<div class="event_description reserved">(Reserved)</div>
									</td>
								</tr>
								<tr>
								</tr>
								<tr>
									<td rowspan="2" class="hour cmtyx_text_color_1 right_border">12:00</td>
									<td class="event"></td>
								</tr>
								<tr>
									<td class="event"></td>
								</tr>
								<tr>
									<td rowspan="2" class="hour cmtyx_text_color_1 right_border">13:00</td>
									<td class="event"></td>
								</tr>
								<tr>
									<td class="event"></td>
								</tr>
								<tr>
									<td rowspan="2" class="hour cmtyx_text_color_1 right_border">14:00</td>
									<td class="event"></td>
								</tr>
								<tr>
									<td class="event"></td>
								</tr>
								<tr>
									<td rowspan="2" class="hour cmtyx_text_color_1 right_border">15:00</td>
									<td rowspan="2" class="event">
										<div class="event_description">We are passionate about
											coffee. Our founder has a PhD in Coffiology, from the Columbian
											Beverage Science Academy.</div>
									</td>
								</tr>
								<tr>
								</tr>
								<tr>
									<td rowspan="2" class="hour cmtyx_text_color_1 right_border">16:00</td>
									<td class="event"></td>
								</tr>
								<tr>
									<td class="event"></td>
								</tr>
								<tr>
									<td rowspan="2" class="hour cmtyx_text_color_1 right_border">17:00</td>
									<td class="event"></td>
								</tr>
								<tr>
									<td class="event"></td>
								</tr>
								<tr>
									<td rowspan="2" class="hour cmtyx_text_color_1 right_border">18:00</td>
									<td class="event"></td>
								</tr>
								<tr>
									<td class="event"></td>
								</tr>
							</table>
						</div>
					</div>
				</li>
						
				<!--   end of APPOINTMENTS-->
				
				<!----- Sweepstakes (Poll)  ---------------->
				<li id="cmtyx_poll_block" class="poll_block">
					<div class="header cmtyx_color_2">
						<span class="title">Sweepstake</span> <span class="collapse_btn">&#9660;</span>
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
						                    <div class="ui-block-b">All entries are entered into our mini sweepstakes!</div>
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
						                <div class="share_container">
						                    <div class="share_btn_block cmtyx_share_icon_color"
						                        uuid="">
						                        <span class="icon cmtyx_share_icon_color fa fa-share"></span> <span class="text">Share</span>
						                    </div>
						                    <div class="share_block" data-uuid="${poll.contestUUID}">
						                        <div class="ui-grid-c">
						                            <div class="sms_input_block" data-uuid="${poll.contestUUID}">
						                                <input class="phone_us sms_input" type="tel" name="sms_input" placeholder="(US mobile)" value="" size="14" maxlength="64" data-role="none">
						                                <span class="sms_send_button cmtyx_color_1 cmtyx_border_color_1">Send</span>
						                            </div>
						                            <div class="ui-block-a text sms_block">
														<a href="" class="share_sms">
															<div class="share_icons_round_block">
																<i class="cmtyx_share_icon_color share_icon_round fa fa-mobile"></i>
															</div>
														</a>
													</div>
													<div class="ui-block-b text email_block">
														<a href="" class="share_email">
															<div class="share_icons_round_block">
																<i class="cmtyx_share_icon_color share_icon_round fa fa-envelope"></i>
															</div>
														</a>
													</div>
													<div class="ui-block-c text facebook_block">
														<a href="" target="_blank" class="share_facebook">
															<div class="share_icons_round_block">
																<i class="cmtyx_share_icon_color share_icon_round fa fa-facebook"></i>
															</div>
														</a>
													</div>
													<div class="ui-block-d text twitter_block">
														<a href="" target="_blank" class="share_twitter">
															<div class="share_icons_round_block">
																<i class="cmtyx_share_icon_color share_icon_round fa fa-twitter"></i>
															</div>
														</a>
													</div>
						                        </div>
						                    </div>
						                </div>
						            </div>
						        </li>
							</#list>
						</ul>
					</div>
				</li>
				
			<!----- End of Sweepstakes (Poll)  ---------------->
				
			<!----- Selfie Contest (Photo contest)  ---------------->				
				
				<li id="cmtyx_photo_contest_block" class="photo_contest_block">
					<div class="header cmtyx_color_4">
						<span class="title">Selfie contest</span> <span
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

					                    <div class="share_container">
					                        <div class="share_btn_block cmtyx_share_icon_color"
					                            uuid="">
					                            <span class="icon cmtyx_share_icon_color fa fa-share"></span> <span class="text">Share</span>
					                        </div>
					                        <div class="share_block" data-uuid="${photo.contestUUID}">
					                            <div class="ui-grid-c">
					                                <div class="sms_input_block" data-uuid="${photo.contestUUID}">
					                                    <input class="phone_us sms_input" type="tel" name="sms_input" placeholder="(US mobile)" value="" size="14" maxlength="64" data-role="none">
					                                    <span class="sms_send_button cmtyx_color_1 cmtyx_border_color_1">Send</span>
					                                </div>
					                                <div class="ui-block-a text sms_block">
														<a href="" class="share_sms">
															<div class="share_icons_round_block">
																<i class="cmtyx_share_icon_color share_icon_round fa fa-mobile"></i>
															</div>
														</a>
													</div>
													<div class="ui-block-b text email_block">
														<a href="" class="share_email">
															<div class="share_icons_round_block">
																<i class="cmtyx_share_icon_color share_icon_round fa fa-envelope"></i>
															</div>
														</a>
													</div>
													<div class="ui-block-c text facebook_block">
														<a href="" target="_blank" class="share_facebook">
															<div class="share_icons_round_block">
																<i class="cmtyx_share_icon_color share_icon_round fa fa-facebook"></i>
															</div>
														</a>
													</div>
													<div class="ui-block-d text twitter_block">
														<a href="" target="_blank" class="share_twitter">
															<div class="share_icons_round_block">
																<i class="cmtyx_share_icon_color share_icon_round fa fa-twitter"></i>
															</div>
														</a>
													</div>
					                            </div>
					                        </div>
					                    </div>
					                </div>
					            </li>
					        </#list>
					    </ul>
					</div>
				</li>
				
			<!----- End of Selfie Contest (Photo contest)  ---------------->		

			</ul>
			<ul class="cmtyx_bottom_block" id="cmtyx_contact_us_block">
				<li id="cmtyx_driving_directions_block"
					class="driving_directions_block"><span class="title">contact
						us</span>
					<div class="ui-grid-a btns_container">
						<div class="ui-block-a p-r-10">
							<a target="_blank" href="" id="driveToUs"
								class="ui-btn ui-corner-all back_btn cmtyx_border_color_1 cmtyx_text_color_1">Drive</a>
						</div>
						<div class="ui-block-b p-l-10">
							<a target="_blank" href="" id="callUs"
								class="ui-btn ui-corner-all next_btn cmtyx_color_1 cmtyx_border_color_1">Call</a>
						</div>
					</div>
				</li>
				
				
				<li class="map_in_landing">
					<div id="home_map" class="map_container"></div>
				</li>
			</ul>
		</div>
	</div>

	<div id="cmtyx_medicalSecureView">
		<div class="ticket">
			<div class="medical-name">
				<span>Medicuris</span>
			</div>
			<div class="medical-logo">
				<span class="fa fa-heartbeat"></span>
			</div>
			<div class="secure-block">
				<div class="left puzzle">
					<span class="t"></span>
					<span class="r"></span>
					<span class="b"></span>
					<span class="l"></span>
					<span class="secure-text">???</span>
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
				<span>* Please, type security code.</span>
			</div>
		</div>
	</div>

	<script src="build/bundle.js"></script>
</body>
