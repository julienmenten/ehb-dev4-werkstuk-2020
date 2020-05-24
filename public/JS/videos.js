
// Globale variabelen
const url = "http://localhost:8000/videoAPI"
const maxVideosInCatalog = 15;
var pages = [];
const allVideos = [];
const categories = ["volwassenen", "familie"]
var genres = [];
const filter = {
    genres: [],
    categories: []
};
var currentPage = 1;

var shownVideos = []

$(function(){
   onLoad();
   searchVideo()
})
function onLoad(){
    loadVideos("all", 'all')
    loadSavedPage()
    createCategoryButtons(categories)
}
// Script dat alle videos laad vanuit de JSON/API
async function loadVideos(ageGroup, filters){
        var data = await ajaxVideos();
        var videoCount = 0;
        var pageCount = 0;
        pages[pageCount] = []
        
       data.forEach(element => {  
        let newArray = pages[pageCount]
        let metadata = element["link-to-video"]["metadata"];
                let name = element.name;
                let author = metadata.author_name;
                let duration = element["video-length"];
                let genre = element["genre-v2"];
                let thumbnail = element.thumbnail.url;
                let category = element.category
                let excerpt = element.excerpt 
                let recordedAt = element["recorded-at"]
                
                let newVideo = new Video(name, author, duration, genre, category, thumbnail, excerpt, recordedAt)
            if(videoCount != maxVideosInCatalog){
                
                newArray.push(newVideo)
                allVideos.push(newVideo)
                videoCount++;
            }else{
                //reset
                videoCount = 0;
                pageCount ++ 
                pages[pageCount] = []

                pages[pageCount].push(newVideo)
                allVideos.push(newVideo)
                videoCount++
            }
           
            genres.push({catName: element["genre-v2"], 
                            videos: []})
            genres = getUniqueArray(genres, ['catName'])

        });
        
        sortToGenre(allVideos, genres)
        createPage(pages, 0)
        createGenreButtons(genres)    

}
// Ajax call naar /videoAPI
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

function resetCatalog(data){
   
        var videoCount = 0;
        var pageCount = 0;
        pages[pageCount] = []
        
       data.forEach(element => {  
        let newArray = pages[pageCount]
        let metadata = element["link-to-video"]["metadata"];
        let name = element.name;
        let author = metadata.author_name;
        let duration = element["video-length"];
        let genre = element["genre-v2"];
        let thumbnail = element.thumbnail.url;
        let category = element.category
        let excerpt = element.excerpt 
        let recordedAt = element["recorded-at"]
        
        let newVideo = new Video(name, author, duration, genre, category, thumbnail, excerpt, recordedAt)
            if(videoCount != maxVideosInCatalog){
                
                newArray.push(newVideo)
               
                videoCount++;
            }else{
                //reset
                videoCount = 0;
                pageCount ++ 
                pages[pageCount] = []

                pages[pageCount].push(newVideo)
               
                videoCount++
            }
        });
        
        createPage(pages, 0)
       
}

async function sortToGenre(videos, genres){
   await videos.forEach(video => {
        genres.forEach(category => {
            if(video.genre == category.catName){
                category.videos.push(video)
            }
        })
    })
}

