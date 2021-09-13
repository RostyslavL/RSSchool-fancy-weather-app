export const setPlaceholderText = () => {
    const input = document.getElementById('searchBar__text')
    window.innerWidth < 400
    ? (input.placeholder = 'City, State, Country')
    : (input.placeholder = 'City, State, Country, or Zip Code')
}
  
export const addSpinner = (element) => {
    animateButton(element)
    setTimeout(animateButton, 1000, element)
}
  
const animateButton = (element) => {
    element.classList.toggle('none')
    element.nextElementSibling.classList.toggle('block')
    element.nextElementSibling.classList.toggle('none')
}
  
export const displayError = (headerMsg, srMsg) => {
    updateWeatherLocationHeader(headerMsg)
    updateScreenReaderConfirmation(srMsg)
}
  
export const displayApiError = (statusCode) => {
  const properMsg = toProperCase(statusCode.message)
  updateWeatherLocationHeader(properMsg)
  updateScreenReaderConfirmation(`${properMsg}. Please try again.`)
}

const toProperCase = (text) => {
    const words = text.split(' ')
    const properWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    return properWords.join(' ')
}

const updateWeatherLocationHeader = (message) => {
    const h1 = document.getElementById('currentForecast__location')
    if(message.indexOf('Lat:') !== -1 && message.indexOf('Long:') !== -1){
        const msgArr = message.split(' ')
        const mapArr  = msgArr.map((msg) => {
            return msg.replace(':', ': ')
        })
        const lat = mapArr[0].indexOf('-') === -1 ? mapArr[0].slice(0, 10) : mapArr[0].slice(0, 11)
        const lon = mapArr[1].indexOf('-') === -1 ? mapArr[1].slice(0, 11) : mapArr[1].slice(0, 12)
        h1.textContent = `${lat} • ${lon}`
    }else{
        h1.textContent = message
    }
}
    
export const updateScreenReaderConfirmation = (message) => {
    document.getElementById('confirmation').textContent = message
}

export const updateDisplay = (weatherJson, locationObj) => {

    fadeDisplay()

    clearDisplay()

    const weatherClass = getWeatherClass(weatherJson.current.weather[0].icon)

    setBackgroundImage(weatherClass)

    const screenReaderWeather = buildScreenReaderWeather(weatherJson, locationObj)

    updateScreenReaderConfirmation(screenReaderWeather)

    updateWeatherLocationHeader(locationObj.getName())

    // currentConditions To be displayed:

    const currentConditionsArray = createCurrentConditionsDivs(weatherJson, locationObj.getUnit())

    displayCurrentConditions(currentConditionsArray)

    // Six Day Forecast To be displayed:

    setFocusOnSearch()

    fadeDisplay()
}

const fadeDisplay = () => {
    const currentConditions = document.getElementById('currentForecast')
    currentConditions.classList.toggle('zero-vis')
    currentConditions.classList.toggle('fade-in')

    const sixDayForecast = document.getElementById('dailyForecast')
    sixDayForecast.classList.toggle('zero-vis')
    sixDayForecast.classList.toggle('fade-in')
}

const clearDisplay = () => {
    const currentConditions = document.getElementById('currentForecast__conditions')
    deleteContents(currentConditions)

    const sixDayForecast = document.getElementById('dailyForecast__contents')
    deleteContents(sixDayForecast)
}

const deleteContents = (parentElement) => {
    let childEl = parentElement.lastElementChild
    while(childEl){
        parentElement.removeChild(childEl)
        childEl = parentElement.lastElementChild
    }
}

const getWeatherClass = (icon) => {
    const firstTwoChars = icon.slice(0, 2)
    const lastChar = icon.slice(2)
    const weatherLookUp = {
        '09':'snow',
        '10':'rain',
        '11':'rain',
        '13':'snow',
        '50':'fog',
    }
    let weatherClass
    if(weatherLookUp[firstTwoChars]){
        weatherClass = weatherLookUp[firstTwoChars]
    }else if (lastChar === 'd'){ //d - daytime 
        weatherClass = 'clouds'
    }else{
        weatherClass = 'night'
    } 
    return weatherClass
}

const setBackgroundImage = (weatherClass) =>{
    document.documentElement.classList.add(weatherClass)
    document.documentElement.classList.forEach(img =>{
        if(img != weatherClass){
            document.documentElement.classList.remove(img)
        }
    })
}

