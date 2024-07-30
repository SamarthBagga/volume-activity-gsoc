# GSOC Project 1
This is an activity for the Sugarizer Platform. Built using Threejs to render the 3D scene and Cannon-es to add real world physics. This activity will help children visualize and play around with different types of volumes. To Run the application you can follow the following steps - 

If you're a developer you could also launch Sugarizer desktop application using [electron](https://github.com/electron/electron). First, install Node.js and npm on your computer. See [here](http://nodejs.org/) for more information. Then install electron and specific modules for Sugarizer by running:

	npm install

Then launch Sugarizer for GNU Linux with:

	npm start > /dev/null

Or, for Mac OS/Windows, just:

	npm start

You could use Sugarizer desktop arguments using "--" after start. For example:

	npm start -- --window

To run locally **Sugarizer Application into the Web Browser** (GNU Linux/Mac OS/Windows), you should launch it with a special option to enable access to local files.

For **Chrome**, close ALL running instances of Chrome and re-launch it using the command line:

 	chrome --allow-file-access-from-files file:\\\<Directory>\sugarizer\index.html

In the path above, `<Directory>` is where you have stored/cloned your sugarizer repo into.

In Windows, \ is the way path is written and / is the way for Linux/MacOS backward and forward slashes differ here, hence path for Linux/MacOS will be:

	chrome --allow-file-access-from-files file:///<Directory>/sugarizer/index.html
On Windows, you should launch:

	"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --allow-file-access-from-files <path>

On Mac OS, you should launch:

	open -n /Applications/Google\ Chrome.app --args --allow-file-access-from-files <path>

On Linux, you should launch:

	google-chrome-stable --allow-file-access-from-files <path>

> Note: `google-chrome-stable` is the name of Chrome in Ubuntu but it could be different on other distribution, you can get the package-name for Chrome by running `sudo dpkg -l | grep chrome`

For **Firefox**, type in the address bar:

    about:config

Search for the `security.fileuri.strict_origin_policy` parameter and
set it to `false`.

For **Safari** go to the `Safari/Preferences...` menu, under Advanced panel check the *Show develop menu in menu bar* box. Then from the `Develop` menu, select *Disable local file restrictions*.

![image](https://github.com/user-attachments/assets/f4a0e980-12a4-4d42-aa7b-3bd924f4ab4c)
