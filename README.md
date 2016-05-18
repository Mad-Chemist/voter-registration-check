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


* App Changes
  * Ideally application would just be an icon in taskbar, option to update voter information would spawn current form
  * Ideally application would run on state's script on a timer, and throw notification if user becomes unregistered
  * User should be able to manually check at all times
  * Notify application updates when available
* render/
  * Need to handle errors
  * Need to relay voter status through better means
  * Show additional information after manual lookup, such as disenfranchisement numbers
