"use strict";
const apikey = "e09cc51e-beb1-43ac-b888-20a591";
const password = "reytapptester110";
const bestStatsHitter = {
    "R":129,
    "HR":48,
    "RBI":130,
    "SB":45,
    "AVG":0.346,
    "CS":-8,
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

function updateDualTrial(data){
    /**
     * {
        "players":players,
        "stats":stats,
        "statsNames":statsNames,
        "statsAbrvs":statsAbrvs
        "summary":summary
        }   
     */
    
    //just a little unpacking for ease of use
    const summary = data["summary"]
    const players = data["players"]
    const stats = data["stats"]
    const statsAbrvs = data["statsAbrvs"]
    const statsNames = data["statsNames"]

    $(".player1_stats").empty()
    $(".player2_stats").empty()

    //update titles
    $(".player1-header").text(`${data["players"][0]}`)
    $(".player2-header").text(`${data["players"][1]}`)

    //update summary
    $(".player1-summary").text(summary[0])
    $(".player2-summary").text(summary[1])

    //create table
    for (let i=0; i<statsAbrvs.length ; i++){
        $(".player1_stats").append(`
        <tr>
            <td>${statsNames[i].slice(0,15)} (${statsAbrvs[i]})</td>
            <td>${stats[statsAbrvs[i]][0][0]}</td>
            <td>${stats[statsAbrvs[i]][0][1]}</td>
        </tr>
        `)
        $(".player2_stats").append(`
        <tr>
            <td>${statsNames[i].slice(0,15)} (${statsAbrvs[i]})</td>
            <td>${stats[statsAbrvs[i]][1][0]}</td>
            <td>${stats[statsAbrvs[i]][1][1]}</td>
        </tr>
        `)
    }
    $(".cards").removeClass("hide-me")
}
function gatherDualTrial(myJson){
    console.log(myJson)
    const playerStats = myJson['cumulativeplayerstats']["playerstatsentry"]
    const statsAbrvHigh = ["R","HR","RBI","AVG","SB"]
    const statsAbrvLow = ["CS"]
    const fullListOfNames = Object.keys(playerStats[0]["stats"])
    const statsAbrvs = []
    const statsNames = []

    console.log(fullListOfNames)
    for (let i=0; i< fullListOfNames.length;i++){
        if (statsAbrvs.indexOf(playerStats[0]["stats"][fullListOfNames[i]]["@abbreviation"])<0){
            statsAbrvs.push(playerStats[0]["stats"][fullListOfNames[i]]["@abbreviation"])
            statsNames.push(fullListOfNames[i])
        }
    }
    const players = [
        `${playerStats[0]["player"]["FirstName"]} ${playerStats[0]["player"]["LastName"]} (${playerStats[0]["player"]["JerseyNumber"]})`,
        `${playerStats[1]["player"]["FirstName"]} ${playerStats[1]["player"]["LastName"]} (${playerStats[1]["player"]["JerseyNumber"]})`
    ]
    let stats = {
        "G":[[0,0],[0,0]],
        "R": [[0,0],[0,0]],
        "HR":[[0,0],[0,0]],
        "RBI":[[0,0],[0,0]],
        "AVG":[[0,0],[0,0]],
        "SB":[[0,0],[0,0]],
        "CS":[[0,0],[0,0]],
    }
    for (let i =0; i<2; i++){
        for (let x = 0; x<statsAbrvs.length; x++){
            let statOInterest = parseFloat(playerStats[i]["stats"][statsNames[x]]["#text"])
            let bestStat = bestStatsHitter[statsAbrvs[x]]
            stats[statsAbrvs[x]][i][0] = statOInterest
            stats[statsAbrvs[x]][i][1] = Math.round(statOInterest/bestStat*10000)/100
        }
    }
    const summary= [0,0]
    for (let i = 0; i<statsAbrvs.length; i ++){
        summary[0] += stats[statsAbrvs[i]][0][1]
        summary[1] += stats[statsAbrvs[i]][1][1]
    }
    //round summary
    summary[0] = Math.round(summary[0]*100)/100
    summary[1] = Math.round(summary[1]*100)/100

    return {
        "players":players,
        "stats":stats,
        "statsNames":statsNames,
        "statsAbrvs":statsAbrvs,
        "summary":summary
    }
}

function hyphonateName(name){
    const hyphonated_name = name.replace(" ","-")
    return hyphonated_name
}
function trimStr(mystr){
    mystr = mystr.replace(/^\s+|\s+$/g,"")
    mystr = mystr.replace(/\./g,"")
    return mystr
}

function fetchDualTrial(){
    const options= {
        headers: new Headers({
            "Authorization": `Basic ${btoa(`${apikey}:${password}`)})`
        })
    }
    const baseUrl= "https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/cumulative_player_stats.json"
    const player1 = hyphonateName(trimStr($("#js-player-1").val()))
    const player2 = hyphonateName(trimStr($("#js-player-2").val()))
    console.log(player1,player2)
    const params = {
        "player":`${player1},${player2}`,
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
    $(".js-players-form").submit(event=>{
        event.preventDefault()
        fetchDualTrial()
        $(".landing-page").addClass("hide-me")
    })

}

function navigateTo(searchClass){
    const allClasses = [".js-pitcher-button",".js-hitter-button"]
    const formClasses = [".pitchers",".hitters"]
    for (let i=0; i<allClasses.length ;i++){
        if (allClasses[i] === searchClass ){
            $(`${allClasses[i]}`).removeClass("hide-me")
            $(`${formClasses[i]}`).removeClass("hide-me")
        }
        else {
            $(`${allClasses[i]}`).addClass("hide-me")
            $(`${formClasses[i]}`).addClass("hide-me")
        }
    }
}

function watchNavigate(){
    $(".js-pitcher-button").click(event=>{
        navigateTo(".js-hitter-button")
    })
    $(".js-hitter-button").click(event=>{
        navigateTo(".js-pitcher-button")
    })
}

function readyfx(){
    watchClickMe()
    watchNavigate()
}
$(readyfx())