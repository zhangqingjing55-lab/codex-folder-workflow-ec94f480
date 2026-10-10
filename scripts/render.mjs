import {bundle} from '@remotion/bundler';
import {selectComposition, renderMedia, renderStill} from '@remotion/renderer';
import {existsSync, mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
const id=process.argv.find(x=>x==='FolderSequence')||'Workflow';
const chrome=process.env.CHROME_PATH || (existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined);
mkdirSync('out',{recursive:true});
const serveUrl=await bundle({entryPoint:resolve('src/index.tsx')});
const composition=await selectComposition({serveUrl,id,browserExecutable:chrome});
const frames=id==='Workflow'?[35,125,191,207,228,251,279,301,325,400,495]:[11,27,48,71,99,121,145];
for(const frame of frames)await renderStill({serveUrl,composition,frame,output:resolve(`out/${id}-${frame}.png`),browserExecutable:chrome,logLevel:'error'});
if(!process.argv.includes('--stills-only')){
 let last=-1;
 await renderMedia({serveUrl,composition,outputLocation:resolve(`out/${id}.mp4`),codec:'h264',crf:18,concurrency:2,browserExecutable:chrome,onProgress:({progress})=>{let p=Math.floor(progress*10)*10;if(p!==last){last=p;console.log(`Render ${p}%`)}}});
 console.log(`Saved out/${id}.mp4`);
}
