const axios = require('axios');

const hockeyApiUrlDailyGames = 'https://api-web.nhle.com/v1/schedule/';
const hockeyApiUrlWeeklyStandings = 'https://api-web.nhle.com/v1/standings/';

//Get today's date in YYYY-MM-DD format
function getTodaysDate() {
    // produce YYYY-MM-DD in US Central time
    const now = new Date();
    return now.toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
}


//Fetch data from the API
async function makeAPICall(apiURL) {
    try {
        const fullRequestUrl = apiURL + getTodaysDate(); 
        const response = await axios.get(fullRequestUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from the API:', error.stack || error);
        throw error; // rethrow so server can send 500 and log details
    }
}

async function getDailyData(){
    const data = await makeAPICall(hockeyApiUrlDailyGames);
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
    output += "====================================";
    
    return output;
}

async function getWeeklyStandings(){
    const data = await makeAPICall(hockeyApiUrlWeeklyStandings);
    var output = "\n===== NHL Weekly Standings "+getTodaysDate()+" =====\n \n";

    var standingsObject = {
        EasternAtlantic: [],
        EasternMetropolitan: [],
        EasternWildCard: [],
        WesternCentral: [],
        WesternPacific: [],
        WesternWildCard: []
    }

    var standingName = "";

    try{
        for(var x = 0; x < data.standings.length; x++){
            standingName = data.standings[x].conferenceName+data.standings[x].divisionName;
            if(standingsObject[standingName].length < 3){
                standingsObject[standingName].push(data.standings[x]);
            } else {
                standingsObject[data.standings[x].conferenceName+"WildCard"].push(data.standings[x]);    
            }
        }
    }
    catch(e){
        output = "Something went wrong getting the standings :'( \n";
        return output;
    }

    try{
        output += "=============================\n"
        output += "# Eastern Conference \n";
        output += "=============================\n"
        output += "## Atlantic Division \n";
        standingsObject.EasternAtlantic.forEach((team, index) => {
            output += `${index+1}. ${team.teamAbbrev.default} - ${team.points} pts (${team.wins}-${team.losses}-${team.otLosses})\n`; 
        });
        output += "## Metropolitan Division\n";    
        standingsObject.EasternMetropolitan.forEach((team, index) => {
            output += `${index+1}. ${team.teamAbbrev.default} - ${team.points} pts (${team.wins}-${team.losses}-${team.otLosses})\n`; 
        });
        output += "## Wild Card \n";
        standingsObject.EasternWildCard.forEach((team, index) => {
            if(index == 1){
                output += `__${index+1}. ${team.teamAbbrev.default} - ${team.points} pts (${team.wins}-${team.losses}-${team.otLosses})__ \n`; 
            } else{
                output += `${index+1}. ${team.teamAbbrev.default} - ${team.points} pts (${team.wins}-${team.losses}-${team.otLosses})\n`;
            }
        });
        output += "=============================\n \n";

        output += "==============================\n"
        output += "# Western Conference \n";
        output += "==============================\n"
        output += "## Central Division \n";
        standingsObject.WesternCentral.forEach((team, index) => {
            output += `${index+1}. ${team.teamAbbrev.default} - ${team.points} pts (${team.wins}-${team.losses}-${team.otLosses})\n`; 
        });
        output += "## Pacific Division \n";
        standingsObject.WesternPacific.forEach((team, index) => {
            output += `${index+1}. ${team.teamAbbrev.default} - ${team.points} pts (${team.wins}-${team.losses}-${team.otLosses})\n`; 
        });
        output += "## Wild Card \n";
        standingsObject.WesternWildCard.forEach((team, index) => {
            if(index == 1){
                output += `__${index+1}. ${team.teamAbbrev.default} - ${team.points} pts (${team.wins}-${team.losses}-${team.otLosses})__\n`; 
            } else{
                output += `${index+1}. ${team.teamAbbrev.default} - ${team.points} pts (${team.wins}-${team.losses}-${team.otLosses})\n`;
            }        
        });    

        output += '=============================\n';
        return output;
    }
    catch(e){
        output = "Something went wrong working with the standings :'( \n";
        return output;
    }

    

}


module.exports = {
    getDailyData,
    getWeeklyStandings
}