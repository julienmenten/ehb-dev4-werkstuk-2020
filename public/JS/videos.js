
// Globale variabelen
const url = "http://localhost:8000/videoAPI"
const maxVideosInCatalog = 15;
const pages = [];
const allVideos = []
var categories = [];
var currentPage = 1;

$(function(){
   onLoad();
   searchVideo()
})
function onLoad(){
    loadVideos("all", 'all')
    loadSavedPage()
}
// Script dat alle videos laad vanuit de JSON/API
async function loadVideos(ageGroup, filters){
   
    await $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json'
    }).done(function(data){
        var videoCount = 0;
        var pageCount = 0;
        pages[pageCount] = []
        
       data.forEach(element => {  
        let newArray = pages[pageCount]
            if(videoCount != maxVideosInCatalog){
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
                newArray.push(newVideo)
                allVideos.push(newVideo)
                videoCount++;
            }else{
                //reset
                videoCount = 0;
                pageCount ++ 
                pages[pageCount] = []
            
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
                pages[pageCount].push(newVideo)
                allVideos.push(newVideo)
                videoCount++
            }
           
            categories.push(element["genre-v2"])
            categories = getUniqueArray(categories)

        });
        console.log(categories)
        createPage(pages, 0)
    }).fail(function(a,b){
        console.log(a,b)
    }) 
}

// Verdelen over paginas van catalog
function createPage(pagesArray, pageNumber) { 
    // Display amount of pages on the bottom section of the catalog
    var pagesAmount = pagesArray.length
    $('#videoCatalogMaxPages').text(pagesAmount)
    // Display all videos of a page
    var selectedPage = pagesArray[pageNumber]
    selectedPage.forEach(video => {
         $('.videoCatalog').append(video.createThumbnailInCatalog())
    });
}

function navigateCatalog(direction){
    var minimumPages = 0;
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
    }else if(currentPage == pages.length){
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

