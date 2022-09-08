const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const tempurl="https://www.espncricinfo.com";

const request =require("request");
const cheerio=require("cheerio");
const scorecardObj=require("./scorecard");
function getAllMatchesLink(url){
    request(url,function(err,response,html){
        if(err){
            console.log(err);
        }
        else{
            extractAllLinks(html);
        }
    })
}
function extractAllLinks(html){
    let $=cheerio.load(html);
    let anchorElem=$(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent>a");
    for(let i=0;i<anchorElem.length;i++){
        let tt=$(anchorElem[i]).attr('href');
        // console.log(tempurl+tt);
        let fullLink=tempurl+tt;
        scorecardObj.ps(fullLink);
    }

}
module.exports={
    gAlmatches:getAllMatchesLink
}