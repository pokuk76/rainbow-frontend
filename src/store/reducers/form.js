import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utility/utility';

const initialState = {
    submitStatus: null,  // Set to the Form actionTypes when a submit is initiated
    // guestFormValid: {
    //     // Valid if the element is null (should probably rename it from guestFormValid to something like GuestFormErrors so it makes more sense)
    //     username: { required: true, message: "Username Required" },  // So this is initially invalid
    //     first_name: { required: true, message: "First Name Required" }, 
    //     middle_name: null, 
    //     last_name: { required: true, message: "Last Name Required" }, 
    // }, 
    loading: false, 
}


const updateGuestFormValid = (state, action) => {
    return updateObject(state, {
        guestFormValid: action.guestFormValid,  
    });
}
/** 
 * All the reducer functions are the same right now because we set things in the form actions
 * So that's something to think about refactoring
 **/

const submitStart = (state, action) => {
    return updateObject(state, {
        submitStatus: action.submitStatus, 
        loading: action.loading, 
    });
}

const submitNetworkFail = (state, action) => {
    return updateObject(state, {
        submitStatus: action.submitStatus, 
        loading: action.loading, 
    });
}

const submitInvalidFail = (state, action) => {
    return updateObject(state, {
        submitStatus: action.submitStatus, 
        loading: action.loading, 
    });
}

const submitSuccess = (state, action) => {
    return updateObject(state, {
        submitStatus: action.submitStatus, 
        loading: action.loading, 
    });
}

const formReducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.SUBMIT_START:
            return submitStart(state, action);
        case actionTypes.SUBMIT_NETWORK_FAIL:
            return submitNetworkFail(state, action);
        case actionTypes.SUBMIT_INVALID_FAIL:
            return submitInvalidFail(state, action);
        case actionTypes.SUBMIT_SUCCESS:
            return submitSuccess(state, action);
        default:
            return state;
    }
}

export default formReducer;