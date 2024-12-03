const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


// Nasa Api
const count = 5;
const apiKey = 'DEMO_KEY';
const apiURl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let results = [];
let favourites = {};

function showContent(page) {
    window.scrollTo({
        top: 0,
        behavior: "instant"
    })
    loader.classList.add('hidden')

    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden')
    } else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden')
    }

}

function createDom(page) {
    const currentArray = page === 'results' ? results : Object.values(favourites);
    currentArray.forEach((result) => {
        // card container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank'
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'Nasa Picture Of The Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        //card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // Save text 

        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results') {
            saveText.textContent = 'Add To Favourites';
            saveText.setAttribute('onclick', `saveFavourite('${result.url}')`);
        } else {
            saveText.textContent = 'Remove Favourites';
            saveText.setAttribute('onclick', `removeFavourite('${result.url}')`);
        }
        // Card text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // date
        const date = document.createElement('strong');
        date.textContent = result.date;

        // copyRight

        const copyrightResult = result.copyright === undefined ? '' : `  ©${result.copyright}`;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;

        // Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.append(image);
        card.append(link, cardBody)
        imagesContainer.append(card)
    })
}


// Update DOM
function UpdateDom(page) {
    // Get favourites from local Storage
    if (localStorage.getItem('nasaFavourites')) {
        favourites = JSON.parse(localStorage.getItem('nasaFavourites'))
    }
    imagesContainer.textContent = '';
    createDom(page);
    showContent(page);
}


//Get images from Nasa Api

async function getNasaPictures() {
    //Show Loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiURl);
        results = await response.json();
        
        UpdateDom('results');

    } catch (e) {
        //Catch error here

    }
}

// Add result to favourites
function saveFavourite(itemlUrl) {
    results.forEach((item) => {
        if (item.url.includes(itemlUrl) && !favourites[itemlUrl]) {
            favourites[itemlUrl] = item;
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true
            }, 2000)
        }
        localStorage.setItem('nasaFavourites', JSON.stringify(favourites))
    })
}
// remove item from favourites
function removeFavourite(itemUrl) {
    if (favourites[itemUrl]) {
        delete favourites[itemUrl];
        localStorage.setItem('nasaFavourites', JSON.stringify(favourites));
        UpdateDom('favourites')
    }
}

getNasaPictures()

