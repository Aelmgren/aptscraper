let axios = require('axios');
let cheerio = require('cheerio');
let csv_parse = require('csv-parse');
let fs = require('fs');
let json2csv = require('json2csv');

let test_url = 'https://www.apartments.com/bel-air-willow-bend-plano-tx/l7tyrbe/';
const csv =require('csvtojson');


//var parser = csv_parse({delimiter: ','}, function(err, data) {
// if (err) throw err;
//  csvData = data 
//});

var csvData = []
//fs.createReadStream(__dirname+'/dfw-master.csv').pipe(parser);
csv()
.fromFile('./dfw-master.csv')
.on('json',(jsonObj) =>{
  csvData.push(jsonObj);
console.log(jsonObj);
console.log('JSONOBJ DONE -----------');
})
.on('done',(err) =>{
  if (err) throw err;
  console.log('end');
});

//console.log('CSV FILE ------------ :');
//console.log(csvData);
//for(i=0;i<5;i++){
//console.log(csvData[0][i]);
//}


let fields = ['amenities','services','specFeat','pets','imageUrls'];


axios.get(test_url).then( (res) => {
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
return amen;
})
.then( (amen) => {
console.log("JSON RESULT -------: ");
console.log(amen);
console.log("CSV RESULT --------: ");
var result = json2csv({ data: amen, fields: fields });
console.log(result);

fs.writeFile('testfile.csv', result, function(err) {
  if (err) throw err;
  console.log('file saved');
  });
});
