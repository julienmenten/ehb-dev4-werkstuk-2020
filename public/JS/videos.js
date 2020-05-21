// Globale variabelen
const url = "http://localhost:8000/videoAPI"

$(function(){
    loadVideos("all", 'all')
})
// Script dat alle videos laad vanuit de JSON/API
function loadVideos(ageGroup, filters){
    var results = []

    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json'
    }).done(function(data){
        console.log(data)
    }).fail(function(a,b){
        console.log(a,b)
    })
}
// Script dat kaartjes maakt per video

// Script voor filteren van de kaarten

// 