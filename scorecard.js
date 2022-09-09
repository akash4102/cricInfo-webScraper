// const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard"
const url =
  "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");
const path=require("path");
const fs=require("fs");
const xlsx=require("xlsx");
function processScorecard(url){
    request(url, cb);
}
function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    // console.log(html);
    extractMatchDetails(html);
  }
}
function extractMatchDetails(html) {
  //ipl
  //team
  //player
  //runs balls fours sixes sr opponent venue date
  // venue and date --- ds-text-tight-m ds-font-regular ds-text-ui-typo-mid
  // result ---- ds-text-tight-m ds-font-regular ds-truncate ds-text-typo-title
  let $ = cheerio.load(html);
  let descElem = $(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid");
  let resultDet = $(
    ".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title"
  );
  let stringArr = descElem.text().split(",");
  let venue = stringArr[1].trim();
  let date = stringArr[2].trim();
  let result = resultDet.text();
  // console.log(venue);
  // console.log(date);
  // console.log(result);
  // let htmlString="";
  let innings = $(".ds-bg-fill-content-prime.ds-rounded-lg");
  for (let i = 0; i < innings.length; i++) {
    // htmlString= $(innings[i]).html();
    let teamname = $(innings[i]).find(".ds-text-tight-s.ds-font-bold.ds-uppercase").text();
    teamname=teamname.split("INNINGS")[0].trim();
    //team opponent
    let aponentIndex = i == 0 ? 1 : 0;
    let aponentName = $(innings[aponentIndex]).find(".ds-text-tight-s.ds-font-bold.ds-uppercase").text();
    aponentName=aponentName.split("INNINGS")[0].trim();
    let cInnings=$(innings[i]);
    console.table(`${venue} |  ${date} | ${teamname} | ${aponentName} | ${result}`);
    let allRows=cInnings.find(".ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table>tbody>tr");
    for(let j=0;j<allRows.length;j++){
        let allCols=$(allRows[j]).find("td");
        // let allCols=$(allRows[j]).hasClass("ds-hidden");
        let isWorthy=$(allCols[0]).hasClass("ds-w-0");
        if(isWorthy==true){
            // console.log(allCols.text());
            let playername=$(allCols[0]).text().trim();
            let runs=$(allCols[2]).text().trim();
            let balls=$(allCols[3]).text().trim();
            let fours=$(allCols[5]).text().trim();
            let sixes=$(allCols[6]).text().trim();
            let sr=$(allCols[7]).text().trim();
            console.log(`${playername} | ${runs} |  ${balls} |  ${fours} |  ${sixes} |  ${sr}`);
            proccessPlayer(teamname,playername,runs,balls,fours,sixes,sr,aponentName,venue,date,result);
        }

    }
  }
  // console.log(htmlString);
}
function proccessPlayer(teamname,playername,runs,balls,fours,sixes,sr,aponentName,venue,date,result){
  let teamPath=path.join(__dirname,"ipl",teamname);
  dirCreater(teamPath);
  let filePath=path.join(teamPath,playername+".xlsx");
  let content=excelReader(filePath,playername);
  let playerObj={
    teamname,
    playername,
    runs,
    balls,
    fours,
    sixes,
    sr,
    aponentName,
    venue,
    date,
    result
  }
  content.push(playerObj);
  excelWriter(filePath,content,playername);
}
function dirCreater(filePath){
  if(fs.existsSync(filePath)==false){
      fs.mkdirSync(filePath);
  }
}
function excelWriter(filePath,json,sheetName){
  let newWb=xlsx.utils.book_new();
  let newWS=xlsx.utils.json_to_sheet(json);
  xlsx.utils.book_append_sheet(newWb,newWS,sheetName);
  xlsx.writeFile(newWb,filePath);
}

function excelReader(filePath,sheetName){
  if(fs.existsSync(filePath)==false){
    return [];
  }
  let wb=xlsx.readFile(filePath);
  let exceldata=wb.Sheets[sheetName];
  let ans=xlsx.utils.sheet_to_json(exceldata);
  return ans;
}
module.exports={
    ps:processScorecard
}
