## For a step by step guide to setting up selenium:

[http://educate.quasimatic.com/installation/setting-up-selenium](http://educate.quasimatic.com/installation/setting-up-selenium)

## For a guide to run your first selenium glance script:

[http://educate.quasimatic.com/selenium/glance-from-scratch](http://educate.quasimatic.com/selenium/glance-from-scratch)

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
		
------------------------
### Special projections: 
------------------------

These are added to end of selector to project the results.

<dl>
<dt>browser:url</dt>
<dd>return the current URL</dd>
<dt>browser:title</dt>
<dd>return the page's current title</dd>
<dt>:text</dt>
<dd>return the elements innertext</dd>
<dt>:html</dt>
<dd>return the elements outerHTML</dd>
<dt>:value</dt>
<dd>return the elements value</dd>
<dt>:attribute-&lt;attribute name$gt;</dt>
<dd>return the specified attribute value</dd>
<dt>:count</dt>
<dd>returns a count of the elements </dd>
</dl>		

------------
### Options:
------------

These options are added to end of a label to allow us to change how the object is found or filtered


<dl>
  <dt>#attribute-&lt;attribute name&gt;</dt>
  <dd>limit the search to the specified attribute name<br><br>
  Example Code: https://codepen.io/quasimatic/pen/zwQVEL
  </dd>
  <dt>#class</dt>
  <dd>limit the selector to class attribute</dd>
  <dt>#closest</dt>
  <dd>visibly closest element to the scope</dd>
  <dt>#contains-text</dt>
  <dd>selector given can be part of a longer text string<br><br>
  Example Code: https://codepen.io/quasimatic/pen/bWPwjK
  </dd>
  <dt>#css</dt>
  <dd>applies selector as a css query<br><br>
  Example Code: http://codepen.io/quasimatic/pen/xdJKJP
  </dd>
  <dt>#exact-text</dt>
  <dd>find only elements that are an exact textual match</dd>
  <dt>#hidden</dt>
  <dd>limit the search to hidden elements</dd>
  <dt>#id</dt>
  <dd>limit the search to the specified id (fastest way to search)</dd>
  <dt>#&lt;index&gt;</dt>
  <dd>return element number &lt;index&gt;<br><br>
  Example Code: https://codepen.io/quasimatic/pen/BROxEm
  </dd>
  <dt>#node-type</dt>
  <dd>look only for elements that match this node-type<br>
      (example: edit ^ button#node-type - this will only search for edit buttons)
  </dd>
  <dt>#value</dt>
  <dd>look for the selector in the value attribute</dd>
  <dt>#visible</dt>
  <dd>default behavior - return only visible elements<br><br>
  Example Code: https://codepen.io/quasimatic/pen/MmqGGq/
  </dd>
</dl>
