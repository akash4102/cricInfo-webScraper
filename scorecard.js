// const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard"
const url =
  "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");
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
        }

    }
  }
  // console.log(htmlString);
}
module.exports={
    ps:processScorecard
}
