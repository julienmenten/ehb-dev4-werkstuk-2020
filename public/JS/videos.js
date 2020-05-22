
// Globale variabelen
const url = "http://localhost:8000/videoAPI"
const maxVideosInCatalog = 15;
const pages = []
var currentPage = 1;

$(function(){
   onLoad();
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
                let duration = element["key-takeaways"];
                let genre = element["genre-v2"];
                let thumbnail = element.thumbnail.url;
                let category = element.category
                
                let newVideo = new Video(name, author, duration, genre, category, thumbnail)
                newArray.push(newVideo)

                videoCount++;
            }else{
                //reset
                videoCount = 0;
                pageCount ++ 
                pages[pageCount] = []
            
                let metadata = element["link-to-video"]["metadata"];
                let name = element.name;
                let author = metadata.author_name;
                let duration = element["key-takeaways"];
                let genre = element["genre-v2"];
                let thumbnail = element.thumbnail.url;
                let category = element.category
    
                let newVideo = new Video(name, author, duration, genre, category, thumbnail)
                pages[pageCount].push(newVideo)

                videoCount++
            }
        });
        createPage(pages, 0)
        // Navigation Buttons
       
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

class Video {
    constructor(name, author, duration, genre, category, thumbnail) {
        this.name = name;
        this.author = author;
        this.duration = duration;
        this.genre = genre;
        this.thumbnail = thumbnail;
        this.category = category
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
                        <p>${this.author}</p>
                        
                    </div>
                </div>
            </article>
           </a>
        `
    }
}
