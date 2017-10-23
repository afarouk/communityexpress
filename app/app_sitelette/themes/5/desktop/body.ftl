<body>
	<audio id="addtocart" src="themes/5/tempSound/addToCart.wav" autostart="false" ></audio>
	<audio id="removefromcart" src="themes/5/tempSound/removeFromCart.wav" autostart="false" ></audio>

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
 
          <div class="grid-container cmtyx_desktop_application">
              <div class="cssload-thecube">
                  <div class="cssload-cube cssload-c1"></div>
                  <div class="cssload-cube cssload-c2"></div>
                  <div class="cssload-cube cssload-c4"></div>
                  <div class="cssload-cube cssload-c3"></div>
              </div>

              <div class="grid home_tabs_list">

                <div class="left-block">
                  <!-- there is catalogs block -->
                  <!-- <div id="catalogs-layout" class="grid-item cmtyx_menu_block"></div> -->
                  
                  <div class="wrapper">

                    <!-- there is welcome block -->
                    <div class="grid-item cmtyx_welcome_block">
                      <div class="body">
                        <#if (medias)?has_content >
                          <img src="${medias[0].URL}" />
                        <#else>
                          <img src="themes/5/placeholder_images/welocome_img.png"></img>
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

                    <!--    APPOINTMENTS-->
                      <li id="cmtyx_appointments_block" class="grid-item cmtyx_appointments_block">
                        <div class="header cmtyx_color_3">
                          <span class="title">Appointments</span>
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

                    <!-- POLL CONTESTS -->
                    <div class="grid-item grid-item--height3 cmtyx_poll_block">
                        <div class="header cmtyx_color_3">
                            <div class="title">sweepstake <span class="collapse_btn"></span></div>
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
                                                <img src="themes/5/desktop//images/discount_burger.png" alt="discount image">
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
                                                <img src="themes/5/desktop/images/discount_coffee.png" alt="discount image">
                                              </div>
                                          </div>
                                     </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!----- Selfie Contest (Photo contest)  ---------------->       
        
                      <li id="cmtyx_photo_contest_block" class="grid-item grid-item--height3 photo_contest_block">
                        <div class="header cmtyx_color_4">
                          <div class="title">Selfie contest
                            <span class="collapse_btn"></span>
                          </div>
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
                  </div>
                </div>
              </div>
          </div>
        </div>
        
        <footer>
            <div class="rights-block">
                <img src="themes/5/desktop/images/chalkboards_tiny.png" alt="logo" class="logo">
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
