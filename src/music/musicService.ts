import * as Promise from 'bluebird';
import * as _ from 'lodash';
const fs = Promise.promisifyAll(require('fs'));
const path = "./src/music/music.json";
var music = null;
var modifiedDate = new Date(0);

function readMusicFromFileAsync() {
    return fs.readFileAsync(path, 'utf8')
        .then(function(jsonString) {
            return JSON.parse(jsonString.trim());
        });
}

function checkOutdated() {
    if (!music) {
        return Promise.resolve(true); 
    }
    
    return fs.statAsync(path)
        .then(function(stats) {
            var result = stats.mtime > modifiedDate;
            modifiedDate = stats.mtime;
            return result;
        });
}

function checkForUpdate() {
    return checkOutdated().then(function (outdated) {
        if (!outdated) {
            return;
        }
        
        return readMusicFromFileAsync().then(function(result) {
           music = result;
        });
    });
}

let getAll = function() {
    return checkForUpdate().then(function() {
       return music; 
    });
}

let notFound = function() {
    return Promise.reject(new Error("Not found"));
}

let findCategory = function(id) {
    return getAll().then(function(result) {
        var category = _.find(result.categories, { 'id': id });
        if (category) {
            return category;
        }
        
        return notFound();
    });
}

let getInCategory = function (categoryId) {
    return getAll().then(function(result) {
        var pieces = _.filter(result.pieces, { 'categoryId': categoryId });
        return pieces;
    });
}

let findPiece = function(id, categoryId) {
    return getAll().then(function(result) {
        var piece = _.find(result.pieces, { 'id': id, 'categoryId': categoryId });
        if (piece) {
            return piece;
        }
        
        return notFound();
    });
}

export default {
    getAll: getAll,
    getInCategory: getInCategory,
    findCategory: findCategory,
    findPiece: findPiece
};