const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

// Event Listeners
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim(); // trim() is a string method that is used to remove whitespace characters from the start and end of a string.
    
    if(!searchTerm){
        alert('Please type in a search term');
    } else {
        searchSongs(searchTerm);
    }
})

// Search song function which fetch data from API
async function searchSongs(term) {
    const lyricsResponse = await fetch(`${apiURL}/suggest/${term}`);
    const data = await lyricsResponse.json();
    // console.log(data);
    showData(data); 
}

// Show song and artist in DOM

function showData(data) {
    let output = '';

    data.data.forEach(song => {
        output += `
        <li><span><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
        </li>
        `;
    })

    result.innerHTML= `
       <ul class="songs">${output}</ul>
    `;
    // another way of doing it
    // result.innerHTML = `
    //   <ul class="songs">${data.data.map(song => `
    //   <li><span><strong>${song.artist.name}</strong> - ${song.title}</span>
    //   <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    //   </li>`
    //     )
    //   .join('')}
    //   </ul>

    //   `;

    if(data.prev || data.next){
        more.innerHTML = `
         ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Previous</button>` : ''}
         ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
        `;
    } else {
        more.innerHTML = '';
    }
    
}



// Get prev and next songs (function takes in a url as parameter)
async function getMoreSongs(url) {
      const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
      const data = await res.json();
      showData(data);
}

// Get lyrics button click
result.addEventListener('click', e => {
    // console.log(e.target);
    const clickedEl = e.target;
    if(clickedEl.tagName === 'BUTTON'){
        // console.log(123);
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songtitle');

        getLyrics(artist, songTitle);
    }
})

// Get Lyrics Function
async function getLyrics(artist, songTitle) {
    try {
        const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
        const data = await res.json();
        
        if(data.error){
            // console.log(data.error);
             throw 'No lyrics found';
        } else {
            const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
            result.innerHTML = `
            <h2><strong>${artist}</strong> - ${songTitle}</h2>
            <span>${lyrics}</span>`;
            more.innerHTML = '';
        }
        
    } catch (err) {
         result.innerHTML = err;
    } finally {
        more.innerHTML = `<button class = "btn" onclick="backToResults()">Back</button>`;
    }
    
}

// Go back to results

async function backToResults(url) {
    const res = await fetch(url);
    const data = await res.json();
    showData(data);
}






