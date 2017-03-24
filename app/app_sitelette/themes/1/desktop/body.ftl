<body>
	<audio id="addtocart" src="themes/1/tempSound/addToCart.wav" autostart="false" ></audio>
	<audio id="removefromcart" src="themes/1/tempSound/removeFromCart.wav" autostart="false" ></audio>

    <div id="cmtyx_desktop_application" class="cmtyx_desktop_application">
        
        <header class="cmtyx_special_background_color">
            <div class="logo-container cmtyx_special_background_color">
                <img class="logo" src="${bannerImageURL}" alt="logo">
            </div>
            <ul class="links-conatiner">
                <li class="link">catalog</li>
                <li class="link">promotions</li>
                <li class="link">about us</li>
                <li class="link last">sign up/log in</li>
            </ul>
        </header>

        <div id="cmtyx_landingView">
        	<#if notification??>
				<div class="breaking_news">
					<span class="news_line">${notification.notificationBody}</span>
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

                <div class="grid-sizer"></div>
                <div class="gutter-sizer"></div>

                <!-- there is catalogs block -->
                <div class="grid-item cmtyx_menu_block">
                    <div class="header cmtyx_color_6">
                        <div class="title">menu <span class="collapse_btn"></span></div>
                    </div>
                    <div class="body">
                        <div class="catalog_main_container">
                          <div class="title">
                            Catalog
                          </div>
                          <ul class="days_list">
                            <li class="day">
                              <div class="day_name">Monday</div>
                              <div class="day_description">For pickup on Monday only</div>
                              <img src="themes/1/desktop/images/day-right-arrow.png" alt="right arrow">
                            </li>
                            <li class="day">
                              <div class="day_name">Tuesday</div>
                              <div class="day_description">For pickup on Tuesday only</div>
                              <img src="themes/1/desktop/images/day-right-arrow.png" alt="right arrow">
                            </li>
                            <li class="day">
                              <div class="day_name">Wednesday</div>
                              <div class="day_description">For pickup on Wednesday only</div>
                              <img src="themes/1/desktop/images/day-right-arrow.png" alt="right arrow">
                            </li>
                            <li class="day">
                              <div class="day_name">Thursday</div>
                              <div class="day_description">For pickup on Thursday only</div>
                              <img src="themes/1/desktop/images/day-right-arrow.png" alt="right arrow">
                            </li>
                            <li class="day">
                              <div class="day_name">Friday</div>
                              <div class="day_description">For pickup on Friday only</div>
                              <img src="themes/1/desktop/images/day-right-arrow.png" alt="right arrow">
                            </li>
                            <li class="day">
                              <div class="day_name">Saturday</div>
                              <div class="day_description">For pickup on Saturday only</div>
                              <img src="themes/1/desktop/images/day-right-arrow.png" alt="right arrow">
                            </li>
                            <li class="day">
                              <div class="day_name">Sunday</div>
                              <div class="day_description">For pickup on Sunday only</div>
                              <img src="themes/1/desktop/images/day-right-arrow.png" alt="right arrow">
                            </li>
                          </ul>
                        </div>
      
                        <div class="tabs">
                          <button class="tablinks">Lunch</button>
                          <button class="tablinks">Dinner</button>
                          <button class="tablinks">Supper</button>
                          <button class="tablinks">Vegetarian</button>
                          <button class="tablinks">Exotic</button>
                          <button class="tablinks">Desserts</button>
                        </div>

                        <div id="Lunch" class="tabcontent">
                          <div class="header">
                            <div class="back_to_catalog_btn">
                              <img src="themes/1/desktop/images/back-arr.png" alt="back arrow">
                              <span>Back to catalog</span>
                            </div>
                          </div>
                          <div class="catalog-container">
                            <ul class="cmtyx_catalog">
                              <li class="catalog_item">
                                <div class="left_block">
                                  <div class="item_title">
                                    byriani
                                  </div>
                                  <div class="item_description">
                                    Green Salad, Cauliflower Manchurian, Veg Fried Rice and Fresh Fruits
                                  </div>
                                  <button class="customize_btn">customize</button>
                                </div>
                                <div class="right_block">
                                  <div class="item_price">$9.75</div>
                                  <div class="quantity_container">
                                    <div class="block minus">-</div>
                                    <div class="block number">1</div>
                                    <div class="block plus">+</div>
                                  </div>
                                  <button class="add_to_cart_btn">add to cart</button>
                                </div>
                              </li>
                              <li class="catalog_item">
                                <div class="left_block">
                                  <div class="item_title">
                                    byriani
                                  </div>
                                  <div class="item_description">
                                    Green Salad, Cauliflower Manchurian, Veg Fried Rice and Fresh Fruits
                                  </div>
                                  <button class="customize_btn">customize</button>
                                </div>
                                <div class="right_block">
                                  <div class="item_price">$9.75</div>
                                  <div class="quantity_container">
                                    <div class="block minus">-</div>
                                    <div class="block number">1</div>
                                    <div class="block plus">+</div>
                                  </div>
                                  <button class="add_to_cart_btn">add to cart</button>
                                </div>
                              </li>
                              <li class="catalog_item">
                                <div class="left_block">
                                  <div class="item_title">
                                    byriani
                                  </div>
                                  <div class="item_description">
                                    Green Salad, Cauliflower Manchurian, Veg Fried Rice and Fresh Fruits
                                  </div>
                                  <button class="customize_btn">customize</button>
                                </div>
                                <div class="right_block">
                                  <div class="item_price">$9.75</div>
                                  <div class="quantity_container">
                                    <div class="block minus">-</div>
                                    <div class="block number">1</div>
                                    <div class="block plus">+</div>
                                  </div>
                                  <button class="add_to_cart_btn">add to cart</button>
                                </div>
                              </li>
                              <li class="catalog_item">
                                <div class="left_block">
                                  <div class="item_title">
                                    byriani
                                  </div>
                                  <div class="item_description">
                                    Green Salad, Cauliflower Manchurian, Veg Fried Rice and Fresh Fruits
                                  </div>
                                  <button class="customize_btn">customize</button>
                                </div>
                                <div class="right_block">
                                  <div class="item_price">$9.75</div>
                                  <div class="quantity_container">
                                    <div class="block minus">-</div>
                                    <div class="block number">1</div>
                                    <div class="block plus">+</div>
                                  </div>
                                  <button class="add_to_cart_btn">add to cart</button>
                                </div>
                              </li>
                              <li class="catalog_item">
                                <div class="left_block">
                                  <div class="item_title">
                                    byriani
                                  </div>
                                  <div class="item_description">
                                    Green Salad, Cauliflower Manchurian, Veg Fried Rice and Fresh Fruits
                                  </div>
                                  <button class="customize_btn">customize</button>
                                </div>
                                <div class="right_block">
                                  <div class="item_price">$9.75</div>
                                  <div class="quantity_container">
                                    <div class="block minus">-</div>
                                    <div class="block number">1</div>
                                    <div class="block plus">+</div>
                                  </div>
                                  <button class="add_to_cart_btn">add to cart</button>
                                </div>
                              </li>
                              <li class="catalog_item">
                                <div class="left_block">
                                  <div class="item_title">
                                    byriani
                                  </div>
                                  <div class="item_description">
                                    Green Salad, Cauliflower Manchurian, Veg Fried Rice and Fresh Fruits
                                  </div>
                                  <button class="customize_btn">customize</button>
                                </div>
                                <div class="right_block">
                                  <div class="item_price">$9.75</div>
                                  <div class="quantity_container">
                                    <div class="block minus">-</div>
                                    <div class="block number">1</div>
                                    <div class="block plus">+</div>
                                  </div>
                                  <button class="add_to_cart_btn">add to cart</button>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div id="Dinner" class="tabcontent">
                          <div class="header">
                            <div class="back_to_catalog_btn">
                              <img src="themes/1/desktop/images/back-arr.png" alt="back arrow">
                              <span>Back to catalog</span>
                            </div>
                          </div>
                          <div class="catalog-container">
                          </div>
                        </div>

                        <div id="Supper" class="tabcontent">
                          <div class="header">
                            <div class="back_to_catalog_btn">
                              <img src="themes/1/desktop/images/back-arr.png" alt="back arrow">
                              <span>Back to catalog</span>
                            </div>
                          </div>
                          <div class="catalog-container">
                          </div>
                        </div>

                        <div id="Vegetarian" class="tabcontent">
                          <div class="header">
                            <div class="back_to_catalog_btn">
                              <img src="themes/1/desktop/images/back-arr.png" alt="back arrow">
                              <span>Back to catalog</span>
                            </div>
                          </div>
                          <div class="catalog-container">
                          </div>
                        </div>

                        <div id="Exotic" class="tabcontent">
                         <div class="header">
                            <div class="back_to_catalog_btn">
                              <img src="themes/1/desktop/images/back-arr.png" alt="back arrow">
                              <span>Back to catalog</span>
                            </div>
                          </div>
                          <div class="catalog-container">
                          </div>
                        </div>

                        <div id="Desserts" class="tabcontent">
                          <div class="header">
                            <div class="back_to_catalog_btn">
                              <img src="themes/1/desktop/images/back-arr.png" alt="back arrow">
                              <span>Back to catalog</span>
                            </div>
                          </div>
                          <div class="catalog-container">
                          </div>
                        </div>
                    </div>
                </div>
                <!-- there is cart/order block -->
                <div class="grid-item cmtyx_cart_block">
                  <div class="header cmtyx_color_3">
                    <div class="title">shopping cart <span class="collapse_btn"></span></div>
                  </div>
                  <div class="body">
                    <div class="title">
                      Your order
                    </div>
                    <ul class="order_list">
                      <li class="order_list_item">
                        <div class="left_block">
                          <div class="item_name">Combo 1</div>
                        </div>
                        <div class="right_block">
                          <div class="quantity_container">
                            <div class="block minus">-</div>
                            <div class="block number">1</div>
                            <div class="block plus">+</div>
                          </div>
                          <div class="item_price cmtyx_text_color_4">$9.75</div>
                        </div>
                      </li>
                      <li class="order_list_item">
                        <div class="left_block">
                          <div class="item_name">Ginger beer</div>
                        </div>
                        <div class="right_block">
                          <div class="quantity_container">
                            <div class="block minus">-</div>
                            <div class="block number">1</div>
                            <div class="block plus">+</div>
                          </div>
                          <div class="item_price cmtyx_text_color_4">$9.75</div>
                        </div>
                      </li>
                      <li class="order_list_item">
                        <div class="left_block">
                          <div class="item_name">Fresh fruits</div>
                        </div>
                        <div class="right_block">
                          <div class="quantity_container">
                            <div class="block minus">-</div>
                            <div class="block number">1</div>
                            <div class="block plus">+</div>
                          </div>
                          <div class="item_price cmtyx_text_color_4">$9.75</div>
                        </div>
                      </li>
                    </ul>
                    <div class="additional_prices">
                      <div class="subtotal_price price_name">Subtotal</div>
                      <div class="price cmtyx_text_color_4">$30.00</div>
                    </div>
                    <div class="additional_prices">
                      <div class="subtotal_price price_name">Shipping</div>
                      <div class="price cmtyx_text_color_4">$5.00</div>
                    </div>
                    <div class="additional_prices">
                      <div class="subtotal_price price_name">Tax</div>
                      <div class="price cmtyx_text_color_4">$2.00</div>
                    </div>
                    <div class="additional_prices">
                      <div class="left_block">
                        <div class="subtotal_price price_name">Tip</div>
                      </div>  
                      <div class="right_block">
                        <div class="quantity_container">
                          <div class="block minus">-</div>
                          <div class="block number tip_number">20%</div>
                          <div class="block plus">+</div>
                        </div>
                        <div class="price cmtyx_text_color_4">$3.00</div>
                      </div>
                    </div>
                    <div class="total_price">
                      <div class="name">total</div>
                      <div class="price cmtyx_text_color_4">$35.00</div>
                    </div>
                    <button class="order_btn">order</button>
                  </div>
                </div>
                <!-- there is welcome block -->
                <div class="grid-item cmtyx_welcome_block">
                  <div class="body">
                    <div class="title">warm and cosy</div>
                    <div class="undertitle">A quite room perfect for conversation with soft music in background</div>
                    <span class="open_label">we are open</span>    
                    <div class="business_hours">Business hours <span class="from">16.00</span>-<span class="till">02:00</span></div>
                  </div>
                </div>

                <#if (promotions)?has_content >
	                <div class="grid-item cmtyx_promotion_block">
	                    <div class="header cmtyx_color_1">
	                        <div class="title">promotion <span class="collapse_btn"></span></div>
	                    </div>
	                    <div class="body">
	                    	<ul>
	                    		<#list promotions as promotion>
	                    			<li class="promotions-item" data-uuid="${promotion.uuid}">
				                        <div class="promotion-container">
				                            <img src="themes/1/desktop/images/dog.png" alt="promotion image" class="promotion-image">
				                            <div class="promotion-btns">
				                                <div class="left-block">
				                                  <span><img src="themes/1/desktop/images/like-icon.png" alt="like icon">Like</span>
				                                </div>
				                                <div class="right-block">
				                                  <span><img src="themes/1/desktop/images/share-icon.png" alt="share icon">Share</span>
				                                </div>
				                            </div>
				                        </div>
				                    </li>
				                </#list>
	                        </ul>
	                    </div>
	                </div>
	            </#if>

                <div class="grid-item cmtyx_promocodes_block">
                    <div class="header cmtyx_color_3">
                        <div class="title">discount <span class="collapse_btn"></span></div>
                    </div>
                    <div class="body">
                        <div class="discount-item-container">
                            <img src="themes/1/desktop/images/burger.png" alt="discount image">
                            <div class="discount-item-info">
                                <div class="discount-item-title">Discount</div>
                                <div class="discount-item-text">every second burger</div>
                                <div class="discount-item-date">till 30.07</div>
                            </div>
                        </div>
                    </div>
                </div>

                <#if (eventsSummary.events)?has_content >
                  <div class="grid-item grid-item--height3 cmtyx_events_block">
                      <div class="header cmtyx_color_4">
                          <div class="title">events <span class="collapse_btn"></span></div>
                      </div>
                      <div class="body">
                          <img src="themes/1/desktop/images/red-hot-band.png" alt="event image">
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
                                        <img src="themes/1/desktop/images/280-Appointment_calendar_date_month_planner_reminder_schedule_add_plus-256.png" alt="calendar icon" class="add_to_calendar_btn">
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
                                        <img src="themes/1/desktop/images/280-Appointment_calendar_date_month_planner_reminder_schedule_add_plus-256.png" alt="calendar icon" class="add_to_calendar_btn">
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
                                        <img src="themes/1/desktop/images/280-Appointment_calendar_date_month_planner_reminder_schedule_add_plus-256.png" alt="calendar icon" class="add_to_calendar_btn">
                                    </td>
                                </tr>
                            </table>
                      </div>
                  </div>
                </#if>
                
                <div class="grid-item cmtyx_sale_block">
                    <div class="header cmtyx_color_6">
                        <div class="title">sale <span class="collapse_btn"></span></div>
                    </div>
                    <div class="body">
                        <div class="sale-item-container">
                            <img src="themes/1/desktop/images/coffee.png" alt="sale-item" class="sale-item">
                            <button>now on sale!</button>
                        </div>
                    </div>
                </div>

                <div class="grid-item grid-item--height3 cmtyx_poll_block">
                    <div class="header cmtyx_color_5">
                        <div class="title">sweepstake <span class="collapse_btn"></span></div>
                    </div>
                    <div class="body">
                          <img src="themes/1/desktop/images/coffee.png" alt="poll image">
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
                                            <img src="themes/1/desktop//images/discount_burger.png" alt="discount image">
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
                                            <img src="themes/1/desktop/images/discount_coffee.png" alt="discount image">
                                          </div>
                                      </div>
                                 </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="grid-item cmtyx_gallery_block">
                    <div class="header cmtyx_color_1">
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
                </div>

                <#if (externalMedia)?has_content >
                    <div class="grid-item cmtyx_video_block">
                        <div class="header cmtyx_color_7">
                            <div class="title">video <span class="collapse_btn"></span></div>
                        </div>
                        <div class="body">
                            <div class="video-container">
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/Co1oj3o4tbE" frameborder="0" allowfullscreen></iframe>
                            </div>
                        </div>
                    </div>
                </#if>

                <div class="grid-item cmtyx_about_us">
                    <div class="header cmtyx_color_4">
                        <div class="title">about us <span class="collapse_btn"></span></div>
                    </div>
                    <div class="body">
                        <div class="about-text">
                            ${(sasl.detailedDescription)!"(no detailedDescription)"}
                        </div>
                        <div class="about-address"><img src="themes/1/desktop/images/marker-icon.png" alt="marker icon">1086 North 1st Street, San jose CA 95112</div>
                        <div class="about-phone"><img src="themes/1/desktop/images/phone-icon.png" alt="phone icon">123-456-789</div>
                        <div class='about-business-hours'>Business hours 16.00-02:00</div>
                        <img src="themes/1/desktop/images/map.png" alt="map" class="map-img">
                    </div>
                </div>

                <div class="grid-item cmtyx_reviews_block">
                    <div class="header cmtyx_color_9">
                        <div class="title">user's reviews <span class="collapse_btn"></span></div>
                    </div>
                    <div class="body">
                        <div class="review">
                            <table>
                                <tr>
                                    <td class="user_avatar">
                                      <img src="themes/1/desktop/images/guy-912229_960_720.png" alt="avatar">
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
                                <img src="themes/1/desktop/images/landscape_nrm_1416942794-chris-prat-cover.png" alt="avatar" class="avatar"></img>
                                <img src="themes/1/desktop/images/guy-912229_960_720-copy.png" alt="avatar" class="avatar"></img>
                                <img src="themes/1/desktop/images/girl-03.png" alt="avatar" class="avatar"></img>
                                <img src="themes/1/desktop/images/images.png" alt="avatar" class="avatar"></img>
                                <img src="themes/1/desktop/images/guy-912229_960_720-copy.png" alt="avatar" class="avatar"></img>
                            </div>
                            <span class="show_more_reviews_btn cmtyx_text_color_4">show more reviews</span>
                        </div>
                    </div>
                </div>

              </div>
          </div>
        </div>
        
        <footer>
            <div class="rights-block">
                <img src="themes/1/desktop/images/zaza-grill.png" alt="logo" class="logo">
                <p>©  2016. All rights reserved.</p>
                <p>orinoco.us, by Orinoco Inc.</p>
            </div>
            <div class="contacts-block">
                <p class="title">Contacts</p>
                <p class="text">zaza.grill@gmail.com</p>
                <p class="text">123-456-789</p>
            </div>
            <div class="visit-block">
                <p class="title">Visit</p>
                <p class="text">1086 North 1st Street, </p>
                <p class="text">San jose CA 95112,</p>
                <p class="text">ZazaGrill Restaurant</p>
            </div>
            <div class="share-block">
                <p class="title">Share this site</p>
                <p class="link"><img src="themes/1/desktop/images/sms-icon.png" alt="sms icon">SMS</p>
                <p class="link"><img src="themes/1/desktop/images/facebook-icon.png" alt="facebook icon">Facebook</p>
                <br>
                <p class="link"><img src="themes/1/desktop/images/email-icon.png" alt="email icon">E-mail</p>
                <p class="link"><img src="themes/1/desktop/images/twitter-icon.png" alt="twitter icon">Twitter</p>
            </div>
        </footer>

    </div>

</body>