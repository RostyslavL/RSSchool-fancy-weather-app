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
    h1.textContent = message;
}
    
export const updateScreenReaderConfirmation = (message) => {
    document.getElementById('confirmation').textContent = message
}

export const updateDisplay =(weatherJson, locationObj) => {

    fadeDisplay()

    clearDisplay()

    const weatherClass = getWeatherClass(weatherJson.current.weather[0].icon)

    setBackgroundImage(weatherClass)

    const screenReaderWeather = buildScreenReaderWeather(weatherJson, locationObj)

    updateScreenReaderConfirmation(screenReaderWeather)

    updateWeatherLocationHeader(locationObj.getName())

    // currentConditions To be displayed:

    const currentConditionsArray = createCurrentConditionsDivs(weatherJson, locationObj.getUnit())
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

const createCurrentConditionsDivs = (weatherJson, unit) =>{
    const temperatureUnit = unit === 'imperial' ? 'F' : 'C'
    const windUnit = unit === 'imperial' ? 'mph' : 'm/s'
    const icon = createMainImageDiv(weatherJson.current.weather[0].icon, weatherJson.current.weather[0].description)
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