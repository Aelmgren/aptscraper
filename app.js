let axios = require('axios');
let cheerio = require('cheerio');
let csv_parse = require('csv-parse');
let fs = require('fs');
let json2csv = require('json2csv');

let test_url = 'https://www.apartments.com/bel-air-willow-bend-plano-tx/l7tyrbe/';
const csv =require('csvtojson');
let scrapedNum = 20;
var csvData = [];
//var jsonFile = [];
csv()
.fromFile('./dfw-master.csv')
.on('json',(jsonObj) =>{
  csvData.push(jsonObj);
//console.log(jsonObj);
//console.log('JSONOBJ DONE -----------');
})
.on('done',(err) =>{
  if (err) throw err;
  console.log('[');

let fields = ['amenities','services','specFeat','pets','imageUrls','propertyUrl'];
var jsonFile = [];
var url = "";
for (i=0;i<scrapedNum;i++){
url = csvData[i].url;
urlScrape(url, i);
}
function urlScrape(url, index){
axios.get(url).then( (res) => {
  let $ = cheerio.load(res.data);

  let amen = {};
 
var imageUrls = "";
$('.gridImage').each( (i, elm) => {
  imageUrls += ($(elm).attr('src') + " | ");
});

 let specFeat = $('h3:contains("Special Features")').last().nextAll().children().text().replace(/•/g," | ");
  let amenities = $('h3:contains("Features")').last().nextAll().children().text().replace(/•/g," | ");
  let services = $('h3:contains("Services")').last().nextAll().children().text().replace(/•/g," | ");
  let pets = $('.petPolicyDetails').text().trim();

amen['amenities'] = amenities;
amen['services'] = services;
amen['specFeat'] = specFeat;
amen['pets'] = pets;
amen['imageUrls'] = imageUrls;
amen['propertyUrl'] = url;
return amen;
})
.then( (amen) => {
//console.log("JSON RESULT -------: ");
console.log(JSON.stringify(amen, null, 4));
if (index == scrapedNum - 1) {
 console.log(']');
} else {
console.log(',');
}
//console.log("CSV RESULT --------: ");
jsonFile.push(amen);
//outputFile.push(amen);
//var result = json2csv({ data: amen, fields: fields });
//console.log(result);

});
}
//console.log("JSON FILE OUTPUT --------:");
//console.log(jsonFile);

//var result = json2csv({ data: jsonFile, fields: fields }); 

fs.writeFile('testfile1.csv', jsonFile, function(err) {
  if (err) throw err;
  //console.log('done');
});

});