const buildScreenReaderWeather = (weatherJson, locationObj) => {
    const location = locationObj.getName()
    const unit = locationObj.getUnit()
    const temperatureUnit = unit === 'imperial' ? 'F' : 'C'
    return `
        ${weatherJson.current.weather[0].description} and 
        ${Math.round(Number(weatherJson.current.temp))}°
        ${temperatureUnit} in ${location}
    `
}

const setFocusOnSearch = () => {
    document.getElementById('searchBar__text').focus()
}

const createCurrentConditionsDivs = (weatherObject, unit) =>{
    const temperatureUnit = unit === 'imperial' ? 'F' : 'C'
    const windUnit = unit === 'imperial' ? 'mph' : 'm/s'
    const icon = createMainImageDiv(weatherObject.current.weather[0].icon, weatherObject.current.weather[0].description)
    const temp = createElem('div','temp',`${Math.round(Number(weatherObject.current.temp))}°`, temperatureUnit)
    const properDesc = toProperCase(weatherObject.current.weather[0].description)
    const desc = createElem('div', 'desc', properDesc)
    const feels = createElem('div', 'feels', `Feels Like ${Math.round(Number(weatherObject.current.feels_like))}°`)
    const maxTemp = createElem('div', 'maxTemp',`High ${Math.round(Number(weatherObject.daily[0].temp.max))}°`)
    const minTemp = createElem('div', 'minTemp',`Low ${Math.round(Number(weatherObject.daily[0].temp.min))}°`)
    const humidity = createElem('div', 'humidity',`Humidity ${weatherObject.current.humidity}%`)
    const wind = createElem('div', 'wind',`Wind ${Math.round(Number(weatherObject.current.wind_speed))} ${windUnit}`)
    return [icon,temp,desc,feels,maxTemp,minTemp,humidity,wind]
}

const createMainImageDiv = (icon, altText) => {
    const iconDiv = createElem('div','icon')
    iconDiv.id = 'icon'
    const faIcon = translateIconToFontAwesome(icon)
    faIcon.ariaHidden = true
    faIcon.title = altText
    iconDiv.appendChild(faIcon)
    return iconDiv
}

const createElem = (elemType, divClassName, divText, unit) => {
    const div = document.createElement(elemType) 
    div.className = divClassName
    if(divText) {
        div.textContent = divText
    }
    if(divClassName === 'temp'){
        const unitDiv = document.createElement('div')
        unitDiv.classList.add('unit')
        unitDiv.textContent = unit
        div.appendChild(unitDiv)
    }
    return div
}

const translateIconToFontAwesome = (icon) =>{
    const i = document.createElement('i')
    const firstTwoChars = icon.slice(0,2)
    const lastChar = icon.slice(2)
    switch (firstTwoChars) {
        case '01':
            // Cheking if it's a day or a night time 
            lastChar === 'd' ? (i.classList.add('far', 'fa-sun')) : (i.classList.add('far', 'fa-moon'))
        break
        case '02':
            // Cheking if it's a day or a night time 
            lastChar === 'd' ? (i.classList.add('fas', 'fa-cloud-sun')) : (i.classList.add('fas', 'fa-cloud-moon'))
        break 
        case '03':
            i.classList.add('fas', 'fa-cloud')
        break 
        case '04':
            i.classList.add('fas', 'fa-cloud-meatball')
        break 
        case '09':
            i.classList.add('fas', 'fa-cloud-rain')
        break
        case '10':
            // Cheking if it's a day or a night time 
            lastChar === 'd' ? (i.classList.add('far', 'fa-cloud-sun-rain')) : (i.classList.add('far', 'fa-cloud-moon-rain'))
        break
        case '11':
            i.classList.add('fas', 'fa-poo-storm')
        break
        case '13':
            i.classList.add('far', 'fa-snowflake')
        break
        case '50':
            i.classList.add('fas', 'fa-smog')
        break
        default:
            i.classList.add('far', 'fa-question-circle')
    }
    return i
}

const displayCurrentConditions = (currentConditionsArray) =>{
    const currentConditionsContainer = document.getElementById('currentForecast__conditions')
    currentConditionsArray.forEach(cond =>{
        currentConditionsContainer.appendChild(cond)
    })

}