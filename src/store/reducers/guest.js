import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    // username_valid: null,
    guestForm: {}, 
    guestFormValid: {
        username: true, 
        first_name: true, 
        middle_name: true, 
        last_name: true, 
    }, 
    studentForms: { "StudentForm_0": {}, },
    studentUID: 0, 
    studentFormsValid: { 
        "StudentForm_0": { 
            first_name: true, 
            middle_name: true, 
            last_name: true, 
            nationality: true, 
            religion: true, 
            sex: true, 
            date_of_birth: true, 
            has_ailments: true, 
            former_school: true, 
            former_school_address: true, 
            class_reached: true, 
            reason_for_leaving: true, 
        }, 
    }, 
    guardianForms: { "GuardianForm_0": {}, }, 
    guardianUID: 0, 
    guardianFormsValid: { 
        "GuardianForm_0": { 
            first_name: true, 
            last_name: true, 
            phone_number: true, 
            email_address: true, 
            nationality: true, 
            religion: true, 
            guardian_type: true, 
            lives_with_guardian: true, 
            occupation: true, 
            place_of_work: true, 
            home_address: true, 
            postal_address: true, 
        }, 
    }, 
    guardianFormsTouched: { 
        "GuardianForm_0": {
            first_name: false, 
            last_name: false, 
            phone_number: false, 
            email_address: false, 
            nationality: false, 
            religion: false, 
            guardian_type: false, 
            lives_with_guardian: false, 
            occupation: false, 
            place_of_work: false, 
            home_address: false, 
            postal_address: false, 
        }, 
    }, 
    declarationForm: {},
    images: {},  // key-value pairs where the key is the form UID 
                // and the value is an array holding a single image file object 
    submitStatus: null, 
}

const updateImages = (state, action) => {
    return updateObject(state, {
        images: action.images,
    })
}

const updateGuestInfo = (state, action) => {
    return updateObject(state, { guestForm: action.guestForm, });
}

const updateStudents = (state, action) => {

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
            guardianFormsValid: action.guardianFormsValid, 
        }
        :
        {
            guardianForms: action.guardianForms, 
            guardianFormsValid: action.guardianFormsValid, 
            guardianUID: action.guardianUID,
        }
    )
}

const updateDeclaration = (state, action) => {
    return updateObject(state, {
        declarationForm: action.declarationForm
    });
}

const guestReducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.GUEST_INFO:
            return updateGuestInfo(state, action);
        case actionTypes.GUARDIAN_FORM:
            return updateGuardians(state, action);
        case actionTypes.STUDENT_FORM:
            return updateStudents(state, action);
        case actionTypes.DECLARATION_FORM:
            return updateDeclaration(state, action);
        case actionTypes.UPDATE_IMAGES:
            return updateImages(state, action);
        default:
            return state;
    }
}

export default guestReducer;