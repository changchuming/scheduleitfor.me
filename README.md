# Build Instructions
Step 1. Install missing packages and dependencies
```
> npm install
> bower install
```

Step 2. Edit `./gulp/config.json` to indicate whether you are using Visual Studio

```
{
    // Other Stuff Above
    "isVisualStudio" : true // Indicate whether you are using VisualStudio typescript or not.
}
```

Step 3. Build Files and Start Watch

Type the following :

```
gulp
```

in the console. This will build your typescript and SASS files and compile them. It will also watch the directory for changes and recompile them when changes are made automatically.

Step 4. Run redis
You need to start an instance of redis. On windows, redis can be found at this [link]().

Step 5. Run the app
Type: `node app` in the console.

Step 6. (Optional) Enable Livereload
If you have Google Chrome installed, you can install the Livereload extension at the following [link](). After installation, the website will refresh anytime changes are made.

# App Architecture

scheduleitfor.me is built using the following tools:

*   Web Framework: Express
*   HTML Template: Jade
*   Module Architecture: Browserify
*   Javascript Dialect: Typescript
*   CSS Preprocessor: SASS
*   Dependency Management: Bower

# File Structure
The application is structured in the following manner:

```
scheduleitfor.me
    - public // Production version of front end files

    - server // Server code
        - routes // Express routing

    - web //
        - views
        - ts // Script files for Respective Views
        - scss // Styles for Respective Views
        - js // Temporary folder for compilation of Typescript Files

    - app.js // Starting point for the entire application
```

# Scheduler
Scheduleitfor.me helps you to schedule your events effortlessly. Select a range of dates, share the link generated, and view the results in real-time! Set up a schedule in under ten seconds using our click and drag interface.


## Usage
The scheduling app is hosted [here](http://scheduleitfor.me).

###Create a schedule
1. Drag to select the range of dates that the participants can vote for.
2. Click 'Create' to get the generated link and share it with your friends!

Optionally, you can also:
1. Fill in the title and details of your event.
2. Select the length of the event by dragging the slider.
3. Select whether you want the participants to vote anonymously and whether each IP is limited to one vote.

###Vote
1. Fill in your name if required.
2. Click or drag to select the range of dates that you are available on.
3. Click 'Submit' to vote!

###Results
Click 'Details' to get the names of participants for each available date.
## Developing
You can contact [Chu-Ming](mailto:changchuming@gmail.com) with any queries on development.
Scheduleitfor.me is made by [Chu-Ming](changchuming.github.io) with the help of [Kiang Teng](http://kiangtengl.github.io/). Special thanks to [Shifeng](https://www.facebook.com/sfillustrations) for designing the logo.

## Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
