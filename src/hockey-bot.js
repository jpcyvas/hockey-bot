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

    var gameTime = "";

    var output = "===== NHL Games for "+getTodaysDate()+" ===== \n";
    
    // loop through the data and get the games for just today
    for(var key of Object.keys(data.gameWeek)){
        if(data.gameWeek[key].date == date){
            //check to make sure there are games
            if(data.gameWeek[key].games == undefined || data.gameWeek[key].games.length == 0){
                output += "No games today :'( \n";
                return output;
            } else {
                for(var y = 0; y < data.gameWeek[key].games.length;y++){
                   
                    //get teams
                    output += data.gameWeek[key].games[y].awayTeam.abbrev + " at " + data.gameWeek[key].games[y].homeTeam.abbrev;


                     //convert UTC time to local time
                    gameTime = "";
                    try{
                        gameTime = new Date(data.gameWeek[key].games[y].startTimeUTC).toLocaleTimeString('en-US', { timeZone: 'America/Chicago', hour: '2-digit', minute: '2-digit' });
                        output += " @ " + gameTime + " CT";
                    } catch(e){
                        // do nothing, just leave gameTime blank
                    } finally{
                        output += "\n";
                    } 

                }
            }

        }


    }
    output += "=============================================";
    
    return output;
}

module.exports = {
    getData
}