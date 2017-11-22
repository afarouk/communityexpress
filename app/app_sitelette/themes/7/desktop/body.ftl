<body>
	<audio id="addtocart" src="themes/7/tempSound/addToCart.wav" autostart="false" ></audio>
	<audio id="removefromcart" src="themes/7/tempSound/removeFromCart.wav" autostart="false" ></audio>

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
          <div class="grid home_tabs_list"> 
            <!-- there is chat block -->
            <div class="grid-item cmtyx_chat_block" id="cmtyx_chat_block"></div>
            <!-- end of chat block -->  
          </div>
        </div>
      </div>

      <div id="cmtyx_medicalSecureView">
        <div class="secure-container">
          <div class="chat-logo">
            <div class="chat-name">
              <span>Chat app</span>
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
        
      <footer>
        <div class="rights-block">
        
        </div>
        <div class="contacts-block">
          <p class="title">... Contacts</p>
          <p class="text">${sasl.email}</p>
          <p class="text">${sasl.telephoneNumber}</p>
        </div>
        <div class="visit-block">
          <p class="title">... address</p>
          <p class="text">${sasl.saslName}</p>
          <p class="text">${sasl.number} ${sasl.street} ${sasl.street2}, </p>
          <p class="text">${sasl.city} ${sasl.state} ${sasl.zip},</p>
          
        </div>
      </footer>
        
      <div id="popups-layout"></div>
    </div>

    <script src="build/desktop.js"></script>
</body>
