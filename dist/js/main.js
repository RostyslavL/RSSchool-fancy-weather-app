import CurrentLocation from'./CurrentLocation.js'
import {
    addSpinner,
    displayError,
    updateScreenReaderConfirmation
} from'./domFunctions.js'
import {setLocationObject, getHomeLocation} from'./dataFunctions.js'

const currentLoc = new CurrentLocation()

const initApp = () =>{
    // add listeners 
    const geoButton = document.getElementById('getLocation')
    geoButton.addEventListener('click', getGeoWeather)

    const homeButton = document.getElementById('home')
    homeButton.addEventListener('click', loadWeather)

    const saveButton = document.getElementById('saveLocation')
    saveButton.addEventListener('click', saveLocation)

    // set up

    //load weather
    loadWeather()
    
}

document.addEventListener('DOMContentLoaded',initApp)

const getGeoWeather = (event) =>{
    if (event && event.type === "click") {
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
    }
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

const saveLocation = () =>{
    if(currentLoc.getLat()  && currentLoc.getLon()){
        const saveIcon = document.querySelector('.fa-save')
        addSpinner(saveIcon)
        const location = {
            lat: currentLoc.getLat(),
            lon: currentLoc.getLon(),
            name: currentLoc.getName(),
            unit: currentLoc.getUnit(),
        }
        localStorage.setItem('defaultWeatherLocation', JSON.stringify(location))
        updateScreenReaderConfirmation(`Succesfully Saved ${currentLoc.getName()} as Your Home Location`)
    }
}
      
const updateDataAndDisplay = async (locationObj) =>{
    console.log(locationObj)
    // const weatherJson = await getWeatherFromCoords(locationobj)
    // if(weatherJson) updateDisplay(weatherJson, locationObj)
}

