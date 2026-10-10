import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {arc, arrivals, cardPosition, clamp, flightDuration, mix, out} from './motion';
import content from './content.json';

// Original vector helper, inspired by the physical acting in the reference.
// It is not an official product mascot or a traced frame from the source video.
export const Helper: React.FC<{x?:number;y?:number;pose?:number;scale?:number}> = ({x=105,y=1080,pose=0,scale=1}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx="106" cy="328" rx="117" ry="20" fill="#000" opacity=".22"/>
    <g transform={`translate(0 ${-Math.abs(pose)*10}) rotate(${-pose*6} 108 275)`}>
      <path d="M79 258 L69 303 L44 307 M137 258 L147 302 L170 306" fill="none" stroke="#6693ff" strokeWidth="25" strokeLinecap="round"/>
      <path d={`M51 211 Q8 ${226+pose*35} 19 ${255+pose*20}`} fill="none" stroke="#5387f1" strokeWidth="25" strokeLinecap="round"/>
      <path d={`M160 205 Q207 ${194-pose*65} ${225+pose*15} ${177-pose*90}`} fill="none" stroke="#79a1ff" strokeWidth="25" strokeLinecap="round"/>
      <ellipse cx={225+pose*15} cy={177-pose*90} rx="18" ry="18" fill="#b2ceff"/>
      <rect x="53" y="185" width="106" height="96" rx="31" fill="url(#robotBody)" stroke="#96b6ff" strokeWidth="4"/>
      <rect x="72" y="214" width="68" height="32" rx="9" fill="#17315d"/>
      <text x="106" y="236" fontSize="16" fill="#ddeeff" textAnchor="middle" fontWeight="700">{content.helperLabel}</text>
      <path d="M108 67 L108 35" stroke="#88acff" strokeWidth="9"/>
      <circle cx="108" cy="25" r="13" fill="#d0ff54"/>
      <rect x="0" y="80" width="28" height="74" rx="12" fill="#4778dc"/>
      <rect x="190" y="80" width="28" height="74" rx="12" fill="#4778dc"/>
      <rect x="13" y="56" width="194" height="144" rx="47" fill="url(#robotBody)" stroke="#92b1ff" strokeWidth="5"/>
      <rect x="37" y="82" width="148" height="91" rx="26" fill="#102341" stroke="#b6d1ff" strokeWidth="3"/>
      <path d="M65 110 L83 126 L65 142 M104 143 L131 143" fill="none" stroke="#c1ecff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="163" cy="120" r="5" fill="#b6ff6a"/>
    </g>
  </g>
);

const MotifCard: React.FC<{x:number;y:number;rotation?:number;bad?:boolean;scale?:number;opacity?:number}> = ({x,y,rotation=0,bad=false,scale=1,opacity=1}) => (
 <g transform={`translate(${x} ${y}) rotate(${rotation} 66 66) scale(${scale})`} opacity={opacity}>
  <rect x="3" y="9" width="140" height="145" rx="12" fill="#132a40" opacity=".19"/>
  <rect width="140" height="145" rx="12" fill="#fafbf6" stroke={bad?'#f58a4d':'#dce9ee'} strokeWidth="4"/>
  <rect x="11" y="11" width="118" height="105" rx="6" fill={bad?'#eddacb':'#e2eedf'}/>
  {bad ? <path d="M28 98 L67 28 L112 98 Z M44 88 L67 47 L94 88" fill="none" stroke="#d77839" strokeWidth="6"/> : <g transform="translate(70 64)" stroke="#688461" strokeWidth="4" fill="none"><circle r="38"/>{[0,60,120].map(r=><ellipse key={r} rx="39" ry="15" transform={`rotate(${r})`}/>)}</g>}
  <rect x="15" y="126" width="72" height="5" rx="2" fill="#aab5b7"/>
 </g>
);

