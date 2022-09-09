const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const tempurl="https://www.espncricinfo.com";

//venue date opponedt result runs balls fours sixes sr
const request =require("request");
const cheerio=require("cheerio");
const fs=require("fs");
const path=require("path");
const iplPath=path.join(__dirname,"ipl");
const { futimesSync } = require("fs");
const AllMatchObj=require("./Allmatch");
dirCreater(iplPath);
request(url,cb);
function cb(err,request,html){
    if(err){
        console.log(err);
    }
    else{
        extractLink(html);
    }
}
function extractLink(html){
    let $=cheerio.load(html);;
    let anchorElem=$(".ds-border-t.ds-border-line.ds-text-center.ds-py-2");
    let tt=$(anchorElem[0]).html();
    let templink1="";
    for(let i=0;i<tt.length;i++){
        if(tt[i]=='h' && tt[i+1]=='r' && tt[i+2]=='e' && tt[i+3]=='f' ){
            let k=i+6;
            while(tt[k]!='"'){
                templink1+=tt[k];
                k++;
            }
            break;
        }
    }
    let link=tempurl+templink1;
    // getAllMatchesLink(link);
    AllMatchObj.gAlmatches(link);
}
function dirCreater(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
}
// function getAllMatchesLink(url){
//     request(url,function(err,response,html){
//         if(err){
//             console.log(err);
//         }
//         else{
//             extractAllLinks(html);
//             // AllMatchObj.gAlmatches(html);
//         }
//     })
// }
// function extractAllLinks(html){
//     let $=cheerio.load(html);
//     let anchorElem=$(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent>a");
//     for(let i=0;i<anchorElem.length;i++){
//         let tt=$(anchorElem[i]).attr('href');
//         console.log(tempurl+tt);
//         // AllMatchObj.gAlmatches(tempurl+tt);
//     }

// }