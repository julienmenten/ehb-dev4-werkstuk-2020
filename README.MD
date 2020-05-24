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
### The current app

- Homepage: This simple homepage has multiple functions, it gives a small description of the service in the header, a catalog of all their videos alongside a practical search functionality & small form to ask for feedback. 

- The video catalog and search function are on every page of the website. You can search by typing, by age group & by genre. There is a maximum of 15 videos displayed, to see the next 15, we have to navigate with the buttons on the bottom of the catalog, which DON'T refresh the page. 

- When pressing on a video, we surf to a page which regroups all the information of the video itself. 

- Other pages: "Gebruikersvoorwaarden", "Over ons" and a "not-found" page. All these re-use the video catalog and filter.

### Data, functions & Flow
Data:
- Video object 
Functions: 
- Creating the catalog
- Filtering the catalog
- 
Flow: 


### Let's get to work! 
 1. ### **Cloning and setting up the workspace:**
    - I clone the repository to my computer and open the folder in VS Code 
    - I use the following command to install the dependancies delivered in the 'package.json' file:
        ```
        npm install
        ```

    - The workspace is ready to go!

2. ### **HTML & CSS: Let's get SASS-y!**
    - First step was to fill the HTML with the main content

    - I am going to use [SASS](https://sass-lang.com/) as styling language
        -  It requires a few more steps to get it started: 
            1. create a .sass file 

            2. Compile the code to a usable .css file 

                There are multiple ways of doing it, I use [the Koala App](http://koala-app.com/) because it is easy to use and refreshes automatically. Extra tip: VS Code has a great extension. 
                Both solutions also give you error messages when it compiles when it finds one.
                
            3. Link the compiled .css file in your HTML

            4. I recreated the style of the original website as much as possible.
3. ### **Back-End - It's scripting time!**
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
                    // Other data that will be sent to the ejs file to process
                })

        Now let's imagine a use case where we want to find a video that wa saw a few months ago, however that video is not on our website anymore, we have to be able to handle that kind of errors. 
        
        Let's upgrade our previous function to handle unexisting or removed videos. 

            // Send result page to user 
            if(notFound == false){
                console.log("Video: " + videoData.name)
                res.render('video-template', {
                    found: true,
                    title: videoData.name,
                    metadata: videoData["link-to-video"].metadata,
                    videoLink:videoData["link-to-video"].metadata.html,
                    keyTakeaways: videoData["key-takeaways"],
                    description: videoData["video-notes"]
                    // Add more data to send to front end template
                })
            // In case there is no video matching with our query
            }else{
                console.log("No video found")
                res.render('video-template', {
                    found: false
                })
            }

        If our video has been found, it will send all the required data we want to display on the front-end and a **found** boolean for our front-end page to use. **found** will be used later to decide which partial we show on the video details page. 

