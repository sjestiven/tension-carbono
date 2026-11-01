import { createContext, useContext } from 'react';
export const ResearchContext = createContext(null);
export const useResearch = () => useContext(ResearchContext);
