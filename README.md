
#Glance from scratch

This guide is meant  for non technical users, but you can use it anyway

Start checklist (you can skip to the verify step in each action if you think installation exists. Otherwise standard next>next>next installation):

1. Install Java jdk -
 a.  [latest download at time of writing  (Java 8)](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
 b. Verify Java installation by opening a **new** cmd window and type `java -version` - the version should appear
1. Install Javascript -
a. ([Latest Node.js instalation at time of writing](https://nodejs.org/dist/v4.4.5/node-v4.4.5-x64.msi),   includes npm (node package manager))
 b. Verify Node installation by opening a **new** cmd window and type `node --version` - the version should appear
c. Verify npm installation by opening a **new** cmd window and type `npm --version` - the version should appear
1. Install Selenium -
a. Now that npm is installed type `npm install -g selenium-server` (the -g will install it globally)
b. Verify installation by typing `selenium` - this should start selenium and not return to prompt, leave this cmd window open while automating.
1. Notepad or ide (lets write a test) - [notepad++ is a good place to start](https://notepad-plus-plus.org/download/)
1. Firefox browser for testing


Now let’s write some automation - we will check “back to the future”’s ratings on imdb:

1. Lets create a directory for  automation projects : c:/projects in it we will create a folder for our first project c:/projects/imdb
1. In our new directory  we will type `npm install glance-webdriver`, this will install glance webdriver in our project folder
1. Create and edit a new file titled imdb.js
1. First we include the glance library as default :
`var Glance = require(“glance-webdriver”).default;`
1. Create a new webdriver for firefox:
`var glance = new Glance({
	driverConfig: {
		desiredCapabilities: {browserName: ‘firefox’}
			}});`
1. Go to IMDB:
glance.url(“http://www.imdb.com/”)
1. Lets enter the name to search for:
.set("Find movies","back to the future")
1. Click search (since it’s an icon we need to use the dom):
.click("magnifyingglass")
1. We found a few options choose the one we want:
.click("Back to the Future (1985)")
1. Since there is no label we want we use the dom again:
.get("ratingValue")
Then lets print the result to console:
.then(function(result){console.log(result)});

Our final script is :
```var Glance = require("glance-webdriver").default;
var glance = new Glance({
  driverConfig: {
     desiredCapabilities: {browserName: 'firefox'}
        }});

   glance.url("http://www.imdb.com/")
  .set("Find movies","back to the future")
  .click("magnifyingglass")
  .click("Back to the Future (1985)")
  .get("ratingValue")
  .then(function(result){
  console.log(result)
  });
```
Lets run the script:
`node imdb.js`
