import React, { createContext, useContext, useReducer} from "react";

// prepara l'insieme di dati 
export const StateContext = createContext();


//
export const StateProvider = ({ reducer, initialState, children }) => 
( <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
</StateContext.Provider> 
);


//ottenere i dati
export const useStateValue = () => useContext(StateContext);