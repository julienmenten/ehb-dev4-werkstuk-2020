# Development 4: Opdracht Werkstuk

## Short
Podiumaanhuis.be is a new website that offers full video's of theater pieces. It's created very quickly using Webflow, a  very simple website creating platform. Now the organisation wants to recreate the app from scratch, using HTML, CSS and Javascript.

One feature is the option to filter the video entries based on genres and audience. Using the JSON fetch the entries, show them on the page, and recreate the filter like it is presented on podiumaanhuis.be.

## Requirements
- Write out your approach in the readme.md file. Do a functional analysis of the existing app. Plan your data, functions and the flow of your app.
- It must work. This is the most important requirement. Don't worry too much about clean code or functional programming in the beginning. Create the app, and iterate.
- Push your iterations to github.
- Try to make your code as functional & pure as possible.
- Try to avoid side effects as much as possible.
- Write tests for at least 2 functions
- Show the result on the webpage
- COMMENTS COMMENTS COMMENTS

## Resources
https://www.podiumaanhuis.be/

https://github.com/pmcp/ehbdev4werkstuk

https://docs.google.com/presentation/d/1tlhfJPTmw0MP4kfKSdszo4bUSKwG9xRcuSmzhbkiNaw/edit?usp=sharing

 ## My approach:

 1. Cloning and setting up the workspace: 
    - I clone the repository to my computer and open the folder in VS Code 
    - I use the following command to install the dependancies delivered in the 'package.json' file:
        ```
        npm install
        ```

    - The workspace is ready to go!

2. Basic HTML and SASS 
    - First step was to fill the HTML with the main content

    - I am going to use SASS as styling language
        -  It requires a few more steps to get it started: 
            1. create a .sass file 

            2. Compile the code to a usable .css file 

                - There are multiple ways of doing it, I use [the Koala App](http://koala-app.com/) because it is easy to use and refreshes automatically.
                
            3. Link the compiled .css file in your HTML
3. It's scripting time!