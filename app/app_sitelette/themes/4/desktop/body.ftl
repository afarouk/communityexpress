<body>
  <audio id="addtocart" src="themes/4/tempSound/addToCart.wav" autostart="false" ></audio>
  <audio id="removefromcart" src="themes/4/tempSound/removeFromCart.wav" autostart="false" ></audio>

    <div id="cmtyx_desktop_application" class="cmtyx_desktop_application">
        
        <header class="cmtyx_special_background_color">
            <div id="back-btn-container" class="back-btn-container"></div>
            <div class="logo-container cmtyx_special_background_color">
                <img class="logo" src="${bannerImageURL}" alt="logo">
            </div>
            
            <div id="cmtyx_share_block" class="cmtyx_share_block share_container">
              <div class="share-block">
                <div class="sms_input_block">
                  <input class="phone_us sms_input" type="tel" name="sms_input" placeholder="(US mobile)" value="" size="14" maxlength="64">
                  <button class="sms_send_button cmtyx_color_1 cmtyx_border_color_1">Send</button>
                </div>
                <div class="icons-container-wrapper">
                    <div class="icons-container">
                        <div class="text sms_block">
                            <a href="" name="share_sms" class="share_sms">
                                <i class="fa fa-mobile cmtyx_share_icon_color" aria-hidden="true"></i>
                            </a>
                        </div>
                        <div class="text email_block">
                            <a href="" name="share_email" class="share_email">
                                <i class="fa fa-envelope cmtyx_share_icon_color" aria-hidden="true"></i>
                            </a>
                        </div>
                        <div class="text facebook_block">
                            <a name="share_facebook" href="" target="_blank" class="share_facebook">
                                <i class="fa fa-facebook cmtyx_share_icon_color" aria-hidden="true"></i>
                            </a>
                        </div>
                        <div class="text twitter_block">
                            <a name="share_twitter" href="" target="_blank" class="share_twitter">
                                <i class="fa fa-twitter cmtyx_share_icon_color" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                </div>
              </div>
            </div>

            <div class="links-container">
                <div id="login-container" class="link"></div> 
            </div>
        </header>

        <div id="cmtyx_landingView">
          <#if notification??>
            <div class="breaking_news">
              <span class="news_line">${notification.notificationBody}</span>
            </div>
          <#elseif (promoCodes)?has_content>
            <div id="subheader-discount" class="subheader-discount" data-promoCode="${promoCodes[0].promoCode}" data-uuid="${promoCodes[0].discountUUID}">
              <span class="discount-title">${promoCodes[0].title}</span>
              <button type="button" class="subheader-discount-button">Apply discount</button>
            </div>
          </#if>

          

          <div class="grid-container cmtyx_desktop_application">
              <div class="cssload-thecube">
                  <div class="cssload-cube cssload-c1"></div>
                  <div class="cssload-cube cssload-c2"></div>
                  <div class="cssload-cube cssload-c4"></div>
                  <div class="cssload-cube cssload-c3"></div>
              </div>

              <div class="grid home_tabs_list">

                <!-- <div class="grid-sizer"></div> -->
                <!-- <div class="gutter-sizer"></div> -->
                <div class="left-block">
                  <!-- there is catalogs block -->
                  <div id="catalogs-layout" class="grid-item cmtyx_menu_block"></div>

                  

                  <!-- <#if (promotions)?has_content >
                    <div class="grid-item cmtyx_promotion_block">
                        <div class="header cmtyx_color_3">
                            <div class="title">promotion <span class="collapse_btn"></span></div>
                        </div>
                        <div class="body">
                          <ul>
                            <#list promotions as promotion>
                              <li class="promotions-item" data-uuid="${promotion.uuid}">
                                  <div class="promotion-container">
                                      <img src="themes/4/desktop/images/dog.png" alt="promotion image" class="promotion-image">
                                      <div class="promotion-btns">
                                          <div class="left-block">
                                            <span><img src="themes/4/desktop/images/like-icon.png" alt="like icon">Like</span>
                                          </div>
                                          <div class="right-block">
                                            <span><img src="themes/4/desktop/images/share-icon.png" alt="share icon">Share</span>
                                          </div>
                                      </div>
                                  </div>
                              </li>
                          </#list>
                            </ul>
                        </div>
                    </div>
                  </#if> -->

                  <!-- <div class="grid-item cmtyx_promocodes_block">
                      <div class="header cmtyx_color_4">
                          <div class="title">discount <span class="collapse_btn"></span></div>
                      </div>
                      <div class="body">
                          <div class="discount-item-container">
                              <img src="themes/4/desktop/images/burger.png" alt="discount image">
                              <div class="discount-item-info">
                                  <div class="discount-item-title">Discount</div>
                                  <div class="discount-item-text">every second burger</div>
                                  <div class="discount-item-date">till 30.07</div>
                              </div>
                          </div>
                      </div>
                  </div> -->
                  
                  <div class="wrapper">

                    <!----- Discount coupons  ---------------->
                
                    <div id="cmtyx_promocodes_block" class="grid-item cmtyx_promocodes_block">
                      <div class="header cmtyx_color_4">
                        <span class="title">Discounts</span> 
                        <span class="tag_icon"></span>
                      </div>
                      <#if (promoCodes)?has_content >
                        <div class="body">
                          <div class="owl-carousel discount-item-container">
                            <#list promoCodes as promoCode>
                              <div class="slide promoCode_item" data-promoCode="${promoCode.promoCode}" data-uuid="${promoCode.discountUUID}">
                                <div class="promocode_inner_wrapper">
                                  <div class="promoCode-container">
                                    <#if promoCode.imageURL??>
                                      <div class="promoCode_image">
                                        <img data-uuid="${promoCode.discountUUID}" src="${promoCode.imageURL}"></img>
                                      </div>
                                    </#if>
                                  </div>
                                  <#if promoCode.applicationType.name()=="AUTO_APPLY">
                                    <div class="promoCode-buybutton-container">
                                      <button class="promoCode-buybutton cmtyx_text_color_1 cmtyx_border_color_1"
                                      data-uuid="${promoCode.discountUUID}" data-promoCode="${promoCode.promoCode}">
                                      Shop</button>
                                    </div>
                                  </#if>
                                </div>

                                <div class="share_container">
                                  <div class="promoCode_item_buttons item_buttons">
                                    <div class="share_btn_block cmtyx_share_icon_color" data-promoCode="${promoCode.promoCode}" >
                                        <i class="fa fa-share" aria-hidden="true"></i> <span class="text">Share</span>
                                    </div>
                                  </div>

                                  <div class="promoCode-share-block share-block" data-promoCode="${promoCode.promoCode}" data-uuid="${promoCode.discountUUID}" >
                                    <div class="sms_input_block">
                                        <input class="phone_us sms_input" type="tel" name="sms_input" placeholder="(US mobile)" value="" size="14" maxlength="64">
                                        <button class="sms_send_button cmtyx_color_1 cmtyx_border_color_1">Send</button>
                                    </div>
                                    <div class="icons-container-wrapper">
                                      <div class="icons-container">
                                        <div class="text sms_block">
                                            <a href="" name="share_sms" class="share_sms cmtyx_text_color_1">
                                                <i class="fa fa-mobile" aria-hidden="true"></i>
                                            </a>
                                        </div>
                                        <div class="text email_block">
                                            <a href="" name="share_email" class="share_email cmtyx_text_color_1">
                                                <i class="fa fa-envelope" aria-hidden="true"></i>
                                            </a>
                                        </div>
                                        <div class="text facebook_block">
                                            <a name="share_facebook" href="" target="_blank" class="share_facebook cmtyx_text_color_1">
                                                <i class="fa fa-facebook" aria-hidden="true"></i>
                                            </a>
                                        </div>
                                        <div class="text twitter_block">
                                            <a name="share_twitter" href="" target="_blank" class="share_twitter cmtyx_text_color_1">
                                                <i class="fa fa-twitter" aria-hidden="true"></i>
                                            </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </#list>
                          </div>
                        </div>
                        <div class="discount-used">
                          <div class="attention-sign">
                            <i class="fa fa-check" aria-hidden="true"></i>
                            <span>Discount will be applied on order summary screen</span>
                          </div>
                        </div>
                      <#else>
                        <div class="body">
                          <div class="no_discounts">
                            (No Discounts)
                          </div>
                        </div>
                      </#if>
                    </div>
                  
                    <!----- End of Discount coupons  ---------------->

                    <!-- there is welcome block -->
                    <div class="grid-item cmtyx_welcome_block">
                      <div class="body">
                        <#if (medias)?has_content >
                          <img src="${medias[0].URL}" />
                        <#else>
                          <img src="themes/4/placeholder_images/welocome_img.png"></img>
                        </#if>
                        <div class="text-container">
                          <#if (medias)?has_content >
                            <#if (medias[0]??) >
                              <div class="title">${medias[0].title}</div>
                              <div class="undertitle">${medias[0].message}</div>
                            <#else>
                              <div class="title">(no title)</div>
                              <div class="undertitle">(no message) </div>
                            </#if>
                          </#if>
                          
                          <!-- <span class="open_label">we are open</span>    
                          <div class="business_hours">Business hours <span class="from">16.00</span>-<span class="till">02:00</span></div> -->
                        </div>
                      </div>
                    </div>

                    <!----- End of welcome block  ---------------->

                    <!----- Promotions  ---------------->
                    <div id="cmtyx_promotion_block" class="grid-item cmtyx_promotion_block">
                      <div class="header cmtyx_color_3">
                        <span class="title">Promotion</span>
                      </div>
                      <#if (promotions)?has_content >
                      <div class="body">
                        <div class="owl-carousel promotion-container">
                          <#list promotions as promotion>
                            <div class="slide promotions-item" data-uuid="${promotion.uuid}">
                              <div class="promotion_item">
                                <div class="promotion_type">
                                  <div class="promotion_title">${promotion.title}</div>
                                </div>
                                <#if !promotion.buyable>
                                <div class="promotion_item_container_wrapper">
                                  <div class="ui-grid-a promotion_item_container">
                                    <div class="ui-block-a">
                                      <img src="${promotion.URL}"></img>
                                    </div>
                                    <div class="ui-block-b">
                                      <div class="promotion_details_container">
                                        <#if promotion.buyable!false>
                                        <div class="promotions-originalprice" >
                                         <span>$${promotion.originalPrice}</span></div>
                                        <div class="promotions-promoprice">
                                         <span class="cmtyx_text_color_1">$${promotion.promoPrice}</span>
                                         </div>
                                        </#if>

                                        <div class="promotion_description">${promotion.message}</div> 
                                          <#if promotion.buyable!false>
                                            <div class="promotions_buybutton_container" uuid="${promotion.uuid}">
                                              <button class="promotions-buybutton cmtyx_color_1 cmtyx_border_color_1" data-price="$${promotion.promoPrice}" data-uuid="${promotion.uuid}">
                                               Buy</button>
                                            </div>
                                          </#if>
                                      </div>      
                                    </div>
                                  </div>
                                </div>
                                <#else>
                                <div class="promotion_item_container_wrapper">
                                  <div class="promotion_item_container">
                                    <div class="promoCode_image " >
                                      <img src="${promotion.URL}" class="promotions-buybutton" data-price="$${promotion.promoPrice}" data-uuid="${promotion.uuid}"></img>
                                    </div> 
                                  </div>
                                  <#if promotion.buyable!false>
                                    <div class="promotions_buybutton_container" uuid="${promotion.uuid}">
                                      <button class="promotions-buybutton cmtyx_color_1 cmtyx_border_color_1" data-price="$${promotion.promoPrice}" data-uuid="${promotion.uuid}">
                                       Buy</button>
                                    </div>
                                  </#if>
                                </div>
                                </#if>

                                <div class="share_container">
                                  <div class="promotion_item_buttons item_buttons">
                                    <div class="share_btn_block cmtyx_share_icon_color"
                                      uuid="${promotion.uuid}">
                                      <i class="fa fa-share" aria-hidden="true"></i> <span class="text">Share</span>
                                    </div>
                                  </div>
                                  <div class="promotion-share-block share-block" data-uuid="${promotion.uuid}">
                                    <div class="sms_input_block">
                                      <input class="phone_us sms_input" type="tel" name="sms_input" placeholder="(US mobile)" value="" size="14" maxlength="64">
                                      <button class="sms_send_button cmtyx_color_1 cmtyx_border_color_1">Send</button>
                                    </div>
                                    <div class="icons-container-wrapper">
                                      <div class="icons-container">
                                        <div class="text sms_block">
                                            <a href="" name="share_sms" class="share_sms cmtyx_text_color_1">
                                                <i class="fa fa-mobile" aria-hidden="true"></i>
                                            </a>
                                        </div>
                                        <div class="text email_block">
                                            <a href="" name="share_email" class="share_email cmtyx_text_color_1">
                                                <i class="fa fa-envelope" aria-hidden="true"></i>
                                            </a>
                                        </div>
                                        <div class="text facebook_block">
                                            <a name="share_facebook" href="" target="_blank" class="share_facebook cmtyx_text_color_1">
                                                <i class="fa fa-facebook" aria-hidden="true"></i>
                                            </a>
                                        </div>
                                        <div class="text twitter_block">
                                            <a name="share_twitter" href="" target="_blank" class="share_twitter cmtyx_text_color_1">
                                                <i class="fa fa-twitter" aria-hidden="true"></i>
                                            </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div> 
                          </#list>
                        </div>
                      </div>
                      <div class="promo-used">
                        <div class="attention-sign">
                          <i class="fa fa-check" aria-hidden="true"></i>
                          <span>Promotion code applied, Please proceed to order</span>
                        </div>
                      </div>
                      <#else>
                        <div class="body">
                          <div class="no_promotions">
                            (No Promotions)
                          </div>
                        </div>
                      </#if>
                    </div>
                  <!----- End of Promotions  ---------------->

                  <!----- Loyalty Program  ---------------->
                    <div id="cmtyx_loyalty_program_block" class="grid-item cmtyx_loyalty_program_block"></div>
                  <!----- End of Loyalty Program  ---------------->

                  <!-- ................................... -->
                  <!-- POLL CONTESTS -->
                  <div id="cmtyx_poll_block" class="grid-item grid-item--height3 cmtyx_poll_block">
                      <div class="header cmtyx_color_3">
                          <div class="title">Poll</div>
                      </div>
                      <div class="body">
                          <img src="themes/5/desktop/images/coffee.png" alt="poll image">
                          <span class="question">Our coffee is awesome</span>
                          <form class="question_ans_form">
                              <input type="radio" name="radio-choice-ans" id="a_ans" class="ansRadioChoice" checked='checked'>
                              <label for="a_ans">YES <span class="answer_color_container answer_color_1"></span></label>
                              <br><br>
                              <input type="radio" name="radio-choice-ans" id="b_ans" class="ansRadioChoice"> 
                              <label for="b_ans">NO <span class="answer_color_container answer_color_2"></span></label>
                          </form>
                      </div>
                  </div>

                  <!----- Selfie Contest (Photo contest)  ---------------->       
                  <div id="cmtyx_photo_contest_block" class="grid-item grid-item--height3 photo_contest_block">
                    <div class="header cmtyx_color_4">
                      <div class="title">Upload photo</div>
                    </div>
                    <div class="body">
                      <ul class="photo_gallery">
                        <#list photocontests as photo>
                          <li class="photo_item" data-uuid="${photo.contestUUID}">
                              <div class="contest_container">
                                <div class="photo_block_title" style="display:  none;"><p>&nbsp</p></div>
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
                  </div>
                  <!----- End of Selfie Contest (Photo contest)  ---------------->

                  <!----- Videos  ---------------->   
                  <#if (externalMedia)?has_content >
                    <div id="cmtyx_video_block" class="grid-item grid-item--height3 video_block">
                      <div class="header cmtyx_color_1">
                        <div class="title">Videos</div>
                      </div>
                      <div class="body last">
                        <div class="owl-carousel video-container">
                          <#list externalMedia as media>
                            <div class="slide videos-item">
                              <div class="video_item">
                                <div class="video_type">
                                  <div class="video_title">${media.title}</div>
                                </div>

                                <div class="video_item_container_wrapper">
                                  <div class="ui-grid-a video_item_container">
                                    <div class="ui-block-a">
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
                                          <iframe width="100%" height="250" src="https://www.youtube.com/embed/${media.vid}?playsinline=1"frameborder="0" allowfullscreen="1"></iframe>
                                          <br>
                                          <div class="video_item_message">
                                            <span>${media.message}</span>
                                          </div>
                                        </div>
                                      </#if>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </#list>
                        </div>
                      </div>
                    </div>
                  </#if>
                  <!----- End of Videos  ---------------->
                  <!-- ................................... -->

                  <!-- events -->
                    <#if (eventsSummary.events)?has_content >
                      <!-- <div class="grid-item grid-item--height3 cmtyx_events_block">
                          <div class="header cmtyx_color_1">
                              <div class="title">events <span class="collapse_btn"></span></div>
                          </div>
                          <div class="body">
                              <img src="themes/4/desktop/images/red-hot-band.png" alt="event image">
                                <table>
                                    <tr>
                                        <td class="event_date first">
                                            <span class="event_day">28</span>
                                            <span class="event_month">jun</span>
                                        </td>
                                        <td class="event_info first">
                                            <span class="event_title">Live acoustic concert</span>
                                            <span class="event_time">21:00-00:00</span>
                                            <span class="event_text">The sound of a live drum will put the rhythm back in your soul. Playing tonight.</span>
                                        </td>
                                        <td class="add_to_calendar_btn_container first">
                                            <img src="themes/4/desktop/images/280-Appointment_calendar_date_month_planner_reminder_schedule_add_plus-256.png" alt="calendar icon" class="add_to_calendar_btn">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="event_date">
                                            <span class="event_day">29</span>
                                            <span class="event_month">jun</span>
                                        </td>
                                        <td class="event_info">
                                            <span class="event_title">Live acoustic concert</span>
                                            <span class="event_time">21:00-00:00</span>
                                            <span class="event_text">The sound of a live drum will put the rhythm back in your soul. Playing tonight.</span>
                                        </td>
                                        <td class="add_to_calendar_btn_container">
                                            <img src="themes/4/desktop/images/280-Appointment_calendar_date_month_planner_reminder_schedule_add_plus-256.png" alt="calendar icon" class="add_to_calendar_btn">
                                        </td>
                                    </tr>
                                    <tr class="last">
                                        <td class="event_date last">
                                            <span class="event_day">30</span>
                                            <span class="event_month">jun</span>
                                        </td>
                                        <td class="event_info last">
                                            <span class="event_title">Live acoustic concert</span>
                                            <span class="event_time">21:00-00:00</span>
                                            <span class="event_text">The sound of a live drum will put the rhythm back in your soul. Playing tonight.</span>
                                        </td>
                                        <td class="add_to_calendar_btn_container last">
                                            <img src="themes/4/desktop/images/280-Appointment_calendar_date_month_planner_reminder_schedule_add_plus-256.png" alt="calendar icon" class="add_to_calendar_btn">
                                        </td>
                                    </tr>
                                </table>
                          </div>
                      </div> -->
                    </#if>
                    
                    <!-- <div class="grid-item cmtyx_sale_block">
                        <div class="header cmtyx_color_2">
                            <div class="title">sale <span class="collapse_btn"></span></div>
                        </div>
                        <div class="body">
                            <div class="sale-item-container">
                                <img src="themes/4/desktop/images/coffee.png" alt="sale-item" class="sale-item">
                                <button>now on sale!</button>
                            </div>
                        </div>
                    </div> -->

                    <!-- <div class="grid-item grid-item--height3 cmtyx_poll_block">
                        <div class="header cmtyx_color_3">
                            <div class="title">sweepstake <span class="collapse_btn"></span></div>
                        </div>
                        <div class="body">
                              <img src="themes/4/desktop/images/coffee.png" alt="poll image">
                              <span class="question">Our coffee is awesome</span>
                              <form class="question_ans_form">
                                  <input type="radio" name="radio-choice-ans" id="a_ans" class="ansRadioChoice" checked='checked'>
                                  <label for="a_ans">YES <span class="answer_color_container answer_color_1"></span></label>
                                  <br><br>
                                  <input type="radio" name="radio-choice-ans" id="b_ans" class="ansRadioChoice"> 
                                  <label for="b_ans">NO <span class="answer_color_container answer_color_2"></span></label>
                              </form>
                              <div class="question_results">
                                  <div class="a_ans_result">
                                      <div class="a_ans_graph answer_color_1"></div>
                                      <span class="a_ans_percent_num">85%</span>
                                  </div>
                                  <div class="b_ans_result">
                                      <div class="b_ans_graph answer_color_2"></div>
                                      <span class="b_ans_percent_num">15%</span>
                                  </div>
                              </div>
                              <div class="prizes_title">There are some prizes you can get</div>
                            <ul>
                                 <li class="last">
                                    <div class="discount_block">
                                         <div class="discount_container">
                                              <div class="discount_text_block">
                                                  <span class="discount_text">Discount</span>
                                                  <span class="discount_condition">every second burger</span>
                                                  <span class="discount_date">till 30.07</span>
                                              </div>
                                              <div class="prize-picture-container">
                                                <img src="themes/4/desktop//images/discount_burger.png" alt="discount image">
                                              </div>
                                          </div>
                                     </div>
                                </li>
                                <li>
                                    <div class="discount_block">
                                         <div class="discount_container">
                                              <div class="discount_text_block">
                                                  <span class="discount_text">Discount</span>
                                                  <span class="discount_condition">every second coffee</span>
                                                  <span class="discount_date">till 30.07</span>
                                              </div>
                                              <div class="prize-picture-container">
                                                <img src="themes/4/desktop/images/discount_coffee.png" alt="discount image">
                                              </div>
                                          </div>
                                     </div>
                                </li>
                            </ul>
                        </div>
                    </div> -->

                    <!-- <div class="grid-item cmtyx_gallery_block">
                        <div class="header cmtyx_color_4">
                            <div class="title">gallery <span class="collapse_btn"></span></div>
                        </div>
                        <div class="body">
                            <div class="owl-carousel gallery">
                              <#list medias as media>
                                  <div class="slide" data-uuid="${media.uuid}">
                                      <img src="${media.URL}" alt="gallery slide image">
                                      <div class="slide_description">
                                          <span class="slide_title">${media.title}</span>
                                          <span class="slide_undertitle">${media.message}</span>
                                      </div>
                                  </div>
                                </#list>
                              </div>
                        </div>
                    </div> -->

                    <#if (externalMedia)?has_content >
                        <!-- <div class="grid-item cmtyx_video_block">
                            <div class="header cmtyx_color_1">
                                <div class="title">video <span class="collapse_btn"></span></div>
                            </div>
                            <div class="body">
                                <div class="video-container">
                                    <iframe width="560" height="315" src="https://www.youtube.com/embed/Co1oj3o4tbE" frameborder="0" allowfullscreen></iframe>
                                </div>
                            </div>
                        </div> -->
                    </#if>

                    <!-- <div class="grid-item cmtyx_about_us">
                        <div class="header cmtyx_color_2">
                            <div class="title">about us <span class="collapse_btn"></span></div>
                        </div>
                        <div class="body">
                            <div class="about-text">
                                ${(sasl.detailedDescription)!"(no detailedDescription)"}
                            </div>
                            <div class="about-address"><img src="themes/4/desktop/images/marker-icon.png" alt="marker icon">1086 North 1st Street, San jose CA 95112</div>
                            <div class="about-phone"><img src="themes/4/desktop/images/phone-icon.png" alt="phone icon">123-456-789</div>
                            <div class='about-business-hours'>Business hours 16.00-02:00</div>
                            <img src="themes/4/desktop/images/map.png" alt="map" class="map-img">
                        </div>
                    </div> -->

                    <!-- <div class="grid-item cmtyx_reviews_block">
                        <div class="header cmtyx_color_3">
                            <div class="title">user's reviews <span class="collapse_btn"></span></div>
                        </div>
                        <div class="body">
                            <div class="review">
                                <table>
                                    <tr>
                                        <td class="user_avatar">
                                          <img src="themes/4/desktop/images/guy-912229_960_720.png" alt="avatar">
                                        </td>
                                        <td class="review_section">
                                            <div class="name_date_block">
                                                <span class="user_name">Jacob Holiday</span><span class="date">Aug, 24, 2016</span>
                                            </div>
                                            <div class="rating_block">
                                                <div class="my-rating"></div>
                                                <div class="rating_number"><span class="current_rating"></span><span>/5</span></div>
                                            </div>
                                            <div class="text_block">We are passionate about coffee. Our founder has a PhD in Coffiology, from the Columbian Beverage Science Academy. </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div class="show_more_block">
                                <div class="show_more_avatars_container">
                                    <img src="themes/4/desktop/images/landscape_nrm_1416942794-chris-prat-cover.png" alt="avatar" class="avatar"></img>
                                    <img src="themes/4/desktop/images/guy-912229_960_720-copy.png" alt="avatar" class="avatar"></img>
                                    <img src="themes/4/desktop/images/girl-03.png" alt="avatar" class="avatar"></img>
                                    <img src="themes/4/desktop/images/images.png" alt="avatar" class="avatar"></img>
                                    <img src="themes/4/desktop/images/guy-912229_960_720-copy.png" alt="avatar" class="avatar"></img>
                                </div>
                                <span class="show_more_reviews_btn cmtyx_text_color_4">show more reviews</span>
                            </div>
                        </div>
                    </div> -->
                  </div>
                </div>

                <div class="right-block">
                  <!-- there is cart/order block -->
                  <div id="order-layout" class="grid-item cmtyx_cart_block"></div>
                </div>

              </div>
          </div>
        </div>
        
        <footer>
            <div class="rights-block">
                <img src="themes/4/desktop/images/chalkboards_tiny.png" alt="logo" class="logo">
                <p>©  2016. All rights reserved.</p>
                <p><a href="https://chalkboardstoday.com">chalkboardstoday.com</a> by Orinoco Inc.</p>
            </div>
            <div class="contacts-block">
                <p class="title">Contacts</p>
                <p class="text">${sasl.email}</p>
                <p class="text">${sasl.telephoneNumber}</p>
            </div>
            <div class="visit-block">
                <p class="title">Visit</p>
                <p class="text">${sasl.number} ${sasl.street} ${sasl.street2}, </p>
                <p class="text">${sasl.city} ${sasl.state} ${sasl.zip},</p>
                <p class="text">${sasl.saslName}</p>
            </div>
        </footer>
        
        <div id="popups-layout">

    </div>

    <script src="build/desktop.js"></script>

</body>