// Filter the catalog -> filter is an object with 2 arrays with the name "categories" & "genres"
function filterCatalog(filter, genres){
    var testNumber = 0
    var selectedCategories = filter.categories;
    var selectedGenres = filter.genres
    var filterResult = []
    // Enkel Categories zijn geselecteerd
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
    // Enkel Genres zijn geselecteerd
    else if(selectedCategories.length == 0 && selectedGenres.length != 0){
        genres.forEach(genre => {
            selectedGenres.forEach(btn => {
                if(genre.catName == btn){
                    filterResult = filterResult.concat(genre.videos)
                }
            }) 
        })
    }
    // Beide filtertypes zijn aangeuid 
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

// Functie om dynamisch knoppen aan te maken voor elke genre
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

// Create buttons for each category
function createCategoryButtons(categories){
    var categoriesButtonsContainer = document.getElementById('categoriesButtonsContainer')
    categories.forEach(genre => {
        let buttonLabel = genre;
        let newButtonGroup = document.createElement('div')
        newButtonGroup.classList.add('filterBtnWrapper')
        // Label van knop aanmaken
        let newButtonLabel = document.createElement('label')
        newButtonLabel.id =  buttonLabel + 'lbl'
        newButtonLabel.innerHTML = `${buttonLabel}`
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
        categoriesButtonsContainer.appendChild(newButtonGroup)
    })
}
// "Wis filters" knop vertonen
function showClearFilterButton(){
    var clearButton = document.getElementById('filtersWisKnop')
    clearButton.style.display = "block"

}
// "Wis filters" knop verstoppen
function hideClearFilterButton(){
    var clearButton = document.getElementById('filtersWisKnop')
    clearButton.style.display = "none"

}

function filtersWissen(){
    var genreButtonsList = document.getElementById('genreButtonsContainer')
    var genreButtonsContainers = genreButtonsList.childNodes;
    var categorieButtonsList = document.getElementById('categoriesButtonsContainer');
    var categorieButtonsContainers = categorieButtonsList.childNodes;
    console.log(categorieButtonsContainers)
    genreButtonsContainers.forEach(btn => {
       var checkbox = btn.childNodes[1]
       console.log(btn)
       checkbox.checked = false;
       setFilterBtnStatus(checkbox)
    })
    categorieButtonsContainers.forEach(btn => {
        var checkbox = btn.childNodes[1]
        console.log(btn)
        checkbox.checked = false;
        setFilterBtnStatus(checkbox)
     })
    filter.categories = [];
    filter.genres = [];
    console.log(filter)
    hideClearFilterButton();
    updateVideosCatalog();
}
// Update de status van de knop en de catalog 
function setFilterBtnStatus(button){
    let label = button.id + "lbl"
    let htmlLabel = document.getElementById(label)
    if(button.checked){
        
        htmlLabel.classList.add('activeFilterBtn')
    }else{
        htmlLabel.classList.remove('activeFilterBtn')
    }
    updateVideosCatalog()
}

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
// Verdelen over paginas van catalog
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
// Bring currentPAge to 1 and update the button'state
function resetCurrentPageNumber(){
    currentPage = 1
    var resetPagenumber = document.getElementById('videoCatalogCurrentPage')
    resetPagenumber.innerHTML = currentPage
    updateButtonState(currentPage)
}
// Use the buttons to navigate through the pages
function navigateCatalog(direction){
    var minimumPages = 1;
    var maximumPages = pages.length;
    
    if(direction == "prev" && currentPage > minimumPages){
       
        $('.videoCatalog').empty()
        currentPage--
        pages[currentPage-1].forEach(video => {
            $('.videoCatalog').append(video.createThumbnailInCatalog())
       });
    }else if(direction == "next" && currentPage <= maximumPages){
        $('.videoCatalog').empty()
        currentPage++
        pages[currentPage-1].forEach(video => {
            $('.videoCatalog').append(video.createThumbnailInCatalog())
       });
    }else{
        // Do nothing 
    }
    updateButtonState(currentPage)
    updatePageNumber(currentPage)
}
// Knoppen updaten zodat ze op tijd gedisabled zijn -> Kunnen niet out of bounds gaan 
function updateButtonState(currentPage){
    var prevButton = document.getElementById('videoCatalogPrevious')
    var nextButton = document.getElementById('videoCatalogNext')
    
    if(currentPage === 1){
        prevButton.disabled = true
    }else if(currentPage === pages.length){
        nextButton.disabled = true
    }else{
        prevButton.disabled = false
        nextButton.disabled = false
    }
   
}
// Pagina tussen de 2 knoppen updaten
function updatePageNumber(currentPage){
    $("#videoCatalogCurrentPage").text(currentPage)
}
// Inladen van de opgeslaagde pagina zodat wanneer men naar een andere webpagina gaat, we nog steeds op dezelfde 'pagina' zitten
function loadSavedPage(){
    updatePageNumber(currentPage)
    updateButtonState(currentPage)
}
// Script voor filteren van de kaarten

// Script voor zoeken van video door typen
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
class Video {
    constructor(name, author, duration, genre, category, thumbnail, excerpt, recordedAt) {
        this.name = name;
        this.author = author;
        this.duration = duration;
        this.genre = genre;
        this.thumbnail = thumbnail;
        this.category = category
        this.excerpt = excerpt
        this.recordedAt = recordedAt
    }
    // Script dat kaartjes maakt per video
    createThumbnailInCatalog(){
        return `
           <a href="http://localhost:8000/video/${this.name}" class="videoCard">
            <article>
                <div class="videoThumbnailImageContainer">
                        <div>
                            <p class="videoThumbnailGenre">${this.genre}</p>
                        </div>
                    <img src="${this.thumbnail}">
                </div>
               
                <div class="videoThumbnailInfoContainer">
                    <div class="videoThumbnailPlayBtn">
                        <div class="videoCatalogPlayIcon"></div>
                    </div>
                    <div class="videoThumbnailInfo">
                        <h3>${this.name}</h3>
                        <p>${this.excerpt}</p>  
                        ${this.checkForUndefined(this.recordedAt)}  
                        <div class="v">
                            ${this.checkForUndefined(this.duration)}
                        </div>            
                    </div>
                </div>
            </article>
           </a>
        `
    }
    createSearchResult(){
        return `
        <a href="http://localhost:8000/video/${this.name}" class="searchResultVideoCard">
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
    checkForUndefined(toCheck){
        if(toCheck == undefined || toCheck == "undefined"){
            return ``;
        }else{
            return `<p>${toCheck}</p>`
        }
    }
}


function getUniqueArray(arr=[], compareProps=[]) {
    let modifiedArray= [];
    if(compareProps.length === 0 && arr.length > 0)
     compareProps.push(...Object.keys(arr[0]));
       arr.map(item=> {
     if(modifiedArray.length === 0){
      modifiedArray.push(item);
     }else {
      if(!modifiedArray.some(item2=> 
      compareProps.every(eachProps=> item2[eachProps] === item[eachProps])
    )){modifiedArray.push(item);}
   }
    });return modifiedArray;
   }

