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

## My approach
DISCLAIMER: My documentation and comments are both in English and Dutch, this is because my brain thinks in 3 languages at the same time and sometimes, it gets messy!
### The current app

- Homepage: This simple homepage has multiple functions, it gives a small description of the service in the header, a catalog of all their videos alongside a practical search functionality & small form to ask for feedback. 

- The video catalog and search function are on every page of the website. You can search by typing, by age group & by genre. There is a maximum of 15 videos displayed, to see the next 15, we have to navigate with the buttons on the bottom of the catalog, which DON'T refresh the page. 

- When pressing on a video, we are transported to a page which regroups all the information of the video itself. 

### Data, functions & Flow
Data:
- Video object 
Functions: 
- Creating the catalog
- Filtering the catalog
- 
Flow: 


### Let's get to work! 
 1. #### Cloning and setting up the workspace: 
    - I clone the repository to my computer and open the folder in VS Code 
    - I use the following command to install the dependancies delivered in the 'package.json' file:
        ```
        npm install
        ```

    - The workspace is ready to go!

2. #### HTML & CSS: Let's get SASS-y! 
    - First step was to fill the HTML with the main content

    - I am going to use [SASS](https://sass-lang.com/) as styling language
        -  It requires a few more steps to get it started: 
            1. create a .sass file 

            2. Compile the code to a usable .css file 

                There are multiple ways of doing it, I use [the Koala App](http://koala-app.com/) because it is easy to use and refreshes automatically.
                
            3. Link the compiled .css file in your HTML
            
3. #### Back-End - It's scripting time!
    - Using Express to make a webserver & templating with EJS

        In order for my website to work, I opted to work with [Express](https://expressjs.com/), which is a powerful web framework with Node that I know how to work with. To display my pages, I am using [EJS](https://ejs.co/).
        I wrote a simple webserver alongside the different pages that the website had: 
            
            // Folder van mijn templates/views kiezen
            app.set('views', './views');
            // De view engine initializeren op EJS
            app.set('view engine', 'ejs');
            // Static files zoals CSS, IMAGES routen via epxress static
            app.use(express.static(path.join(__dirname, 'public')));


            // Homepage index 
            app.get('/', (req, res) => res.render('index'));


            // Over ons pagina
            app.get('/over-dit-initiatief', (req, res) => res.render('over-ons')) 

            // Gebruiksvoorwaarden pagina
            app.get('/gebruiksvoorwaarden', (req, res) => res.render('gebruiksvoorwaarden')) 


            // Start server
            app.listen(port)

    -   API with all the videos 

        Alongside my webserver, I also wrote a short small API for all the video entries so that I can easily acces it on my front-end. This also allows me to change it later once, instead of having to hunt down the ajax call on each page of my front-end.

            
            // Eigen video API 
            const data = require(__dirname + '/entries.json')
            app.get('/videoAPI', (req, res) => {
                res.header("Content-Type",'application/json');
                res.send(JSON.stringify(data.items));
            })

    - Creating dynamic pages for videos  

        Each video has to have a webpage with extra information about the video. However, instead of making 100 different static webpages per video, which would take days of work, I am going to use **1 template** that will be filled with the data of the video we pressed on. 

        Let's start decoding my code: 

            // Template pagina voor meer info over video
            app.get('/video/:name', (req, res) => {
                const videoName =  req.params.name;
                const data = require(__dirname + '/entries.json');
                const videoArray = data.items;
                var videoData;
                // Find the correct video data by looping through all videos
                for(let video of videoArray){
                    if(video.name == videoName){
                        videoData = video;
                    }
                };
                // Send result page to user 
                console.log(videoData.name);
                res.render('video-template', {
                    title: videoData.name
                    // Add more data to send to front end template
                })
            })

        First, we have to decide which video we want to read more about. I simply pass through an **id**, or in this case, a **name**. "**:name**" Is called a **parameter**. I want to use that parameter to find the corresponding object in the list of entries. To make it easier to understand, I create a variable to use later called **videoName**. 

            const videoName =  req.params.name;

        I then use that variable to loop through the _entries.json file_. 

                for(let video of videoArray)

        Once I found the corresponding object, I make a new object with all the information I want to display on the page and render it with EJS.

            res.render('video-template', {
                    title: videoData.name
                    // Add more data to send to front end template
                })

4. #### Front-end: The return of the (Java)Script!
- Pages and ejs structure
    Homepage
    video detail page
    about us 
    gebruikersvoorwaarden
- Creating a Video object
- Filling the catalog
- Searching and filtering
5. #### Testing 