const express = require('express')
const app = express()

var request = require('request')
var syncrequest = require('sync-request');

var allUrl = "https://hacker-news.firebaseio.com/v0/topstories.json"
var itemUrl = "https://hacker-news.firebaseio.com/v0/item/"

var httpOption = {headers: { 'Content-Type': 'application/json' }} ;

var defaultsize = 10

// Get title info (synchronized)
function addTitle(id) {
    var url = itemUrl + id + ".json";
    console.log(url);
    var res = syncrequest('GET', url, httpOption);
    if(res.statusCode == 200) {
        var title = JSON.parse(res.body.toString('utf-8')).title;
        console.log(title);
        return title;
    }
    return "na";
}

// Get list of titles
function getTitleList(req, res, size) {
    request({url: allUrl, json: true}, function (error, response, body) {
        var itemlist;
        if (!error && response.statusCode === 200) {
            console.log(body) // Print the json response

            var itemlist = [];
            for(i = 0; i < size; i++){
                console.log("Id is :" + body[i]);
                itemlist.push(addTitle(body[i]) + " (" + (body[i]) + ")");            
            }
        }
        else {
            console.log("Fail to get title list")
            itemlist = "[]";
        }
        res.send(itemlist);
    })
}

// Get full info (synchronized)
function getFullBody(id) {
    var url = itemUrl + id + ".json";
    console.log(url);
    var res = syncrequest('GET', url, httpOption);
    if(res.statusCode == 200) {
        var body = JSON.parse(res.body.toString('utf-8'));
        console.log(body);
        return body;
    }
    return "na";
}

// Get full list of items
function getFullList(req, res, size) {
    request({url: allUrl, json: true}, function (error, response, body) {
        var itemlist;
        if (!error && response.statusCode === 200) {
            console.log(body) // Print the json response

            var itemlist = [];
            for(i = 0; i < size; i++){
                console.log("Id is :" + body[i]);
                itemlist.push(getFullBody(body[i]));            
            }
        }
        else {
            console.log("Failed to build item list")
            itemlist = "[]";
        }
        res.send(itemlist);
    })
}

// Get one item with id
function getItem(req, res, id) {
    request({url: itemUrl + id + ".json", json: true}, function (error, response, body) {
        
            if (!error && response.statusCode === 200) {
                console.log(body) // Print the json response
                res.send(body)
            }
            else {
                res.send("Fail to get " + id)
            }
        }
    )
}

// Get one item title
function getItemTitle(req, res, id) {
    request({url: itemUrl + id + ".json", json: true}, function (error, response, body) {
        
            if (!error && response.statusCode === 200) {
                console.log(body.getList) // Print the json response
                res.send(body.title)
            }
            else {
                res.send("Fail to get title for " + id)
            }
        }
    )
}

// Get all items
app.get('/topten',  (req, res) => getFullList(req, res, 10))

// Get all items
app.get('/topten/titles',  (req, res) => getTitleList(req, res, 10))

// Get one
app.get('/item',  (req, res) => getItem(req, res, req.query.id))

// Get one title
app.get('/item/title',  (req, res) => getItemTitle(req, res, req.query.id))

app.listen(3000, () => console.log('Running queries in port 3000'))
