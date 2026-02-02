const  inputSearch = document.getElementById('inputSearch');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const searchResults = document.getElementById('searchResults');

let countries = [];
let cities = [];
let temples = [];
let beaches = [];

let dataLoaded = false;

//fetch data from travel_recommendation.json
fetch('./travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        console.log('Data fetched successfully:', data);
        countries = data.countries;
        temples = data.temples;
        beaches = data.beaches;

        cities = countries.flatMap(country => country.cities.map(city => ({
            name: city.name,
            country: country.name
        })));

        dataLoaded = true;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    }

);

searchBtn.addEventListener('click', () => {
    if (!dataLoaded) {
        searchResults.innerHTML = '<p>Data is still loading, please try again shortly.</p>';
        return;
    }

    const keyword = inputSearch.value.toLowerCase();
    searchResults.innerHTML = '';
    let resultsFound = false;



    //search in countries
    countries.forEach(country => {
        country.cities.forEach(city => {
            if (city.name.toLowerCase().includes(keyword)) {
                searchResults.innerHTML += 
                `<img src="${city.imageUrl}" alt="${city.name}" width="350" height="90" opacity="0.8" pointer-events-none>
                <!--cities name-->
                <h4 style="font-size: 18px; font-weight: bold; margin: 10px 0 5px 0;">${city.name}</h4>
                <!--description-->
                <p style="font-size: 14px; color: #555;">${city.description}</p>
                <!--button-->
                <button style="padding: 8px 12px; background-color: #18d1b5; color: white; border: none; border-radius: 4px; cursor: pointer;">Visit</button>
                `;
                resultsFound = true;
            }
        });
    });

    //search in temples
    temples.forEach(temple => {
        if (temple.name.toLowerCase().includes(keyword) || temple.location.toLowerCase().includes(keyword)) {
            searchResults.innerHTML += `<p>Temple: ${temple.name}, Location: ${temple.location}</p>`;
            resultsFound = true;
        }
    });

    //search in beaches
    beaches.forEach(beach => {
        if (beach.name.toLowerCase().includes(keyword) || beach.location.toLowerCase().includes(keyword)) {
            searchResults.innerHTML += `<p>Beach: ${beach.name}, Location: ${beach.location}</p>`;
            resultsFound = true;
        }
    });

    if (!resultsFound) {
        searchResults.innerHTML = '<p>No results found.</p>';
    }
});

clearBtn.addEventListener('click', () => {
    inputSearch.value = '';
    searchResults.innerHTML = '';
});