export const FolderScene: React.FC<{mode:'collect'|'filter'}> = ({mode}) => {
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps,filter=mode==='filter';
 const throwPose=filter?Math.sin(clamp((t-.3)/1.55)*Math.PI):arrivals.reduce((v,start)=>v+Math.sin(clamp((t-start+.12)/.38)*Math.PI),0)*.45;
 const rejected=[2,4];
 const cards=Array.from({length:6},(_,i)=>{
   const target=cardPosition(i),bad=rejected.includes(i);
   if(filter){
    const start=i===2?.55:1.35,p=bad?clamp((t-start)/.75):0;
    const [x,y]=bad?arc(p,target,[1160,1450],150):target;
    return <MotifCard key={i} x={x} y={y} bad={bad} rotation={bad?p*170:0} opacity={p>.9?1-(p-.9)*10:1}/>;
   }
   const p=clamp((t-arrivals[i])/flightDuration(i));
   if(t<arrivals[i])return null;
   const [x,y]=arc(p,[236,1148],target,330);
   const settle=p===1?Math.sin((t-arrivals[i]-flightDuration(i))*24)*Math.exp(-(t-arrivals[i]-flightDuration(i))*12)*5:0;
   return <MotifCard key={i} x={x} y={y+settle} bad={bad} rotation={mix(-28,0,p)+(p<1?Math.sin(p*Math.PI)*23:0)}/>;
 });
 return <svg width="1080" height="1920" style={{position:'absolute',inset:0}}>
  <defs>
   <linearGradient id="folderBack" x2="0" y2="1"><stop stopColor="#b4ddff"/><stop offset="1" stopColor="#5479db"/></linearGradient>
   <linearGradient id="folderFront" x2=".1" y2="1"><stop stopColor="#80b5ff"/><stop offset="1" stopColor="#456fd4"/></linearGradient>
   <linearGradient id="robotBody" x2="1" y2="1"><stop stopColor="#a5bcff"/><stop offset=".5" stopColor="#638aff"/><stop offset="1" stopColor="#3458b9"/></linearGradient>
  </defs>
  <ellipse cx="612" cy="1395" rx="410" ry="46" fill="#35599d" opacity=".16"/>
  <path d="M318 785 Q318 737 366 737 L552 737 L598 796 L913 796 Q953 796 953 836 L953 1325 Q953 1360 918 1360 L351 1360 Q318 1360 318 1325 Z" fill="url(#folderBack)" stroke="#a4c9fb" strokeWidth="4"/>
  <path d="M350 833 L920 833" stroke="#d4ebff" strokeWidth="4" opacity=".6"/>
  {cards}
  <path d="M299 1097 Q294 1065 329 1065 L936 1065 Q972 1065 967 1103 L941 1350 Q938 1380 903 1380 L354 1380 Q323 1380 320 1350 Z" fill="url(#folderFront)" stroke="#97bcff" strokeWidth="4"/>
  <text x="640" y="1212" fontSize="64" fontWeight="700" textAnchor="middle" fill="#f6fbff">{content.folderLabel}</text>
  <text x="640" y="1270" fontSize="29" textAnchor="middle" fill="#dcecff">{filter?'保留风格一致的图片':'先批量收集，再人工筛选'}</text>
  <Helper pose={throwPose}/>
  {filter && <g opacity={out(t/.25)}><rect x="137" y="572" width="805" height="83" rx="12" fill="#ffab67"/><text x="540" y="628" textAnchor="middle" fontSize="39" fontWeight="650" fill="#332313">人工判断：这些风格不一致</text></g>}
  {!filter && <g opacity={out((t-2.25)/.3)}><rect x="469" y="619" width="400" height="83" rx="20" fill="#d0ff54"/><text x="669" y="675" textAnchor="middle" fontSize="40" fontWeight="700" fill="#20320c">约 50 张候选</text></g>}
  {filter&&rejected.map((i,j)=>{const p=clamp((t-(j?.95:.20))/.18);const end=j?1.35:.55;return t<end?<g key={i} opacity={p}><circle cx={cardPosition(i)[0]+126} cy={cardPosition(i)[1]+12} r="26" fill="#ee753c"/><text x={cardPosition(i)[0]+126} y={cardPosition(i)[1]+24} fontSize="40" textAnchor="middle" fill="white">×</text></g>:null})}
 </svg>;
};
