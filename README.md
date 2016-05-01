# voter-registration-check
~revise at some point

#Setup

cd voter-registration-check

npm install


# Run selenium script once manually
node index.js


# For testing, build with electron

./node_modules/.bin/electron .


# Known ToDos:

* Make WebDriverIO use headless phantomJS
  * This branch addressess this
* Use Electron to generate exe / dmg / app files to run application on click
  * Ideally application would just be an icon in taskbar, option to update voter information would spawn current spawn-form.js
  * Ideally application would run on state's script on a timer, and throw notification if user becomes unregistered
* spawn-form.js
  * spawn-form.js always defaults to Indiana, need to take user input for state, check against files in states folder if available, and then use that state's script
  * Need to handle close event more elegantly
  * Need to handle errors
  * Need to relay voter status through better means
