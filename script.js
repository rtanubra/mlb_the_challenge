"use strict";
const apikey = "e09cc51e-beb1-43ac-b888-20a591";
const password = "reytapptester110";
const bestStatsHitter = {
    "R":129,
    "HR":48,
    "RBI":130,
    "SB":45,
    "AVG":0.346,
    "CS":0.01,
    "G":162
}

function createUrl(params,baseUrl){
    let final_url = baseUrl+"?"
    const objKeys = Object.keys(params)
    const paramList = objKeys.map(x =>`${x}=${params[x]}`)
    const paramListString = paramList.join("&")
    final_url += paramListString
    return final_url
}

function gatherBasic(myJson){
    //console.log(myJson)
    const gamelogs = myJson['playergamelogs']["gamelogs"]
    const statsAbrvHigh = ["R","HR","RBI","AVG","SB"]
    const statsAbrvLow = ["CS"]
    let stats = {
        "R":[],
        "HR":[],
        "RBI":[],
        "AVG":[],
        "SB":[],
        "CS":[],
    }
    let statsBest = {
        "R":0,
        "HR":0,
        "RBI":0,
        "AVG":0,
        "SB":0,
        "CS":0,
    }
    const statNames = Object.keys(gamelogs[0]["stats"]) 
    //console.log(statNames)

    //Fill statistics
    for (let i = 0; i< gamelogs.length;i++){
        for (let j = 0; j< statNames.length; j++){
            stats[gamelogs[i]["stats"][statNames[j]]["@abbreviation"]].push(parseFloat(gamelogs[i]["stats"][statNames[j]]["#text"]))
        }
    }

    //console.log(stats)
    for (let i =0; i<statsAbrvHigh.length;i++){
        statsBest[statsAbrvHigh[i]] = Math.max(...stats[statsAbrvHigh[i]])
    }
    for (let i =0; i<statsAbrvLow.length;i++){
        statsBest[statsAbrvLow[i]] = Math.min(...stats[statsAbrvLow[i]])
    }

    console.log(statsBest)
    console.log(stats)

}

function fetchBasic(){
    const options= {
        headers: new Headers({
            "Authorization": `Basic ${btoa(`${apikey}:${password}`)})`
        })
    }
    const baseUrl= "https://api.mysportsfeeds.com/v1.0/pull/mlb/2018-regular/player_gamelogs.json"
    const params = {
        "player":"Mookie-Betts,Jose-Altuve,Mike-Trout",
        "playerstats":"r,hr,rbi,avg,sb,cs",
        "sort":"player.lastname"
    }
    const fetchUrl = createUrl(params,baseUrl)
    fetch(fetchUrl,options).then(
        response =>{
            if (response.ok){
                return response.json()
            }
            else{
                throw new Error(response.statusText)
            }
        }
    ).then(
        responseJson=>{
            gatherBasic(responseJson)
        }
    ).catch(
        err=> console.log(err)
    )
}
function updateDualTrial(data){
    /**
     * {
        "players":players,
        "stats":stats,
        "statsNames":statsNames,
        "statsAbrvs":statsAbrvs
        }   
     */
    
    //just a little unpacking for ease of use
    const players = data["players"]
    const stats = data["stats"]
    const statsAbrvs = data["statsAbrvs"]
    const statsNames = data["statsNames"]

    $(".player1_stats").empty()
    $(".player2_stats").empty()

    //update titles
    $(".player1-header").text(`${data["players"][0]}`)
    $(".player2-header").text(`${data["players"][1]}`)

    for (let i=0; i<statsAbrvs.length ; i++){
        $(".player1_stats").append(`
        <tr>
            <td>${statsNames[i].slice(0,15)} (${statsAbrvs[i]})</td>
            <td>${stats[statsAbrvs[i]][0]}</td>
            <td>${Math.round(stats[statsAbrvs[i]][0]/bestStatsHitter[statsAbrvs[i]]*10000)/100}</td>
        </tr>
        `)
        $(".player2_stats").append(`
        <tr>
            <td>${statsNames[i].slice(0,15)} (${statsAbrvs[i]})</td>
            <td>${stats[statsAbrvs[i]][1]}</td>
            <td>${Math.round(stats[statsAbrvs[i]][1]/bestStatsHitter[statsAbrvs[i]]*10000)/100}</td>
        </tr>
        `)
    }
    
}
function gatherDualTrial(myJson){
    console.log(myJson)
    const playerStats = myJson['cumulativeplayerstats']["playerstatsentry"]
    const statsAbrvHigh = ["R","HR","RBI","AVG","SB"]
    const statsAbrvLow = ["CS"]
    
    const statsAbrvs = []
    const statsNames = Object.keys(playerStats[0]["stats"])
    for (let i=0; i< statsNames.length;i++){
        statsAbrvs.push(playerStats[0]["stats"][statsNames[i]]["@abbreviation"])
    }
    const players = [
        `${playerStats[0]["player"]["FirstName"]} ${playerStats[0]["player"]["LastName"]} (${playerStats[0]["player"]["JerseyNumber"]})`,
        `${playerStats[1]["player"]["FirstName"]} ${playerStats[1]["player"]["LastName"]} (${playerStats[1]["player"]["JerseyNumber"]})`
    ]
    let stats = {
        "G":[0,0],
        "R":[0,0],
        "HR":[0,0],
        "RBI":[0,0],
        "AVG":[0,0],
        "SB":[0,0],
        "CS":[0,0],
    }
    for (let i =0; i<2; i++){
        for (let x = 0; x<statsAbrvs.length; x++){
            stats[statsAbrvs[x]][i] = parseFloat(playerStats[i]["stats"][statsNames[x]]["#text"])
        }
    }
    return {
        "players":players,
        "stats":stats,
        "statsNames":statsNames,
        "statsAbrvs":statsAbrvs
    }
}

function fetchDualTrial(){
    const options= {
        headers: new Headers({
            "Authorization": `Basic ${btoa(`${apikey}:${password}`)})`
        })
    }
    const baseUrl= "https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/cumulative_player_stats.json"
    const params = {
        "player":"Mookie-Betts,Jose-Altuve",
        "playerstats":"r,hr,rbi,avg,sb,cs",
        "sort":"player.lastname"
    }
    const fetchUrl = createUrl(params,baseUrl)
    fetch(fetchUrl,options).then(
        response =>{
            if (response.ok){
                return response.json()
            }
            else{
                throw new Error(response.statusText)
            }
        }
    ).then(
        responseJson=>{
            const data = gatherDualTrial(responseJson)
            updateDualTrial(data)
        }
    ).catch(
        err=> console.log(err)
    )
}

function watchClickMe(){
    console.log("Ready to receive a click me.")
    $(".my-button").click(function(){
        console.log("clicked")
        //fetchBasic()
        fetchDualTrial()
    })
}

function readyfx(){
    watchClickMe()
}
$(readyfx())