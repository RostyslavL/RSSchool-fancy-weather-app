import CurrentLocation from'./CurrentLocation.js'
import {addSpinner,displayError} from'./domFunctions.js'
import {setLocationObject, getHomeLocation} from'./dataFunctions.js'

const currentLoc = new CurrentLocation()

const initApp = () =>{
    // add listeners
    const geoButton = document.getElementById('getLocation')
    geoButton.addEventListener('click', getGeoWeather)

    const homeButton = document.getElementById('home')
    homeButton.addEventListener('click', loadWeather)
    // set up

    //load weather
    loadWeather()
    
}

document.addEventListener('DOMContentLoaded',initApp)

const getGeoWeather = (event) =>{
    if(event.type === 'click'){
        //add spinner
        const mapIcon = document.querySelector('.fa-map-marker-alt')
        addSpinner(mapIcon)
    }
    if (!navigator.geolocation) return geoError()
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
}

const geoError = (errObj) =>{
    const errMsg = errObj ? errObj.message : 'Geolocation error.Geolocation is not supported'
    displayError(errMsg, errMsg)
}

const geoSuccess = (position) => {
    const myCoordsObj = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`
    };
    setLocationObject(currentLoc, myCoordsObj)
    updateDataAndDisplay(currentLoc)
    console.log(currentLoc)
}

const loadWeather = (event) =>{
    const savedLocation = getHomeLocation()
    if(!savedLocation && !event) return getGeoWeather()
    if(!savedLocation && event.type === 'click'){
        displayError(
            'No Home Location Saved',
            'Please provide Your Home location'
        )
    }else if(savedLocation && !event){
        displayHomeLocationWeather(savedLocation)
    }else{
        const homeIcon = document.querySelector('.fa-home')
        addSpinner(homeIcon)
        displayHomeLocationWeather(savedLocation)
    }
}

const displayHomeLocationWeather = (home) =>{
    if(typeof home === 'string'){
        const locationJson = JSON.parse(home)
        const myCoordsObj = {
            lat: locationJson.lat,
            lon: locationJson.lon,
            name: locationJson.name,
            unit: locationJson.unit
        }
        setLocationObject(currentLoc, myCoordsObj)
        updateDataAndDisplay(currentLoc)
    }
}
      
const updateDataAndDisplay = async (locationObj) =>{
    // const weatherJson = await getWeatherFromCoords(locationobj)
    // if(weatherJson) updateDisplay(weatherJson, locationObj)
}

