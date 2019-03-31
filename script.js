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

function gatherDualBasic(myJson){

}

function fetchDualTrial(){
    const options= {
        headers: new Headers({
            "Authorization": `Basic ${btoa(`${apikey}:${password}`)})`
        })
    }
    const baseUrl= "https://api.mysportsfeeds.com/v1.0/pull/mlb/2019-regular/player_gamelogs.json"
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
            gatherDualBasic(responseJson)
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