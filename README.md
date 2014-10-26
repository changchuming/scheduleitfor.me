# Build Instructions
Step 1: Install missing packages and dependencies
```
> npm install
> bower install
```
Step 2: Build Files and Start Watch

Type the following :

```
gulp
```

in the console. This will build your typescript and SASS files and compile them. It will also watch the directory for changes and recompile them when changes are made automatically.

Step 3: Run redis
You need to start an instance of redis. On windows, redis can be found at this [link]().

Step 4: Run the app
Type: `node app` in the console.

Step 5: (Optional) Enable Livereload
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
scheduleitforme
    - public // Production version of front end files

    - server // Server code
        - routes // Express routing

    - web //
        - views
        - ts // Script files for Respective Views
        - scss // Styles for Respective Views
        - temp // Temporary folder for compilation of various files

    - app.js // Starting point for the entire application
```

# Scheduler


## Usage



## Developing



### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
