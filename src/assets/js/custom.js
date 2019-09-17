	
		// Cache selectors
			var lastId,
			 topMenu = $("#menu-center"),
			 topMenuHeight = topMenu.outerHeight()+1,
			 // All list items
			 menuItems = topMenu.find("a"),
			 // Anchors corresponding to menu items
			 scrollItems = menuItems.map(function(){
			   var item = $($(this).attr("href"));
				if (item.length) { return item; }
			 });

			// Bind click handler to menu items
			// so we can get a fancy scroll animation
			menuItems.click(function(e){
			  var href = $(this).attr("href"),
				  //offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1;
				  offsetTop = href === "#" ? 0 : $(href).offset().top+1;
			  $('html, body').stop().animate({ 
				  scrollTop: offsetTop
			  }, 850);
			  e.preventDefault();
			});

			// Bind to scroll
			$(window).scroll(function(){
			   // Get container scroll position
			   //var fromTop = $(this).scrollTop()+topMenuHeight;
			   var fromTop = $(this).scrollTop();
			   
			   // Get id of current scroll item
			   var cur = scrollItems.map(function(){
				 if ($(this).offset().top < fromTop)
				   return this;
			   });
			   // Get the id of the current element
			   cur = cur[cur.length-1];
			   var id = cur && cur.length ? cur[0].id : "";
			   
			   if (lastId !== id) {
				   lastId = id;
				   // Set/remove active class
				   menuItems
					 .parent().removeClass("active")
					 .end().filter("[href=#"+id+"]").parent().addClass("active");
			   }                   
			});
			
			
			
			
			
			
			
			
			// values to keep track of the number of letters typed, which quote to use. etc. Don't change these values.
			var i = 0,
				a = 0,
				isBackspacing = false,
				isParagraph = false;

			// Typerwrite text content. Use a pipe to indicate the start of the second line "|".  
			var textArray = [
			  "FIND AND BOOK ROOMS", 
			  "Save money by sharing homes"
			];

			// Speed (in milliseconds) of typing.
			var speedForward = 350, //Typing Speed
				speedWait = 1000, // Wait between typing and backspacing
				speedBetweenLines = 1000, //Wait between first and second lines
				speedBackspace = 25; //Backspace Speed

			//Run the loop
			typeWriter("output", textArray);

			function typeWriter(id, ar) {
			  var element = $("#" + id),
				  aString = ar[a],
				  eHeader = element.children("h1"), //Header element
				  eParagraph = element.children("p"); //Subheader element
			  
			  // Determine if animation should be typing or backspacing
			  if (!isBackspacing) {
				
				// If full string hasn't yet been typed out, continue typing
				if (i < aString.length) {
				  
				  // If character about to be typed is a pipe, switch to second line and continue.
				  if (aString.charAt(i) == "|") {
					isParagraph = true;
					eHeader.removeClass("cursor");
					eParagraph.addClass("cursor");
					i++;
					setTimeout(function(){ typeWriter(id, ar); }, speedBetweenLines);
					
				  // If character isn't a pipe, continue typing.
				  } else {
					// Type header or subheader depending on whether pipe has been detected
					if (!isParagraph) {
					  eHeader.text(eHeader.text() + aString.charAt(i));
					} else {
					  eParagraph.text(eParagraph.text() + aString.charAt(i));
					}
					i++;
					setTimeout(function(){ typeWriter(id, ar); }, speedForward);
				  }
				  
				// If full string has been typed, switch to backspace mode.
				} else if (i == aString.length) {
				  
				  isBackspacing = true;
				  setTimeout(function(){ typeWriter(id, ar); }, speedWait);
				  
				}
				
			  // If backspacing is enabled
			  } else {
				
				// If either the header or the paragraph still has text, continue backspacing
				if (eHeader.text().length > 0 || eParagraph.text().length > 0) {
				  
				  // If paragraph still has text, continue erasing, otherwise switch to the header.
				  if (eParagraph.text().length > 0) {
					eParagraph.text(eParagraph.text().substring(0, eParagraph.text().length - 1));
				  } else if (eHeader.text().length > 0) {
					eParagraph.removeClass("cursor");
					eHeader.addClass("cursor");
					eHeader.text(eHeader.text().substring(0, eHeader.text().length - 1));
				  }
				  setTimeout(function(){ typeWriter(id, ar); }, speedBackspace);
				
				// If neither head or paragraph still has text, switch to next quote in array and start typing.
				} else { 
				  
				  isBackspacing = false;
				  i = 0;
				  isParagraph = false;
				  a = (a + 1) % ar.length; //Moves to next position in array, always looping back to 0
				  setTimeout(function(){ typeWriter(id, ar); }, 50);
				  
				}
			  }
			}
			
			
			$(window).scroll(function(){
				var banner_height = $('.banner-section').outerHeight();
				if ($(this).scrollTop() > banner_height) {
				   $('body').addClass('display-menu');
				} else {
				   $('body').removeClass('display-menu');
				}
			});
			
			new WOW().init();
			
