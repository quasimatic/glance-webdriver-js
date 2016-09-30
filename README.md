This guide is meant for non technical users, but you can use it anyway.

Requirements Checklist (you can skip to the verify step in each action if you think installation exists. Otherwise standard next>next>next installation):

1. Install Java jdk -
    1. [Latest download at time of writing  (Java 8)](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
    2. Verify Java installation by opening a **new** cmd window and type `java -version` - the version should appear
2. Install Javascript -
    1. ([Latest Node.js installation at time of writing](https://nodejs.org/),   includes npm (node package manager))
    2. Verify Node installation by opening a **new** cmd window and type `node --version` - the version should appear
    3. Verify npm installation by opening a **new** cmd window and type `npm --version` - the version should appear
3. Install Selenium -
    1. Now that npm is installed type `npm install -g selenium-standalone@latest` (the -g will install it globally)
    2. In a new command window type: `selenium-standalone install`
    3. From now on everytime you want to start selenium open a new command window and type `selenium-standalone start`  (leave the window open as long as your testing.
4. Notepad or ide (lets write a test) - [notepad++ is a good place to start](https://notepad-plus-plus.org/download/)
5. Chrome browser for testing

Now let’s write some automation - we will make a simple todo list on [todomvc.com/](http://todomvc.com/)

1. Lets create a directory for automation projects : c:/projects in it we will create a folder for our first project c:/projects/todo
2. In our new directory we will type `npm install glance-webdriver`, this will install glance webdriver in our project folder
3. Create and edit a new file titled todo.js
4. First we include the glance library as default: `var Glance = require(“glance-webdriver”).default;`
5. Create a new webdriver for chrome:


```var glance = new Glance({```
 ```driverConfig: { desiredCapabilities: {browserName: ‘chrome’} }```
```});
```

6. Go to mvctodo.com:
`glance.url(“http://todomvc.com/”)`
7. Lets choose the React todo:
`.click("These are examples written in pure JavaScript.>React")`
8. let's enter our first item followed by an enter: `.set("What needs to be done?", "1. test this")`
9. Press enter to insert the task: ```.sendKeys("Enter")```
9. now for another item: `.set("What needs to be done?", "2. test this too")`
10. Press enter to insert the task: ```.sendKeys("Enter")```
10. we'll mark the first item as done, since the checkbox doesnt have a label we look in the dom to see it is an input element which allows us to use: `.click("1. test this > input")`

Our final script is :

~~~ javascript
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
~~~
Lets run the script in a new command window:
    `node todo.js`
