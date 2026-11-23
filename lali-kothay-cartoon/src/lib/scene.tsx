import React, {createContext, useContext} from 'react';

export type SceneInfo = {f: number; g: number; start: number; dur: number};
export const SceneCtx = createContext<SceneInfo>({f: 0, g: 0, start: 0, dur: 1});
export const useScene = () => useContext(SceneCtx);

export type Cam = {x: number; y: number; zoom: number; rot?: number; shake?: number};
export const CamCtx = createContext<Cam>({x: 960, y: 540, zoom: 1});
export const useCam = () => useContext(CamCtx);

export const Provider: React.FC<{info: SceneInfo; children: React.ReactNode}> = ({info, children}) => (
	<SceneCtx.Provider value={info}>{children}</SceneCtx.Provider>
);
