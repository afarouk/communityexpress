<body>

	<audio id="addtocart" src="themes/1/tempSound/addToCart.wav" autostart="false" ></audio>
	<audio id="removefromcart" src="themes/1/tempSound/removeFromCart.wav" autostart="false" ></audio>

	<div class="popup_container"></div>

	<div id="cmtyx_header" data-role="header" class="header common_header">
		<div id="cmtyx_header_menu_button" class="menu_btn">
			<div class="menu_btn_img"></div>
			<span class="messages_counter" style="display:none;"></span>
		</div>
		<div id="cmtyx_header_back_button" data-role="button" data-icon="back">
			<span class="back_arr_icon"></span>
		</div>
		<div class="logo_container"
			style="background-color: ${sasl.themeColors.background}">
			<!--  <img src="themes/1/placeholder_images/ZAZA-Grill.png" /> -->
			<img src="${bannerImageURL}" />
		</div>
	</div>

	<div id="cmtyx_navbar" data-role="footer" data-position="fixed"
		class="ui-footer ui-bar-a ui-footer-fixed slideup common_footer">
		<div data-role="navbar">
			<ul>
				<li><a href="#" class="menu_button_3 ui-btn">
						<!-- <div class="navbar_btn_icon document_img"></div>  -->
						<div class="navbar_btn_icon icon-document"></div>
						<br>Menu
				</a></li>
				<li><a href="#" class="menu_button_2">
						<!-- <div class="navbar_btn_icon calendar_grey_img m-b-11"></div>  -->
						<div class="navbar_btn_icon icon-deals"></div>
						<br>Deals
				</a></li>
				<li><a href="#" class="menu_button_4">
						<!-- <div class="navbar_btn_icon information_button_img m-b-7"></div>  -->
						<div class="navbar_btn_icon icon-information"></div>
						<br>About
				</a></li>
				<li><a href="#" class="menu_button_5">
						<!-- <div class="navbar_btn_icon user_img m-b-9"></div>  -->
						<div class="navbar_btn_icon icon-user"></div>
						<span class="glyphicon glyphicon-ok .cmtyx_text_color_1" aria-hidden="true"></span>

						<br>User
				</a></li>
			</ul>
		</div>
	</div>

	<!-- HOME-->
	<div id="cmtyx_landingView" data-role="page">
		<div class="home_body p-0">
			<ul>
				<li id="cmtyx_welcome_block">
					<!-- <img src="themes/1/placeholder_images/welocome_img.png"></img> -->
					<#if notification??>
					<div class="breaking_news">
						<span class="news_line">${notification.notificationBody}</span>
					</div>
                   	</#if>
	  			    <#if (medias)?has_content >
					   <img src="${medias[0].URL}" />
					<#else>
					   <img src="themes/1/placeholder_images/welocome_img.png"></img>
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
						<button
								class="ui-btn ui-corner-all catalog open_menu_btn cmtyx_border_color_1 cmtyx_text_color_1 menu_button_3">
		            <#if sasl.domainEnum.enumText=="BARS_PUBS" || sasl.domainEnum.enumText=="RESTAURANT" >
							    open menu
							  <#else>
							    open catalog
							  </#if>
						</button>
						<!--
                          <span class="business_hours">Business hours <span class="from">16.00</span>-<span class="till">02:00</span></span><span class="open_label">open now</span>
                        -->
					</div>
				</li>
			</ul>
			<!--
			 <div style="text-align:center; margin: auto auto; background-color:white; height: 120px; width: 355px;">
	          	<a href="https://www.facebook.com/dialog/oauth?client_id=630212017138999&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fapptsvc%2Frest%2Fext%2FfacebookLogin&scope=email"> <img style="margin-top: 138px;" src="themes/1/placeholder_images/facebookloginbutton.png" />
	          	</a>
	         </div>
	        -->
			<ul class="home_tabs_list">
                <li id="cmtyx_promocodes_block" class="promocodes_block">
					<div class="header cmtyx_color_1">
						<span class="title">Discounts</span> <span class="collapse_btn">&#9650;</span>
					</div>
					<#if (promoCodes)?has_content >
						<div class="body">
							<ul class="gallery event_block_overlay">
								<#list promoCodes as promoCode>
									<li class="promoCode_item" data-promoCode="${promoCode.promoCode}" >
										<div class="promocode_inner_wrapper">
											<div class="promoCode-container">
						                        <span class="promoCode_title">${promoCode.title}</span>
												<#if promoCode.imageURL??>
													<div class="promoCode_image">
														<img src="${promoCode.imageURL}"></img>
													</div>
												</#if>
												<div class="promoCode_description" data-promoCode="${promoCode.promoCode}">
					                                <div class="promoCode_expiration_date">
						                                <div class="promoCode_container"> 
						                                     Expires: ${promoCode.expirationDate?date}
						                                </div>
					                                </div>
					                               
					                                <#if promoCode.type.name()=="AMOUNT">
					                                  <div class="promoCode_details">
					                                    <span class="promoCode_currency">${promoCode.currencyCode.symbol}</span>
					                                    <span class="promoCode_discount">${promoCode.discount}</span>
					                                  </div>
					                                <#else>
					                                  <div class="promoCode_details">
					                                    <span class="promoCode_discount">${promoCode.discount}% off</span>
					                                  </div>
					                                </#if>
												</div>
											</div>
				                            <#if promoCode.applicationType.name()=="AUTO_APPLY">
					                            <div class="promoCode-buybutton-container">
			                                         <button class="promoCode-buybutton cmtyx_text_color_1 cmtyx_border_color_1" data-promoCode="${promoCode.promoCode}">
			                                           Shop</button>
					                            </div>
	                                        </#if>
										</div>

										<div class="promoCode_item_buttons">
											<div class="share_btn_block"
												data-promoCode="${promoCode.promoCode}">
												<span class="icon share_icon"></span> <span class="text">Share</span>
											</div>
										</div>

										<div class="ui-grid-c promoCode-share-block" data-promoCode="${promoCode.promoCode}">
											<div class="sms_input_block">
												<input class="phone_us sms_input" type="tel" name="sms_input" placeholder="(US mobile)" value="" size="14" maxlength="64">
												<span class="sms_send_button cmtyx_color_1 cmtyx_border_color_1">Send</span>
											</div>
											<div class="ui-block-a text sms_block">
												<a href="" class="share_sms cmtyx_text_color_1">
													<span class="share_icon sms_icon"></span>
												</a>
											</div>
											<div class="ui-block-b text email_block">
												<a href="" class="share_email cmtyx_text_color_1">
													<span class="share_icon email_icon"></span>
												</a>
											</div>
											<div class="ui-block-c text facebook_block">
												<a href="" target="_blank" class="share_facebook cmtyx_text_color_1">
													<span class="share_icon facebook_icon"></span>
												</a>
											</div>
											<div class="ui-block-d text twitter_block">
												<a href="" target="_blank" class="share_twitter cmtyx_text_color_1">
													<span class="share_icon twitter_icon"></span>
												</a>
											</div>
										</div>

									</li>
								</#list>
							</ul>
						</div>
					<#else>
						<div class="body">
							<div class="no_discounts">
								(No Discounts)
							</div>
						</div>
					</#if>
				</li>			
			
				<li id="cmtyx_events_block" class="events_block">
					<div class="header cmtyx_color_3">
						<span class="title">events</span> <span class="collapse_btn">&#9650;</span>
					</div>
					<#if (eventsSummary.events)?has_content >
						<div class="body">
							<ul class="gallery event_block_overlay">
								<#list eventsSummary.events as event>
									<li class="event_item" data-uuid="${event.uuid}">
										<div class="event-container">
					                        <span class="event_title">${event.displayText}</span>
											<#if event.url??>
												<div class="event_image">
													<img src="${event.url}"></img>
												</div>
											</#if>
											<div class="event_description" data-uuid="${event.uuid}">
												<table>
						                            <tr>
						                                <td class="event_date">
							                                <div class="event_container">
							                                    <span class="event_day">${event.date}</span>
							                                    <span class="event_month">${event.month}</span>
							                                </div>
						                                </td>
						                                <td class="event_info">
						                                    <span class="event_time">${event.time}</span>
						                                    <span class="event_text">${event.shortDescription}</span>
						                                </td>
						                                <td class="add_to_calendar_btn_container">
						                                    <a href="${event.calendarURL}"><span class="add_to_calendar_btn"></span></a>
						                                </td>
						                            </tr>
					                            </table>
											</div>
										</div>


										<#if event.buyable!false>
											<div class="ui-grid-a event_item_buttons">
												<div class="ui-block-a share_btn_block"
													uuid="${event.uuid}">
													<span class="icon share_icon"></span> <span class="text">Share</span>
												</div>
												<div class="ui-block-b "
													uuid="${event.uuid}">
					                                  <button class="events-buybutton" data-uuid="${event.uuid}">
		                                           		Buy</button>
												</div>
											</div>
										<#else>
											<div class="ui-grid-solo event_item_buttons">
												<div class="ui-block-a share_btn_block"
													uuid="${event.uuid}">
													<span class="icon share_icon"></span> <span class="text">Share</span>
												</div>
											</div>
			                            </#if>

										<div class="ui-grid-c events-share-block" data-uuid="${event.uuid}">
											<div class="sms_input_block">
												<input class="phone_us sms_input" type="tel" name="sms_input" placeholder="(US mobile)" value="" size="14" maxlength="64">
												<span class="sms_send_button cmtyx_color_1 cmtyx_border_color_1">Send</span>
											</div>
											<div class="ui-block-a text sms_block">
												<a href="" class="share_sms cmtyx_text_color_1">
													<span class="share_icon sms_icon"></span>
												</a>
											</div>
											<div class="ui-block-b text email_block">
												<a href="" class="share_email cmtyx_text_color_1">
													<span class="share_icon email_icon"></span>
												</a>
											</div>
											<div class="ui-block-c text facebook_block">
												<a href="" target="_blank" class="share_facebook cmtyx_text_color_1">
													<span class="share_icon facebook_icon"></span>
												</a>
											</div>
											<div class="ui-block-d text twitter_block">
												<a href="" target="_blank" class="share_twitter cmtyx_text_color_1">
													<span class="share_icon twitter_icon"></span>
												</a>
											</div>
										</div>

									</li>
								</#list>
							</ul>
						</div>
					<#else>
						<div class="body" style="text-align: center;">(No events
							scheduled)</div>
					</#if>
				</li>

				<li id="cmtyx_gallery_block" class="gallery_block">
					<div class="header cmtyx_color_1">
						<span class="title">gallery</span> <span class="collapse_btn">&#9650;</span>
					</div>
					<div class="body">
						<ul class="gallery">
							<#list medias as media>
							<li class="gallery_item" data-uuid="${media.uuid}">
								<div class="gallery_container">
									<span class="gallery_title gallery_item_title">${media.title}</span>
									<div class="gallery_image">
										<img src="${media.URL}"></img>
									</div>
									<div class="gallery_item_description">
										<span class="gallery_item_undertitle">${media.message}</span>
									</div>
								</div>
								<div class="gallery_item_buttons">
									<div class="share_btn_block"
										uuid="${media.uuid}">
										<span class="icon share_icon"></span> <span class="text">Share</span>
									</div>
								</div>

								<div class="ui-grid-c gallery-share-block" data-uuid="${media.uuid}">
									<div class="sms_input_block">
										<input class="phone_us sms_input" type="tel" name="sms_input" placeholder="(US mobile)" value="" size="14" maxlength="64">
										<span class="sms_send_button cmtyx_color_1 cmtyx_border_color_1">Send</span>
									</div>
									<div class="ui-block-a text sms_block">
										<a href="" class="share_sms cmtyx_text_color_1">
											<span class="share_icon sms_icon"></span>
										</a>
									</div>
									<div class="ui-block-b text email_block">
										<a href="" class="share_email cmtyx_text_color_1">
											<span class="share_icon email_icon"></span>
										</a>
									</div>
									<div class="ui-block-c text facebook_block">
										<a href="" target="_blank" class="share_facebook cmtyx_text_color_1">
											<span class="share_icon facebook_icon"></span>
										</a>
									</div>
									<div class="ui-block-d text twitter_block">
										<a href="" target="_blank" class="share_twitter cmtyx_text_color_1">
											<span class="share_icon twitter_icon"></span>
										</a>
									</div>
								</div>
							</li>
							</#list>
						</ul>
					</div>
				</li>
				<li id="cmtyx_poll_block" class="poll_block">
					<div class="header cmtyx_color_3">
						<span class="title">Poll</span> <span class="collapse_btn">&#9650;</span>
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
						                                    <div class="ui-block-a">
						                                        <img src="<%= prize.imageUrl %>"></img>
						                                    </div>
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
						                    <div class="share_btn_block"
						                        uuid="">
						                        <span class="icon share_icon"></span> <span class="text">Share</span>
						                    </div>
						                    <div class="share_block" data-uuid="${poll.contestUUID}">
						                        <div class="ui-grid-c">
						                            <div class="sms_input_block" data-uuid="${poll.contestUUID}">
						                                <input class="phone_us sms_input" type="tel" name="sms_input" placeholder="(US mobile)" value="" size="14" maxlength="64">
						                                <span class="sms_send_button cmtyx_color_1 cmtyx_border_color_1">Send</span>
						                            </div>
						                            <div class="ui-block-a text sms_block">
						                                <a href="" class="share_sms cmtyx_text_color_1">
						                                    <span class="share_icon sms_icon"></span>
						                                </a>
						                            </div>
						                            <div class="ui-block-b text email_block">
						                                <a href="" class="share_email cmtyx_text_color_1">
						                                    <span class="share_icon email_icon"></span>
						                                </a>
						                            </div>
						                            <div class="ui-block-c text facebook_block">
						                                <a href="" target="_blank" class="share_facebook cmtyx_text_color_1">
						                                    <span class="share_icon facebook_icon"></span>
						                                </a>
						                            </div>
						                            <div class="ui-block-d text twitter_block">
						                                <a href="" target="_blank" class="share_twitter cmtyx_text_color_1">
						                                    <span class="share_icon twitter_icon"></span>
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
				<!--
				<li id="cmtyx_about_us_block" class="about_us_block">
					<div class="header cmtyx_color_2">
						<span class="title">about us</span>
						<div class="collapse_btn">&#9650;</div>
					</div>
					<div class="body">
						<div class="text">${(sasl.detailedDescription)!"(no detailedDescription)"}</div>
					</div>
				</li>
				-->
				<li id="cmtyx_loyalty_program_block" class="loyalty_program_block">
				</li>
				<li id="cmtyx_reviews_block" class="reviews_block">
					<div class="header cmtyx_color_2">
						<span class="title">reviews</span> <span
							class="collapse_btn">&#9650;</span>
					</div>
					<div class="body">
						<div class="review">
							<table>
								<tr>
									<td class="user_avatar"></td>
									<td class="review_section">
										<div class="ui-grid-a name_date_block">
											<div class="ui-block-a user_name">[Sample user]</div>
											<div class="ui-block-b date">Aug, 24, 2016</div>
										</div>
										<div class="rating_block">
											<div class="review-rating" initial-rating="9"></div>
											<div class="rating_number">
												<span class="review_current_rating"></span><span>/5</span>
											</div>
										</div>
						                   <div class="text">(This is a sample review)</div>
									</td>
								</tr>
							</table>
						</div>
						<div class="show_more_block_container">
							<div class="show_more_block">
								<div class="show_more_avatars_container">
									<span class="avatar avatar1"></span> <span
										class="avatar avatar2"></span> <span class="avatar avatar3"></span>
									<span class="avatar avatar4"></span> <span
										class="avatar avatar5"></span>
								</div>
								<span class="show_more_reviews_btn cmtyx_text_color_1">Show
									more reviews</span>
							</div>
						</div>
						<button class="ui-btn ui-corner-all add_review_btn cmtyx_border_color_1 cmtyx_text_color_1">ADD A REVIEW</button>
						<div class="leave_review_block">
							<span class="title">
								leave a review
							</span>
							<div class="rating_block">
								<div class="my-rating"></div>
								<div class="rating_number">
									<span class="current_rating"></span><span>/5</span>
								</div>
							</div>
							<input type="text" id="full_name" name="full_name" data-role="none" placeholder="Full name">
							<textarea id="review_text" name="review_text" data-role="none" rows="3" placeholder="Your review"></textarea>
							<div class="message_error new_review_error">Type your message</div>
							<div class="add_new_block">
			                    <button class="ui-btn ui-corner-all back_btn add_new_photo_btn cmtyx_border_color_1 cmtyx_text_color_1">ADD A PHOTO</button>
			                </div>
			                <div class="upload_photo">
			                    <div class="dropzone" data-width="320" data-height="568" style="width: 100%;">
			                        <input type="file" data-role="none" name="thumb" />
			                    </div>
			                </div>
			                <div class="add_review_btns_block ui-grid-a">
			                     <div class="ui-block-a p-r-10">
			                        <button class="back_btn cancel_review cmtyx_border_color_1 cmtyx_text_color_1">Cancel</button>
			                     </div>
			                     <div class="ui-block-b p-l-10">
			                         <button class="next_btn send_review cmtyx_border_color_1 cmtyx_color_1">Submit</button>
			                     </div>
			                 </div>
						</div>
					</div>
				</li>
				<li id="cmtyx_promotion_block" class="promotion_block">
					<div class="header cmtyx_color_3">
    					<div id="flag"><span>sale</span></div>
						<span class="title">Promotion</span> <span class="collapse_btn">&#9650;</span>
					</div>
					<div class="body">
						<ul>
							<#list promotions as promotion>
							<li class="promotions-item" data-uuid="${promotion.uuid}">
								<div class="promotion_item">
									<div class="promotion_type">
										${promotion.promoType.displayText}</div>
									<img src="${promotion.URL}"></img>
									<div class="promotion_details_container">
										<div class="promotion_title">${promotion.title}</div>


	                                    <#if promotion.buyable!false>
		                                  <div class="promotions-originalprice" >
		                                   Regular price: <span>$${promotion.originalPrice}</span></div>
	                                    </#if>

	                                    <#if promotion.buyable!false>
		                                  <div class="promotions-promoprice">
		                                   Special price: <span class="cmtyx_text_color_1">$${promotion.promoPrice}</span></div>
	                                    </#if>

										<div class="promotion_description">${promotion.message}</div>

									</div>
									<#if promotion.buyable!false>
									<div class="ui-grid-a promotion_item_buttons">
										<div class="ui-block-a share_btn_block"
											uuid="${promotion.uuid}">
											<span class="icon share_icon"></span> <span class="text">Share</span>
										</div>
										<div class="ui-block-b "
											uuid="${promotion.uuid}">
			                                  <button class="promotions-buybutton cmtyx_text_color_1 cmtyx_border_color_1" data-uuid="${promotion.uuid}">
			                                   Buy</button>
										</div>
									</div>
									<#else>
									<div class="ui-grid-solo promotion_item_buttons">
										<div class="ui-block-a share_btn_block"
											uuid="${promotion.uuid}">
											<span class="icon share_icon"></span> <span class="text">Share</span>
										</div>
									</div>
		                            </#if>
										
								</div>
								<div class="ui-grid-c promotion-share-block" data-uuid="${promotion.uuid}">
									<div class="sms_input_block">
										<input class="phone_us sms_input" type="tel" name="sms_input" placeholder="(US mobile)" value="" size="14" maxlength="64">
										<span class="sms_send_button cmtyx_color_1 cmtyx_border_color_1">Send</span>
									</div>
									<div class="ui-block-a text sms_block">
										<a href="" class="share_sms cmtyx_text_color_1">
											<span class="share_icon sms_icon"></span>
										</a>
									</div>
									<div class="ui-block-b text email_block">
										<a href="" class="share_email cmtyx_text_color_1">
											<span class="share_icon email_icon"></span>
										</a>
									</div>
									<div class="ui-block-c text facebook_block">
										<a href="" target="_blank" class="share_facebook cmtyx_text_color_1">
											<span class="share_icon facebook_icon"></span>
										</a>
									</div>
									<div class="ui-block-d text twitter_block">
										<a href="" target="_blank" class="share_twitter cmtyx_text_color_1">
											<span class="share_icon twitter_icon"></span>
										</a>
									</div>
								</div>
							</li> </#list>
						</ul>
					</div>
				</li>
				<li id="cmtyx_photo_contest_block" class="photo_contest_block">
					<div class="header cmtyx_color_4">
						<span class="title">Photo contest</span> <span
							class="collapse_btn">&#9650;</span>
					</div>
					<div class="body">
						<img src="themes/1/placeholder_images/special.png"></img> <span
							class="contest_task">Send us a picture of your dog,
							running!</span>
						<button
							class="ui-btn ui-corner-all back_btn send_photo_btn cmtyx_border_color_1 cmtyx_text_color_1">SEND
							A PHOTO</button>
						<div class="prizes_title">All submissions are entered into
							our mini-sweepstake!</div>
						<ul>
							<li>
								<div class="prize_block">
									<div class="ui-grid-a prize_container">
										<div class="ui-block-a">
											<div class="prize_text_block">
												<span class="prize_text">prize</span> <span
													class="prize_condition">every second burger</span> <span
													class="prize_date">till 30.07</span>
											</div>
										</div>
										<div class="ui-block-b ">
											<img src="themes/1/placeholder_images/burger.png"></img>
										</div>
									</div>
								</div>
							</li>
							<li>
								<div class="prize_block">
									<div class="ui-grid-a prize_container">
										<div class="ui-block-a">
											<div class="prize_text_block">
												<span class="prize_text">prize</span> <span
													class="prize_condition">every second coffee</span> <span
													class="prize_date">till 30.07</span>
											</div>
										</div>
										<div class="ui-block-b ">
											<img src="themes/1/placeholder_images/burger.png"></img>
										</div>
									</div>
								</div>
							</li>
							<li class="last">
								<div class="prize_block">
									<div class="ui-grid-a prize_container">
										<div class="ui-block-a">
											<div class="prize_text_block">
												<span class="prize_text">prize</span> <span
													class="prize_condition">every second salad</span> <span
													class="prize_date">till 30.07</span>
											</div>
										</div>
										<div class="ui-block-b ">
											<img src="themes/1/placeholder_images/burger.png"></img>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</li>
				<li id="cmtyx_video_block" class="video_block">
					<div class="header cmtyx_color_1">
						<span class="title">video</span> <span class="collapse_btn">&#9650;</span>
					</div>
				    <div class="body last">
				    <#if (externalMedia)?has_content >
		            <ul>
				      <#list externalMedia as media>
				          <li>
			          		<span class="video_title">${media.title}</span>
	 						<#if videoNeedsPlaceholder>
			                    <div id="externalvideo${media.idMedia}" class="embedded_videos external" idmedia="${media.idMedia}" idVideo="${media.vid}" srcmedia="https://www.youtube.com/embed/${media.vid}?playsinline=1" style="background: #000 url(&quot;${media.thumbnailURL}&quot;)  no-repeat center center;">
			                      <a href="#">
			                        <img src="themes/1/css/images/play.png" alt="Play" srcmedia="https://www.youtube.com/embed/${media.vid}?playsinline=1">
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
					  <#else>
					  <div style="text-align:center;">
						  (No videos available)
					  </div>
					  </#if>

					</div>

				</li>
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
				<li id="cmtyx_share_block" class="share_block"><span
					class="title"> Share this site </span>
					<div class="ui-grid-c">
						<div class="sms_input_block">
							<input class="phone_us sms_input" type="tel" name="sms_input" placeholder="(US mobile)" value="" size="14" maxlength="64">
							<span class="sms_send_button cmtyx_color_1 cmtyx_border_color_1">Send</span>
						</div>
						<div class="ui-block-a text sms_block">
							<a href="" class="share_sms cmtyx_text_color_1">
								<span class="share_icon sms_icon"></span>
							</a>
						</div>
						<div class="ui-block-b text email_block">
							<a href="" class="share_email cmtyx_text_color_1">
								<span class="share_icon email_icon"></span>
							</a>
						</div>
						<div class="ui-block-c text facebook_block">
							<a href="" target="_blank" class="share_facebook cmtyx_text_color_1">
								<span class="share_icon facebook_icon"></span>
							</a>
						</div>
						<div class="ui-block-d text twitter_block">
							<a href="" target="_blank" class="share_twitter cmtyx_text_color_1">
								<span class="share_icon twitter_icon"></span>
							</a>
						</div>
					</div>
				</li>
				<li class="map_in_landing">
					<div id="home_map" class="map_container"></div>
				</li>
			</ul>
		</div>
	</div>
	<!--    CONTACT US-->

	<div id="cmtyx_contact_us_block" data-role="page"
		class="contact_us_block">
		<div class="header">
			<span class="back_arr_icon"></span> <span class="title">Contact
				us</span>
		</div>
		<div class="body">
			<div class="title">keep in touch</div>
			<div class="undertitle">Do you have some questions? Feel free
				to write us!</div>
			<div class="input_container">
				<div class="material-textfield yellow">
					<input type="text" required data-role="none" /> <label
						data-content="Name">Name</label>
				</div>
				<div class="material-textfield yellow">
					<input type="text" required data-role="none" /> <label
						data-content="Email">Email</label>
				</div>
				<div class="material-textfield yellow">
					<textarea required data-role="none" rows="3"></textarea>
					<label data-content="Message">City</label>
				</div>
			</div>
			<div class="ui-grid-a back_next_btns">
				<button
					class="ui-btn ui-corner-all back_btn send_btn cmtyx_border_color_1 cmtyx_text_color_1">send</button>
			</div>
		</div>
	</div>

	<!--    BUSINESS HOURS-->

	<div id="cmtyx_business_hours" data-role="page">
		<div class="header">
			<span class="back_arr_icon"></span> <span class="title">Business
				hours</span>
		</div>
		<div class="body">
			<table>
				<tr>
					<td class="day cmtyx_text_color_1">sun</td>
					<td>Closed</td>
				</tr>
				<tr>
					<td class="day cmtyx_text_color_1">mon</td>
					<td>09 - 22</td>
				</tr>
				<tr>
					<td class="day cmtyx_text_color_1">tue</td>
					<td>09 - 22</td>
				</tr>
				<tr>
					<td class="day cmtyx_text_color_1">wed</td>
					<td>09 - 22</td>
				</tr>
				<tr>
					<td class="day cmtyx_text_color_1">thu</td>
					<td>09 - 22</td>
				</tr>
				<tr>
					<td class="day cmtyx_text_color_1">fri</td>
					<td>09 - 22</td>
				</tr>
				<tr>
					<td class="day cmtyx_text_color_1">sat</td>
					<td>09 - 22</td>
				</tr>
			</table>
		</div>
	</div>


	<!--    CHAT-->

	<div id="cmtyx_chat_block" class="chat_block" data-role="page">
		<div class="header">
			<span class="back_arr_icon"></span> <span class="title">Chat</span>
		</div>
		<div class="body">
			<div class="date">Aug, 24, 2016</div>
			<ul>
				<li class="friend_message">
					<table>
						<tr>
							<td class="time">15:35</td>
							<td class="message">
								<div class="message_text">We are passionate about coffee.
									Our founder has a PhD in Coffiology, from the Columbian
									Beverage Science Academy.</div>
							</td>
						</tr>
					</table>
				</li>
				<li class="my_message">
					<table>
						<tr>
							<td class="message">
								<div class="message_text">We are passionate about coffee.
									Our founder has a PhD in Coffiology, from the Columbian
									Beverage Science Academy.</div>
							</td>
							<td class="time">15:35</td>
						</tr>
					</table>
				</li>
			</ul>
			<div class="footer_panel">
				<span class="smile_icon"></span> <span class="send_message_icon"></span>
			</div>
		</div>
	</div>

	<!--    USER REVIEWS-->

	<div id="cmtyx_user_reviews" data-role="page">
		<div class="header">
			<span class="back_arr_icon"></span> <span class="title">User
				Reviews</span>
		</div>
		<div class="body">
			<ul class="reviews_block">
				<li class="review">
					<table>
						<tr>
							<td class="user_avatar"></td>
							<td class="review_section">
								<div class="name_date_block">
									<span class="user_name">[Sample user]</span><span class="date">Aug,
										24, 2016</span>
								</div>
								<div class="rating_block">
									<div class="my-rating"></div>
									<div class="rating_number">
										<span class="current_rating"></span><span>/5</span>
									</div>
									<script>

									</script>
								</div>
								<div class="text">[Sample review]</div>
							</td>
						</tr>
					</table>
				</li>
				<li class="review">
					<table>
						<tr>
							<td class="user_avatar user_avatar2"></td>
							<td class="review_section">
								<div class="name_date_block">
									<span class="user_name">John Johnson</span><span class="date">Aug,
										24, 2016</span>
								</div>
								<div class="rating_block">
									<div class="my-rating"></div>
									<div class="rating_number">
										<span class="current_rating"></span><span>/5</span>
									</div>
									<script>

									</script>
								</div>
								<div class="text">We are passionate about coffee. Our
									founder has a PhD in Coffiology, from the Columbian Beverage
									Science Academy.</div>
							</td>
						</tr>
					</table>
				</li>
				<li class="review">
					<table>
						<tr>
							<td class="user_avatar user_avatar3"></td>
							<td class="review_section">
								<div class="name_date_block">
									<span class="user_name">Jessica Parker</span><span class="date">Aug,
										24, 2016</span>
								</div>
								<div class="rating_block">
									<div class="my-rating"></div>
									<div class="rating_number">
										<span class="current_rating"></span><span>/5</span>
									</div>
									<script>

									</script>
								</div>
								<div class="text">We are passionate about coffee. Our
									founder has a PhD in Coffiology, from the Columbian Beverage
									Science Academy.</div>
							</td>
						</tr>
					</table>
				</li>
				<li class="review">
					<table>
						<tr>
							<td class="user_avatar user_avatar4"></td>
							<td class="review_section">
								<div class="name_date_block">
									<span class="user_name">Jane Smith</span><span class="date">Aug,
										24, 2016</span>
								</div>
								<div class="rating_block">
									<div class="my-rating"></div>
									<div class="rating_number">
										<span class="current_rating"></span><span>/5</span>
									</div>
									<script>

									</script>
								</div>
								<div class="text">We are passionate about coffee. Our
									founder has a PhD in Coffiology, from the Columbian Beverage
									Science Academy.</div>
							</td>
						</tr>
					</table>
				</li>
				<li class="review">
					<table>
						<tr>
							<td class="user_avatar"></td>
							<td class="review_section">
								<div class="name_date_block">
									<span class="user_name">Jacob Holiday</span><span class="date">Aug,
										24, 2016</span>
								</div>
								<div class="rating_block">
									<div class="my-rating"></div>
									<div class="rating_number">
										<span class="current_rating"></span><span>/5</span>
									</div>
									<script>

									</script>
								</div>
								<div class="text">We are passionate about coffee. Our
									founder has a PhD in Coffiology, from the Columbian Beverage
									Science Academy.</div>
							</td>
						</tr>
					</table>
				</li>
			</ul>
		</div>
	</div>

	<!--    APPOINTMENTS-->

	<div id="cmtyx_appointments" data-role="page">
		<div class="header">
			<span class="back_arr_icon"></span> <span class="title">Appointments</span>
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
	</div>

	<!--    UPLOAD PHOTO-->

	<div id="upload_photo" data-role="page">
		<div class="header">
			<span class="back_arr_icon"></span> <span class="title">Upload
				photo</span>
		</div>
		<div class="body">
			<select data-role="none" class="select">
				<option value="select_type">Select a type</option>
				<option value="animals">Animals</option>
				<option value="food">Food</option>
			</select>
			<div class="title_input_container">
				<label data-content="Title">Title</label> <input type="text"
					required data-role="none" />
			</div>
			<div class="select_picture_container">
				<label data-content="Title">Select a picture</label>
				<div class="select_picture_gallery">
					<img src="themes/1/placeholder_images/pexels-photo-59523.png"
						alt=""> <img
						src="themes/1/placeholder_images/6359862041401967861409225263_coffee.png"
						alt=""> <img src="themes/1/placeholder_images/burger.png"
						alt=""> <img src="themes/1/placeholder_images/special.png"
						alt=""> <img
						src="themes/1/placeholder_images/Salad_platter.png" alt="">
				</div>
				<div class="btn_container">
					or
					<button
						class="ui-btn ui-corner-all back_btn add_new_btn cmtyx_border_color_1 cmtyx_text_color_1">Add
						new</button>
				</div>
			</div>
			<div class="description_input_container">
				<label data-content="Title">Description</label>
				<textarea type="text" required data-role="none" rows="4"></textarea>
			</div>
			<div class="ui-grid-a back_next_btns">
				<div class="ui-block-a p-r-10">
					<button
						class="ui-btn ui-corner-all back_btn cancel_btn cmtyx_text_color_1 cmtyx_border_color_1">Cancel</button>
				</div>
				<div class="ui-block-b p-l-10">
					<button
						class="ui-btn ui-corner-all next_btn save_btn cmtyx_color_1 cmtyx_border_color_1">Save</button>
				</div>
			</div>
		</div>
	</div>

	<script src="build/bundle.js"></script>


	<!--
	<#if (externalMedia)?has_content >
 	  <#list externalMedia as media>
	    <script>$( document ).ready(function() {
          $('.embedded_videos').on('click', function () {
          var vid=$(this).attr("idVideo");
          console.log(vid);
          $(this).html('<iframe width="320"height="240" src="https://www.youtube.com/embed/'+vid+'?playsinline=1" frameborder="0"allowfullscreen></iframe>').css('background','none');});});
        </script>
      </#list>
    </#if>
    -->
	<!--
	<script>
     window.fbAsyncInit = function() {
       FB.init({
         appId      : 'your-app-id',
         xfbml      : true,
         version    : 'v2.7'
       });
     };

     (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
   </script>
   -->
</body>
