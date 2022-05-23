const fs = require("fs");
data = fs.readFileSync("./converted.json").toString()
data = JSON.parse(data)

console.log(data.length)

neededData = []

function getRandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);

    return parseFloat(str);
  }

for(let i=0;i<data.length;i++){
    obj = {
        temperature : data[i].Temperature,
        heartRate:data[i]["Heart Rate"],
        respiratoryRate:data[i]["Respiratory Rate"],
        weight:getRandomFloat(60,90,1),
        bloodPressure:getRandomFloat(100,120,0),
        risk:data[i].Risk,
      
    }
    if(i>10){
        console.log(obj)
    }
    neededData.push(obj)
}

console.log(neededData)

fs.writeFileSync('adjusted.json',JSON.stringify(neededData))