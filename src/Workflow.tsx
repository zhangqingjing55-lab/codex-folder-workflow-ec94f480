import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import data from './content.json';
import {FolderScene} from './FolderScene';
import {clamp, mix, out} from './motion';

const bg='#111316', ink='#f6f6f1';
const photo=(i:number)=>staticFile(`images/output-${i}.jpg`);
const resultStyle: React.CSSProperties={objectFit:'cover',border:'8px solid #f3f2eb',boxShadow:'0 22px 55px #0005'};
const Shell:React.FC<{section:number;children:React.ReactNode}>=({section,children})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),s=data.sections[section];
 return <AbsoluteFill style={{background:bg,color:ink,fontFamily:'"PingFang SC","Noto Sans CJK SC",sans-serif'}}>
  <div style={{position:'absolute',left:78,right:90,top:90,fontSize:27,color:'#a8b0b9',display:'flex',justifyContent:'space-between'}}><span>个人 AI 实践</span><span>WORKFLOW</span></div>
  <div style={{position:'absolute',left:78,top:185,color:data.accent,fontSize:30,fontWeight:650}}>{String(section+1).padStart(2,'0')} / {s.label}</div>
  <div style={{position:'absolute',left:78,top:267,fontSize:88,fontWeight:750,lineHeight:1.28,letterSpacing:-2}}>{s.title.map(x=><div key={x}>{x}</div>)}</div>
  {children}
  <div style={{position:'absolute',left:78,right:90,top:1530,fontSize:27,color:'#abb2ba'}}>{s.evidence}</div>
  <div style={{position:'absolute',left:78,right:90,top:1630,fontSize:38,textAlign:'center',fontWeight:550}}>{s.caption}</div>
  <div style={{position:'absolute',left:78,top:1780,width:884,height:3,background:'#3c4148'}}><div style={{height:3,width:`${(section+f/(fps*data.sectionSeconds))/6*100}%`,background:data.accent}}/></div>
 </AbsoluteFill>;
};
const Results=()=>{const f=useCurrentFrame();return <div style={{position:'absolute',left:125,top:565,width:825,height:825,overflow:'hidden',border:'5px solid #fff'}}><Img src={photo(1)} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${mix(1.22,1,out(f/35))})`}}/></div>};

const AiInput=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),t=f/fps;
 const full=data.prompt,typed=full.slice(0,Math.floor(full.length*clamp((t-.2)/1.05))),sent=t>=1.65,thinking=t>=1.9;
 const panel:React.CSSProperties={position:'absolute',left:78,top:570,width:884,height:840,borderRadius:32,background:'#eae8e1',color:'#303630'};
 return <div style={panel}>
  <div style={{margin:42,fontSize:30,fontWeight:650}}>AI 助手 <span style={{float:'right',fontWeight:400}}>流程演示</span></div>
  <div style={{position:'absolute',left:40,right:40,top:210,textAlign:'center',fontSize:43,fontWeight:600}}>{sent?full:'今天需要做什么？'}</div>
  <div style={{position:'absolute',left:38,right:38,top:360,height:250,borderRadius:25,background:'#fff',padding:35,fontSize:48}}>{sent?<span style={{color:'#999'}}>继续输入…</span>:typed}<span style={{opacity:sent?0:Math.floor(f/7)%2}}>│</span>
   <div style={{position:'absolute',left:35,bottom:26,fontSize:32,color:'#777'}}>＋ AI 助手 ▾</div>
   <div style={{position:'absolute',right:25,bottom:23,width:65,height:65,borderRadius:40,background:data.accent,textAlign:'center',fontSize:45,lineHeight:'65px'}}>{sent?'▪':'↑'}</div>
  </div>
  {thinking&&<div style={{position:'absolute',left:75,top:700,fontSize:36}}>正在思考<span style={{opacity:.45+.55*Math.sin(t*8)**2}}> ···</span></div>}
 </div>;
};
const Generation=()=>{const f=useCurrentFrame();return <>
 <div style={{position:'absolute',left:90,right:110,top:605,fontSize:56,fontWeight:650}}><div style={{padding:34,background:'#282d34'}}>01　LoRA 训练</div><div style={{textAlign:'center',color:data.accent,margin:18}}>↓</div><div style={{padding:34,background:'#282d34',fontSize:46}}>02　Stable Diffusion 生图</div></div>
 {[2,3,4].map((i,j)=><Img key={i} src={photo(i)} style={{...resultStyle,position:'absolute',left:80+j*308,top:1130+60*(1-out((f-12-j*4)/22)),width:275,height:275,opacity:out((f-12-j*4)/22)}}/>)}</>};
const Report=()=>{const f=useCurrentFrame();return <>
 <div style={{position:'absolute',left:110,top:715,width:845,height:595,background:'#f3f3ed',padding:42,color:'#242b29',boxShadow:'18px 24px 0 #282e35'}}><div style={{fontSize:38,fontWeight:650}}>图案生成 / 过程报告</div><div style={{height:2,background:'#b1b7ad',marginTop:24}}/><div style={{position:'absolute',left:42,top:460,fontSize:31,opacity:out((f-26)/15)}}>本次结果与过程说明</div></div>
 {[4,5,6].map((i,j)=>{const q=out((f-8-j*5)/28);return <Img key={i} src={photo(i)} style={{...resultStyle,position:'absolute',left:mix(80+j*308,150+j*258,q),top:mix(1320,890,q),width:mix(150,230,q),height:mix(150,230,q),transform:`rotate(${(1-q)*(j-1)*12}deg)`}}/>})}
 <div style={{position:'absolute',top:1420,left:0,width:'100%',textAlign:'center',color:data.accent,fontSize:44,opacity:out((f-48)/12)}}>AI 生成 → 检查交付</div>
 </>};
const Section:React.FC<{index:number}>=({index})=><Shell section={index}>{index===0?<Results/>:index===1?<AiInput/>:index===2?<FolderScene mode="collect"/>:index===3?<FolderScene mode="filter"/>:index===4?<Generation/>:<Report/>}</Shell>;
export const Workflow=()=> <AbsoluteFill>{data.sections.map((_,i)=><Sequence key={i} from={i*data.fps*data.sectionSeconds} durationInFrames={data.fps*data.sectionSeconds}><Section index={i}/></Sequence>)}</AbsoluteFill>;
export const FolderSequence=()=> <AbsoluteFill><Sequence durationInFrames={90}><Section index={2}/></Sequence><Sequence from={90} durationInFrames={90}><Section index={3}/></Sequence></AbsoluteFill>;
