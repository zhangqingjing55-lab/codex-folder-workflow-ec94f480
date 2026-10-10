import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Workflow, FolderSequence} from './Workflow';
import data from './content.json';
const Root=()=> <>
 <Composition id="Workflow" component={Workflow} width={data.width} height={data.height} fps={data.fps} durationInFrames={data.fps*data.sectionSeconds*data.sections.length}/>
 <Composition id="FolderSequence" component={FolderSequence} width={data.width} height={data.height} fps={data.fps} durationInFrames={180}/>
</>;
registerRoot(Root);