4. ### **Front-end: The return of the (Java)Script!**
    For the front end I used ejs to render the different pages of the website. This allows me to build dynamic pages without having to copy code on all the webpages. 

    I have 4 main pages: 
    - The Homepage - index.ejs 
    - Over ons - over-ons.ejs
    - Gebruikersvoorwaarden - gebruikersvoorwaarden.ejs 
    - The video page - video-template.ejs

    Alongside my webpages, I used partials to easily re-use page sections
    ![Partials image](https://github.com/julienmenten/ehb-dev4-werkstuk-2020/blob/master/README_pictures/partials.png)

    The **navigation** **footer** & **videoCatalog** are all used on all pages of the website. To display them on my webpages, I simply use this short in between my html code to call them up from the **partials** folder

         <%- include('partials/PARTIAL_NAME.ejs') %>

    A partial is plain HTML code. and when included with the **<%- include %>** command, is treated as such. 
    
    Ejs has multiple ways of interacting with HTML. We can also use it to verify our incomming data from the webserver. My best example: the video detail page.

    Each video has it's own detail page, and like previously mentioned, making one for each video, might take a while. This is why I chose to use ejs in the first place! 
    EJS allows me to use the response data my Node server sends back when I call it in the URL:

        localhost:8000/video/VIDEO_NAME
    
    And use it later in my HTML: 

       <title> <%= title %> - Podium Aan Huis </title>
    
    Example:

        localhost:8000/video/Edith!

    Will give me a web page with the desired information I want: 

    ![Edith](https://github.com/julienmenten/ehb-dev4-werkstuk-2020/blob/master/README_pictures/edith.png)

    Let's come back to our handling of unexisting or removed videos. Remember how we sent an object with an argument called **found**, well now it's time to use it! 

    With the help of EJS, we can create a simple IF-ELSE structure that will check the **found** argument. If found == true, then we get to see the page of the video we wanted to learn more of and watch.

        <% if(found == true){ %>
            <%- include('partials/video-detail.ejs') %>
        <% } else{ %>
            <%- include('partials/not-found.ejs') %>
        <% } %>

    If the video does not exist in our list of entries, we get redirected to a page with the following message:

    ![Page not found](https://github.com/julienmenten/ehb-dev4-werkstuk-2020/blob/master/README_pictures/not_found.png)

    ### The video catalog 

     **The Searchbar**

    By far the simpliest of the functions from the catalog, the goal is to search for videos in our list of videos.

    It exists out of 3 parts: 

    1. #### The search function itself #####
        With this function we basically refresh the query each time a key is pressed. With each keypress we execute the **showSearchResults()** function

           function searchVideo(){
                var searchBar = document.getElementById("zoekbalk");
                searchBar.onkeyup = function(){
                    var searchQuery = searchBar.value
                    if(searchQuery == "" || searchQuery == " "){
                        let resultContainer = document.getElementById('zoekbalkResults')
                        resultContainer.innerHTML = ""
                    }else{
                        showSearchResults(searchQuery);
                    } 
                }
            }

    2. #### **showSearchResults()**: The function that displays the results for the query 

        This is the function that is called everytime a key is pressed in the previous function. It will loop through all the videos in the global **const allVideos** array. Once it finds a match it creates a new div and inserts the result from the **video.createSearchResult()** function in that div, then it appends the video to the result container. 

            function showSearchResults(query){
                // result HAS to contain the query, wherever it is
                let resultContainer = document.getElementById('zoekbalkResults')
                resultContainer.innerHTML = ""
                allVideos.forEach(video => {
                    let videoName = video.name
                    let lowerCaseName = videoName.toLowerCase()
                    if(lowerCaseName.includes(query.toLowerCase())){
                        var newLink = document.createElement('div')
                        newLink.classList.add('searchResultCardcontainer')
                        newLink.innerHTML = video.createSearchResult()
                        resultContainer.appendChild(newLink)
                        }
                    })
                }

    3. The previously made **Video** class 

        Everytime a video matches the search query we use the **createSearchResult()** from our video class, as every video in allVideos is already converted to a Video object. This function returns a template literal with the HTML structure already made for us to use.

            createSearchResult(){
            return `
            <a href="http://HOST/video/${this.name}" class="searchResultVideoCard">
                <div class="searchResultCardImageContainer">
                    
                    <img src="${this.thumbnail}">
                    <div></div>
                </div>
                <div class="searchResultCardTextContainer">
                    <h3>${this.name}</h3> 
                    <p>${this.excerpt}</p>
                    ${this.checkForUndefined(this.recordedAt)}     
                </div>
            </a>`
        }

    **Creating the catalog**

    1. Loading all videos
    
        The first step is to load the videos. I use a simple ajax call with jquery and save the data in a new array to be able to re-use later. 

            async function ajaxVideos(){
                var videos; 
                    await $.ajax({
                        url: url,
                        method: 'GET',
                        dataType: 'json'
                    }).done(function(data){
                        videos = data;

                    }).fail(function(a,b){
                        console.log(a,b);
                    })
                    return videos ;
                }


    2. Filter ready 

        We then split the videos in different genres so it makes it easier for us to filter them later on with the filter. We have 2 arrays: 1 with all our videos, and a second one with the genres from those videos. We then sort them in the genres they belong too. the **genres** is an array of objects. Each object has a name and an array of all the videos belonging to that genre. We fill those videos with following function: 

            async function sortToGenre(videos, genres){
                await videos.forEach(video => {
                        genres.forEach(category => {
                            if(video.genre == category.catName){
                                category.videos.push(video)
                            }
                        })
                    })
                }

    3. Splitting in pages

        Loading 100 video cards on 1 page would not be pretty, this is why we want to split all the videos that are displayed, whether a filter is applied or not. To do this, we will split an array in to a dyncamic amount of sub-arrays of maximum 15 videos. 

             // Empty array to refill the page with our results
            pages = [];
            // Fill the pages with the results
            var videoCount = 0;
            var pageCount = 0
            pages[pageCount] = []
        
            
            filterResult.forEach(video =>{
                let newArray = pages[pageCount]
                if(videoCount != maxVideosInCatalog){ 
                    newArray.push(video)
                    videoCount++;
                }else{
                    //reset
                    videoCount = 0;
                    pageCount ++; 
                    pages[pageCount] = []
                    pages[pageCount].push(video)
                    videoCount++
                }
            })
    
        **filterResult** can be any other array, but this code is small part of the **filterCatalog()** function. 

        To display the pages and be able to navigate throught them we use the function **createPage()** which has 2 parameters: the array of pages and the page we want to display.

            function createPage(pagesArray, pageNumber) { 
                // Clear the container 
                var container = document.getElementById('videoCatalog')
                container.innerHTML = "";
                // Display amount of pages on the bottom section of the catalog
                var pagesAmount = pagesArray.length
                $('#videoCatalogMaxPages').text(pagesAmount)
                if(pagesAmount == 1 ){
                    var nextButton = document.getElementById('videoCatalogNext')
                    nextButton.disabled = true;
                    resetCurrentPageNumber()
                }else{
                    var nextButton = document.getElementById('videoCatalogNext')
                    nextButton.disabled = false;
                }
                // Display all videos of a page
                var selectedPage = pagesArray[pageNumber]
                selectedPage.forEach(video => {
                    $('.videoCatalog').append(video.createThumbnailInCatalog())
                });
            }

    **The Filter**

   -  Time for the big boy: **The filter!** 
    Lets try and decode the different steps of this function:
    
    1.  We have to create our physical buttons: 
            
            function createGenreButtons(genres){
                var genreButtonsContainer = document.getElementById('genreButtonsContainer')
                genres.forEach(genre => {
                    let buttonLabel = genre.catName;
                    let buttonAmount = genre["videos"].length
                    let newButtonGroup = document.createElement('div')
                    newButtonGroup.classList.add('filterBtnWrapper')
                    // Label van knop aanmaken
                    let newButtonLabel = document.createElement('label')
                    newButtonLabel.id =  buttonLabel + 'lbl'
                    newButtonLabel.innerHTML = `${buttonLabel} (${buttonAmount})`
                    newButtonLabel.classList.add('filterBtn')
                    // Checkbox maken
                    let newButton = document.createElement('input')
                    newButtonLabel.htmlFor = buttonLabel;
                    newButton.type = "checkbox"
                    newButton.name = buttonLabel
                    newButton.value = buttonLabel
                    newButton.id = buttonLabel
                    newButton.style = "display:none"
                    newButton.onchange = function(){
                        setFilterBtnStatus(newButton)
                    }
                    newButtonGroup.appendChild(newButtonLabel)
                    newButtonGroup.appendChild(newButton)
                    genreButtonsContainer.appendChild(newButtonGroup)
                })
            }
        The same code is applied for the categories.

        _Easy so far._

    2. Each button has a function called **setFilterBtnStatus(newButton)**. 
    
        This function has multiple uses: it changes the style depending on if the checkbox is checked or not, and calls the **updateVideosCatalog()** function to update the filter results.
    
    3. Updating the catalog: **updateVideosCatalog()**

        This one does a lot! First of all, it checks which filters are checked and saves them in the **filter** object. Then we check if the filter is empty or not. If it isn't we go to the next function, otherwise we just fill the catalog with all the videos.

            async function updateVideosCatalog(){
                // Select the buttons container from the HTML page
                var genreButtonsList = document.getElementById('genreButtonsContainer')
                var genreButtonsContainers = genreButtonsList.childNodes;
                var categorieButtonsList = document.getElementById('categoriesButtonsContainer');
                var categorieButtonsContainers = categorieButtonsList.childNodes;
                //
                var filterGenres = filter.genres
                var filterCategories = filter.categories
                // Reset the filter 
                filterGenres = []
                filterCategories = []
                var checkedButtons = []
            
                // Fill the filter with the selected buttons
                genreButtonsContainers.forEach(element => {
                    var checkbox = element.childNodes[1]
                    if(checkbox != undefined){
                    if(checkbox.checked){
                        checkedButtons.push(checkbox.id)
                        filterGenres.push(checkbox.id)
                    }
                    }
                });
                categorieButtonsContainers.forEach(element => {
                    var checkbox = element.childNodes[1]
                    if(checkbox != undefined){
                    if(checkbox.checked){
                        checkedButtons.push(checkbox.id)
                        filterCategories.push(checkbox.id)
                    }
                    }
                
                });
                // Plaats de waarden van de filter in het filter object 
                filter.genres = filterGenres 
                filter.categories = filterCategories

                if(checkedButtons.length > 0){
                    filterCatalog(filter, genres)
                
                }else{
                    var data = await ajaxVideos()
                    resetCatalog(data);
                    hideClearFilterButton();
                }
            }

        4. Applying the filters and displaying the results

                    function filterCatalog(filter, genres){
                        var selectedCategories = filter.categories;
                        var selectedGenres = filter.genres
                        var filterResult = []
                        // Only categories have been selected
                        if(selectedCategories.length != 0 && selectedGenres.length == 0){
                            genres.forEach(genre => {
                                var videos = genre.videos
                                videos.forEach(video => {
                                    selectedCategories.forEach(category => {
                                        if(video.category == category){
                                            filterResult = filterResult.concat(video)
                                            testNumber++;
                                        }
                                    })
                                })
                            })
                        }
                        // Only genres gave been selected
                        else if(selectedCategories.length == 0 && selectedGenres.length != 0){
                            genres.forEach(genre => {
                                selectedGenres.forEach(btn => {
                                    if(genre.catName == btn){
                                        filterResult = filterResult.concat(genre.videos)
                                    }
                                }) 
                            })
                        }
                        // Both Genres and categories have at least 1 selected value
                        else{
                            genres.forEach(genre => {
                                var videos = genre.videos
                                videos.forEach(video => {
                                    selectedGenres.forEach(selectedGenre => {
                                        selectedCategories.forEach(selectedCategory => {
                                            if(video.category == selectedCategory && video.genre == selectedGenre){
                                                filterResult = filterResult.concat(video)
                                            }
                                        })
                                    })
                                })
                            })
                        }

                        // Weergeven van gefilterde videos op de pagina 
                        // Empty array to refill the page with our results
                        pages = [];
                        // Fill the pages with the results
                        var videoCount = 0;
                        var pageCount = 0
                        pages[pageCount] = []
                    
                        
                        filterResult.forEach(video =>{
                            let newArray = pages[pageCount]
                            if(videoCount != maxVideosInCatalog){ 
                                newArray.push(video)
                                videoCount++;
                            }else{
                                //reset
                                videoCount = 0;
                                pageCount ++; 
                                pages[pageCount] = []
                                pages[pageCount].push(video)
                                videoCount++
                            }
                        })
                        resetCurrentPageNumber()
                        createPage(pages, 0)
                        showClearFilterButton()
                    }

            This function is also a beast compared to the others. First of, we retrieve the filter object and splits it on **selectedGenres** and **selectedCategories**. Then, it goes to the if - else-if - else structure and controls which one of the arguments is **true**. We then compare all the videos and check if they match the requirements and push them to the **filterResult** array. 

            After we have our filter results, it's time to display them in the catalog. At first we split our results in pages and then display them with the **createPage()** function. 

            It also displays the clear filter button. 
5. ### **Testing**  

6. ### **Starting the website**
    To browse the website, open the folder where the **index.js** file is located in with your terminal. Use the following command to start the webserver: 
    ````
    node index.js
    ````
    & browse to http://localhost:8000/

    Have fun browsing! 


