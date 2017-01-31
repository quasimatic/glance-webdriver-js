#step by step instructions to get glance running

	Requirements Checklist (you can skip to the verify step in each action if you think installation exists. Otherwise standard next>next>next installation):

	1. Install Java jdk -
	   1. Latest download at time of writing  (Java 8)
	   2. Verify Java installation by opening a new cmd window and type java -version - the version should appear
	2. Install Javascript -
	   1. (Latest Node.js installation at time of writing,   includes npm (node package manager))
	   2. Verify Node installation by opening a new cmd window and type node --version - the version should appear
	   3. Verify npm installation by opening a new cmd window and type npm --version - the version should appear
	3. Install Selenium -
	   1. Now that npm is installed type npm install -g selenium-standalone@latest (the -g will install it globally)
	   2. In a new command window type: selenium-standalone install
	   3. From now on everytime you want to start selenium open a new command window and type selenium-standalone start  (leave the window open as long as your testing.
	4. Notepad or ide (lets write a test) - notepad++ is a good place to start
	5. Chrome browser for testing

	Now let’s write some automation - we will make a simple todo list on todomvc.com/

	1. Lets create a directory for automation projects : c:/projects in it we will create a folder for our first project c:/projects/todo
	2. In our new directory we will type npm install glance-webdriver, this will install glance webdriver in our project folder
	3. Create and edit a new file titled todo.js
	4. First we include the glance library as default: var Glance = require(“glance-webdriver”).default;
	5. Create a new webdriver for chrome:

	var glance = new Glance({

	 driverConfig: { desiredCapabilities: {browserName: ‘chrome’} }

	});```

	1. Go to mvctodo.com:
	   glance.url(“http://todomvc.com/”)
	2. Lets choose the React todo:
	   .click("These are examples written in pure JavaScript.>React")
	3. let's enter our first item followed by an enter: .set("What needs to be done?", "1. test this")
	4. Press enter to insert the task: .sendKeys("Enter")
	5. now for another item: .set("What needs to be done?", "2. test this too")
	6. Press enter to insert the task: .sendKeys("Enter")
	7. we'll mark the first item as done, since the checkbox doesnt have a label we look in the dom to see it is an input element which allows us to use: .click("1. test this > input")

	Our final script is :

		var Glance = require("glance-webdriver").default;
		var glance = new Glance({
			driverConfig: {
				desiredCapabilities: {browserName: 'chrome'}
			}
		});
		
		glance.url("http://todomvc.com/")
			.click("These are examples written in pure JavaScript. > React")
			.set("What needs to be done?", "1. test this")
			.sendKeys("Enter")
			.set("What needs to be done?", "2. test this too")
			.sendKeys("Enter")
			.click("1. test this > input");

	Lets run the script in a new command window:

		`node todo.js`



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
	
