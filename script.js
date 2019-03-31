"use strict";
const apikey = "e09cc51e-beb1-43ac-b888-20a591";
const password = "reytapptester110";

function createUrl(params,baseUrl){
    let final_url = baseUrl+"?"
    const objKeys = Object.keys(params)
    const paramList = objKeys.map(x =>`${x}=${params[x]}`)
    const paramListString = paramList.join("&")
    final_url += paramListString
    return final_url
}

function gatherBasic(myJson){
    console.log(myJson)
}

function fetchBasic(){
    const options= {
        headers: new Headers({
            "Authorization": `Basic ${btoa(`${apikey}:${password}`)})`
        })
    }
    const baseUrl= "https://api.mysportsfeeds.com/v1.0/pull/mlb/2018-regular/player_gamelogs.json"
    const params = {
        "player":"Mike-Trout,Mookie-Betts,Nolan-Arenado,Jose-Altuve,Alex-Bregman",
        "playerstats":"ab,r,h,bb",
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

function watchClickMe(){
    console.log("Ready to receive a click me.")
    $(".my-button").click(function(){
        console.log("clicked")
        fetchBasic()
    })
}

function readyfx(){
    watchClickMe()
}
$(readyfx())