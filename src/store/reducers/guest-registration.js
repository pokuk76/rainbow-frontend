import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    username_valid: null,
    guestForm: {},
    studentForms: { "StudentForm_0": {}, },
    studentUID: 0,
    guardianForms: { "GuardianForm_0": {}, },
    guardianUID: 0,
    declarationForm: {},
    images: {}  // key-value pairs where the key is the form uid 
                // and the value is an array holding a single image file object 
}

const updateGuestInfo = (state, action) => {
    return updateObject(state, 
        (action.images==={})
        ?
        {
            guestForm: action.guestForm,
        }
        :
        {
            guestForm: action.guestForm,
            images: action.images
        } 
    );
}

const updateStudents = (state, action) => {
    // return updateObject(state, {
    //     studentForms: action.studentForms,
    //     studentUID: action.studentUID,
    //     images: action.images
    // });

    return updateObject(
        state, 
        (action.studentUID === null)
        ?
        {
            studentForms: action.studentForms,
            images: action.images
        }
        :
        {
            studentForms: action.studentForms,
            studentUID: action.studentUID,
            images: action.images
        }
    )
}

const updateGuardians = (state, action) => {

    return updateObject(
        state, 
        (action.guardianUID === null)
        ?
        {
            guardianForms: action.guardianForms,
            images: action.images
        }
        :
        {
            guardianForms: action.guardianForms,
            guardianUID: action.guardianUID,
            images: action.images
        }
    )
    // return updateObject(state, {
    //     guardianForms: action.guardianForms,
    //     guardianUID: action.guardianUID,
    //     images: action.images
    // });
}

const updateDeclaration = (state, action) => {
    return updateObject(state, {
        declarationForm: action.declarationForm
    });
}

const guestReducer = (state=initialState, action) => {
    switch (action.type){
        case actionTypes.GUEST_INFO:
            return updateGuestInfo(state, action);
        case actionTypes.GUARDIAN_FORM:
            return updateGuardians(state, action);
        case actionTypes.STUDENT_FORM:
            return updateStudents(state, action);
        case actionTypes.DECLARATION_FORM:
            return updateDeclaration(state, action);
        default:
            return state;
    }
}

export default guestReducer;