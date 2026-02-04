const  inputSearch = document.getElementById('inputSearch');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const searchResults = document.getElementById('searchResults');

const countryTimeZone = {
    "Indonesia": "Asia/Jakarta",
    "Japan": "Asia/Tokyo",
    "Brazil": "America/Sao_Paulo",
    "Cambodia": "Asia/Phnom_Penh",
    "India": "Asia/Kolkata",
    "French Polynesia": "Pacific/Tahiti",
};

const currentTime = (country) => {
    const timeZone = countryTimeZone[country];
    if (!timeZone) {
        return 'Time zone not found';
    }
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone };
    return new Intl.DateTimeFormat('en-US', options).format(new Date());
};

const getLocationFromPlaceName = (placeName) => {
    if (placeName.includes("Brazil")) return "Brazil";
    if (placeName.includes("French Polynesia")) return "French Polynesia";
    if (placeName.includes("Cambodia")) return "Cambodia";
    if (placeName.includes("India")) return "India";
    if (placeName.includes("Japan")) return "Japan";
    if (placeName.includes("Australia")) return "Australia";
    return null;
};

const timeZone = currentTime("Indonesia");
console.log("Current time in Indonesia:", timeZone);

const locationName = "Indonesia";
console.log(`Current time in ${locationName}:`, currentTime(locationName)); 

const timeIntervalId = setInterval(() => {
    console.log(`Current time in ${locationName}:`, currentTime(locationName));
}, 1000);

setTimeout(() => {
    clearInterval(timeIntervalId);
}, 10000);  

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
                `<div class="text-black bg-white rounded-lg w-full max-w-md items-center p-4 shadow-md">
                <img src="${city.imageUrl}" alt="${city.name}" class="w-full h-48 object-cover rounded" opacity="0.8" pointer-events-none>
                <!--cities name-->
                <h4 style="font-size: 18px; font-weight: bold; margin: 10px 0 5px 0;">${city.name}</h4>
                <!--description-->
                <p style="font-size: 14px; color: #555;">${city.description}</p>
                <!--time-->
                <p style="font-size: 12px; color: #888; margin-bottom: 10px;">Current time in ${country.name}: ${currentTime(country.name)}</p>
                <!--button-->
                <button style="padding: 8px 12px; background-color: #18d1b5; color: white; border: none; border-radius: 4px; cursor: pointer;">Visit</button>
                </div>
                `;
                resultsFound = true;
            }
        });
    });

    //search in temples
    temples.forEach(temples => {
        if (temples.name.toLowerCase().includes(keyword) || "Temples".toLowerCase().includes(keyword) ) {
            const templeLocation = getLocationFromPlaceName(temples.name);
            searchResults.innerHTML +=
            `<div class="text-black bg-white rounded-lg w-full max-w-md items-center p-4 shadow-md">
            <img src="${temples.imageUrl}" alt="${temples.name}" class="w-full h-48 object-cover rounded" opacity="0.8" pointer-events-none>
            <!--temple name-->
            <h4 style="font-size: 18px; font-weight: bold; margin: 10px 0 5px 0;">${temples.name}</h4>
            <!--description-->
            <p style="font-size: 14px; color: #555;">${temples.description}</p>
            <!--time-->
            ${templeLocation ? `<p style="font-size: 12px; color: #888; margin-bottom: 10px;">Current time in ${templeLocation}: ${currentTime(templeLocation)}</p>` : ''}
            <!--button-->
            <button style="padding: 8px 12px; background-color: #18d1b5; color: white; border: none; border-radius: 4px; cursor: pointer;">Visit</button>
            </div>
            `;
            resultsFound = true;    
        
        }
    });

    //search in beaches
    beaches.forEach(beaches => {
        if (beaches.name.toLowerCase().includes(keyword) || "Beaches".toLowerCase().includes(keyword)) {
            const beachLocation = getLocationFromPlaceName(beaches.name);
            searchResults.innerHTML +=
            `<div class="text-black bg-white rounded-lg w-full max-w-md items-center p-4 shadow-md">
            <img src="${beaches.imageUrl}" alt="${beaches.name}" class="w-full h-48 object-cover rounded" opacity="0.8" pointer-events-none>
            <!--beach name-->
            <h4 style="font-size: 18px; font-weight: bold; margin: 10px 0 5px 0;">${beaches.name}</h4>
            <!--description-->
            <p style="font-size: 14px; color: #555;">${beaches.description}</p>
            <!--time-->
            ${beachLocation ? `<p style="font-size: 12px; color: #888; margin-bottom: 10px;">Current time in ${beachLocation}: ${currentTime(beachLocation)}</p>` : ''}
            <!--button-->
            <button style="padding: 8px 12px; background-color: #18d1b5; color: white; border: none; border-radius: 4px; cursor: pointer;">Visit</button>
            </div>
            `;
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