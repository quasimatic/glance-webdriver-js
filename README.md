For a step by step guide to setting up selenium:

[http://educate.quasimatic.com/installation/setting-up-selenium](http://educate.quasimatic.com/installation/setting-up-selenium)

For a guide to run your first selenium glance script:

[http://educate.quasimatic.com/selenium/glance-from-scratch](http://educate.quasimatic.com/selenium/glance-from-scratch)


#API 
(work in progress - subject to change)

##	Methods

####		setLogLevel(level)

			Determine log level :

			error, warning, debug, info, trace

####		url(address):

			Navigate to specified URL

####		end():

			End the session and close the browser

####		find(selector):

			Find the element(s) given selector

####		type(text)

			Replace element text with specified text

####		click(selector) :

			Click element

####		doubleClick(selector)

			Double click element

####		middleClick(selector) 

			Middle click element

####		rightClick(selector) 

			Right click element

####		mouseDown()

			Press mouse button

####		mouseUp()

			Lift mouse button
			

####		moveMouseTo(selector, [xOffset, yOffset]) 

			Move mouse to center of element. optional - X,Y offsets from the top left corner of element


####		dragAndDrop(sourceSelector, targetSelector, [xOffset, yOffset])
			
			Drag the specified source element to the center of the specified target element. 
            optional - X,Y offsets from the top left corner of  target element

####		save(selector)
			Performs a get on the specified selector and keeps the results in memory 
            (results will vary depending on selector and projection use)
			example usage: save the number of items in a grid, so we can compare to after a new item is added.

####		waitForChange(selector) 
			Wait for a change to previously saved selector's results 
			
####		getHistory(selector) 
			Return the values from previously used save

####		execute(func, ...args) 
			Execute browserside javascript

####		executeAsync(func, ...args)
			Execute browserside javascript Asynchroniously 

####		pause(delay)
			Add a pause in milliseconds

####		saveScreenshot(filename)
			Save a screenshot of the browser to the filename given
			example: saveScreenshot("/screenshot/mypic.jpg")

####		scroll(selector)
			Scroll to make element visible on screen

####		waitFor(selector) 
			Wait for the given element to appear
			
##	Getting and setting values
				
####		get(selector)
			Get the given selector value

####		set(selector, value) 
			Set the value of current selector
			
####		cast(state)

			Use Json to set state for multiple elements on page. multiple gets, example:
			.cast({
				'username': "myuser",
				'password': "mypass"
			})
		
###	Special projections:
		these projects are added to end of selector to project the results
		
		browser:url
			return the current URL
		browser:title
			return the page's current title
		:text
			return the elements innertext
		:html
			return the elements outerHTML
		:value
			return the elements value
		:attribute-<attribute name>
			return the specified attribute value
		:count
			returns a count of the elements 
###	Options:
		these options are added to end of selector to allow us to change how the object is found or filtered
        
		#visible
			default - return only visible elements
		#<index>
			return element number <index>
			example: input#3 will return the 3rd input element found
		#class
			limit the selector to class attribute
		#contains
			selector given can be part of a longer text string
		#css
			applies selector as a css query
		#exact-text
			find only elements that are an exact textual match
		#node-type
			look only for elements that match this node-type 
            (example: edit > button#node-type - this will only search for edit buttons)
		#value
			look for the selector in the value attribute
		#attribute-<attribute name>
			limit the search to the specified attribute name
	
