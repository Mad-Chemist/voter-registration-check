# voter-registration-check
![Voter Registration Check](https://raw.githubusercontent.com/Mad-Chemist/voter-registration-check/master/assets/voter-reg.gif)

#Setup

cd voter-registration-check

npm install

cd ./app

npm install

# For testing without app build

npm start

# Packaging application

npm run build

# Reset PhantomJS / Selenium (Tested on Mac only)

npm run reset

# Known ToDos:

* Fix build issues
  * Right now the built Darwin.app (Mac OSX) does not properly launch Selenium / PhantomJS, causing a stale state that needs reset by running npm run reset
  * Ideally application would just be an icon in taskbar, option to update voter information would spawn current spawn-form.js
  * Ideally application would run on state's script on a timer, and throw notification if user becomes unregistered
* spawn-form.js
  * spawn-form.js always defaults to Indiana, need to take user input for state, check against files in states folder if available, and then use that state's script
  * Need to handle close event more elegantly
  * Need to handle errors
  * Need to relay voter status through better means
