<body>
	<audio id="addtocart" src="themes/5/tempSound/addToCart.wav" autostart="false" ></audio>
	<audio id="removefromcart" src="themes/5/tempSound/removeFromCart.wav" autostart="false" ></audio>

    <div id="cmtyx_desktop_application" class="cmtyx_desktop_application">  
      <header class="cmtyx_special_background_color">
        <div id="back-btn-container" class="back-btn-container"></div>
        <div class="logo-container cmtyx_special_background_color">
          <img class="logo" src="${bannerImageURL}" alt="logo">
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
              <div class="wrapper">
                <!-- there is chat block -->
                <div class="grid-item cmtyx_chat_block" id="cmtyx_chat_block"></div>
                <!-- end of chat block -->

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
                    </div>
                  </div>
                </div>

                <!----- End of welcome block  ---------------->

                <!-- ................................... -->
                <!-- POLL CONTESTS -->
                <div id="cmtyx_poll_block" class="grid-item grid-item--height3 cmtyx_poll_block">
                    <div class="header cmtyx_color_3">
                        <div class="title">QUESTIONNAIRE</div>
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
                    <div class="title">UPLOAD PICTURE</div>
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
                <!-- ................................... -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="cmtyx_medicalSecureView">
        <div class="secure-container">
          <#if sasl.domainEnum.enumText=="MEDICURIS">
            <div class="medical-logo">
              <div class="medical-name">
                <span>Medicuris</span>
              </div>
              <img src="themes/5/placeholder_images/medicuris-logo.png"></img>
              <!-- <span class="fa fa-heartbeat"></span> -->
            </div>
          <#else>
            <div class="vote-name">
              <span>Mobilevote</span>
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
        
      <footer>
        <div class="rights-block">
        
        </div>
        <div class="contacts-block">
          <p class="title">Doctor Contacts</p>
          <p class="text">${sasl.email}</p>
          <p class="text">${sasl.telephoneNumber}</p>
        </div>
        <div class="visit-block">
          <p class="title">Doctor address</p>
          <p class="text">${sasl.saslName}</p>
          <p class="text">${sasl.number} ${sasl.street} ${sasl.street2}, </p>
          <p class="text">${sasl.city} ${sasl.state} ${sasl.zip},</p>
          
        </div>
      </footer>
        
      <div id="popups-layout"></div>
    </div>

    <script src="build/desktop.js"></script>
</body>
