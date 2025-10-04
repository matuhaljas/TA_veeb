//function dateNowFormatedET() {
const dateNowFormatedET = function() {
    let timeNow = new Date();
    const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
    const dayNamesET = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"]
    return timeNow.getDate() + ". " + monthNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();
}

const weekDay = function() {
    let timeNow = new Date();
    const dayNamesET = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"]
    return dayNamesET[timeNow.getDay()]
}

const timeNowFormatedET = function() {
    let timeNow = new Date();
    return timeNow.getHours() + ":" + timeNow.getMinutes()
}

//ekspordin kõik vajalikud
module.exports = {weekDay, fullDate: dateNowFormatedET, fullTime: timeNowFormatedET}