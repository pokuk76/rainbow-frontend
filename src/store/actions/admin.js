import axios from 'axios';
import * as actionTypes from './actionTypes';

export const searchStart = () => {
    return {
        type: actionTypes.SEARCH_START
    }
}

export const searchSuccess = (responseData) => {
    return {
        type: actionTypes.SEARCH_SUCCESS,
        searchData: responseData,
    }
}

export const search = (endpoint, searchBy, value, authToken=null) => {
    let config = {
        method: 'get',
        url: `api/${endpoint}?${searchBy}=${value}`,
    };
    if (authToken) {
        config['headers'] = {
            'Authorization': `Token ${authToken}`
        };
    }
    return dispatch => {
        dispatch(authStart());
        // Think just send the reference b/c there are nested things anyway
        axios(config)
        .then(response => {
            dispatch(searchSuccess(response.data));
        })
        .catch(error => {
            dispatch(searchFail(error));
        })
    };
}