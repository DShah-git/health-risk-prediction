const fs = require("fs");
csv = fs.readFileSync("./Health Monitor Dataset.csv")


array = (csv.toString().split(/\r?\n/))

let result = [];

let headers = array[0].split(",")

console.log(headers)
for(let i=0;i<headers.length;i++){
    headers[i] = headers[i].replace("\'","");
}


for (let i = 1; i < array.length - 1; i++) {
    let dataLine = array[i].split(',')    
    obj = {}
    for(let j=0;j<headers.length;j++){    
        if(!isNaN(dataLine[j])) {
            dataLine[j] = +dataLine[j] 
        }
        obj[headers[j]] = dataLine[j]
    }

    result.push(obj)
}

console.log(result)

// let json = JSON.stringify(result)

fs.writeFileSync('converted.json',JSON.stringify(result))