import CurrentLocation from'./CurrentLocation.js'
import {addSpinner,displayError} from'./domFunctions.js'

const currentLoc = new CurrentLocation()

const initApp = () =>{
    // add listeners
    const geoButton = document.getElementById('getLocation')
    geoButton.addEventListener('click', getGeoWeather)
    // set up

    //load weather
}

document.addEventListener('DOMContentLoaded',initApp)

const getGeoWeather = (event) =>{
    if(event.type === 'click'){
        //add spinner
        const mapIcon = document.querySelector('.fa-map-marker-alt')
        addSpinner(mapIcon)
    }
    if(!navigator.geolocation) {
        geoError()
    }else{
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
    }

    const geoError = (errObj) =>{
        const errMsg = errObj ? errObj.message : 'Geolocation error.Geolocation is not supported'
        displayError(errMsg, errMsg)
    }

    const geoSuccess = (position) =>{
        const myCoordsObj = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name:`Lat:${position.coords.latitude} Long:${position.coords.longitude}`
        }
        // set location object
        setLocationObject(currentLoc, myCoordsObj)
        // update data and display
    }
}


