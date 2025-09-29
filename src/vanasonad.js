const fs = require("fs");
const textRef = "./txt/vanasonad.txt"


const readTextFile = function() {
    fs.readFile(textRef, "utf8", (err, data)=>{
        if(err) {
            console.log(err);
        }
        else {
            //console.log(data);
            //return pickOneSentence(data);

            let oldWisdomList = data.split(";")
            formatedList = []
            for (i = 0; i < oldWisdomList.length; i ++) {
                formatedList.push("<li>" + oldWisdomList[i] + "</li>")
                //console.log("Added things")
                //console.log(formatedList)
            }
            //console.log("See on see hetk kui ma tra tagastan" + formatedList)
            return formatedList
        }
    });
}

const wisdomLen = function() {
    fs.readFile(textRef, "utf8", (err, data)=>{
        if(err) {
            console.log(err);
        }
        else {
            let oldWisdomList = data.split(";")
            let listLenght = oldWisdomList.length
            
            console.log("See on pikkus enne saatmist: " + listLenght)
            return listLenght
        }
    });
}

const selectOnlyOneWisdom = function(index) {
    fs.readFile(textRef, "utf8", (err, data)=>{
        if(err) {
            console.log(err);
        }
        else {
            let oldWisdomList = data.split(";")
            let listLenght = oldWisdomList.length
            console.log(listLenght)
            let selectedWisdom = oldWisdomList[index];
            //console.log("See on see hetk kui ma tra tagastan" + formatedList)
            return selectedWisdom
        }
    });
}

//console.log(readTextFile())
module.exports = {vanasonaList: readTextFile, wisdomLen, oneWisdom: selectOnlyOneWisdom}