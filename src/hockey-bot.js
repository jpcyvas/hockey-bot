const axios = require('axios');

const hockeyApiUrl = 'https://api-web.nhle.com/v1/schedule/';

//Get today's date in YYYY-MM-DD format
function getTodaysDate() {
    // produce YYYY-MM-DD in US Central time
    const now = new Date();
    return now.toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
}


//Fetch data from the API
async function makeAPICall() {
    try {
        const fullRequestUrl = hockeyApiUrl + getTodaysDate(); // fixed variable name
        const response = await axios.get(fullRequestUrl);
        return response.data; // return the JSON body, not the axios response object
    } catch (error) {
        console.error('Error fetching data from the API:', error.stack || error);
        throw error; // rethrow so server can send 500 and log details
    }
}

async function getData(){
    const data = await makeAPICall();
    const date = getTodaysDate();

    var output = "===== GAME FOR TODAY ===== \n";
    
    // loop through the data and get the games for just today
    for(var key of Object.keys(data.gameWeek)){
        if(data.gameWeek[key].date == date){
            for(var y = 0; y < data.gameWeek[key].games.length;y++){
                output += data.gameWeek[key].games[y].awayTeam.abbrev + " at " + data.gameWeek[key].games[y].homeTeam.abbrev + "\n";
            }
        }
    }
    
    return output;
}

module.exports = {
    getData
}