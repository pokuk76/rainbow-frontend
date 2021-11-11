import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utility';

const initialState = {
    searchData: null,
    error: null,
    loading: false
}

const searchStart = (state, action) => {
    return updateObject(state, {
        loading: true
    });
}

const searchSuccess = (state, action) => {
    return updateObject(state, {
        searchData: action.searchData,
        error: null,
        loading: false,
    });
}

const searchFail = () => {
    
}

const adminReducer = (state=initialState, action) => {
    switch (action.type){
        case actionTypes.SEARCH_START:
            return searchStart(state, action);
        case actionTypes.SEARCH_SUCCESS:
            return searchSuccess(state, action);
        case actionTypes.SEARCH_FAIL:
            return searchFail(state, action);
        default:
            return state;
    }
}

export default adminReducer;