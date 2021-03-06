import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utility/utility';

const initialState = {
    // username_valid: null,
    guestForm: {}, 
    guestFormValid: {
        // Valid if the element is null (should probably rename it from guestFormValid to something like GuestFormErrors so it makes more sense)
        username: { validateStatus: "error", help: "Username required" },  // So this is initially invalid
        first_name: { validateStatus: "error", help: "First Name Required" }, 
        middle_name: null, 
        last_name: { validateStatus: "error", help: "Last Name Required" }, 
    }, 
    studentForms: { "StudentForm_0": {}, },
    studentUID: 0, 
    studentFormsValid: { 
        "StudentForm_0": { 
            first_name: { validateStatus: "error", help: "First Name required" }, 
            middle_name: null, 
            last_name: { validateStatus: "error", help: "Last Name required" }, 
            sex: { validateStatus: "error", help: "Please specify child's sex" }, 
            date_of_birth: { validateStatus: "error", help: "Please provide a date of birth" }, 
            nationality: { validateStatus: "error", help: "Please specify child's nationality" }, 
            religion: null,  
            has_ailments: null, 
            former_school: null, 
            former_school_address: null, 
            class_reached: null, 
            reason_for_leaving: null, 
        }, 
    }, 
    guardianForms: { "GuardianForm_0": {}, }, 
    guardianUID: 0, 
    guardianFormsValid: { 
        "GuardianForm_0": { 
            first_name: { validateStatus: "error", help: "First Name required" }, 
            middle_name: null, 
            last_name: { validateStatus: "error", help: "Last Name required" }, 
            phone_number: { validateStatus: "error", help: "Please input a phone number" }, 
            email_address: null, 
            nationality: { validateStatus: "error", help: "Please specify a nationality" }, 
            religion: null, 
            guardian_type: { validateStatus: "error", help: "Please specify this guardian's relationship with the students" }, 
            lives_with_guardian: { validateStatus: "error", help: "Please indicate which children live with this parent" }, 
            occupation: null, 
            place_of_work: null, 
            home_address: null, 
            postal_address: null, 
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
    declarationForm: {
        declaration_read: false, 
        signature: '', 
        date: '',
    }, 
    declarationFormValid: {
        declaration_read: { validateStatus: "error", help: "Please indicate that you have read & understood this declaration" },  // So this is initially invalid
        signature: { validateStatus: "error", help: "Electronic signature required" }, 
        date: { validateStatus: "error", help: "Please enter today's date" }, 
    }, 
    images: {},  // key-value pairs where the key is the form UID 
                // and the value is an array holding a single image file object 
}

const updateImages = (state, action) => {
    return updateObject(state, {
        images: action.images,
    })
}

const updateGuestInfo = (state, action) => {
    return updateObject(state, { 
        guestForm: action.guestForm, 
        guestFormValid: action.guestFormValid, 
    });
}

const updateStudents = (state, action) => {

    return updateObject(
        state, 
        (action.studentUID === null)
        ?
        {
            studentForms: action.studentForms, 
            studentFormsValid: action.studentFormsValid, 
        }
        :
        {
            studentForms: action.studentForms, 
            studentFormsValid: action.studentFormsValid, 
            studentUID: action.studentUID, 
        }
    );
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
        declarationForm: action.declarationForm, 
        declarationFormValid: action.declarationFormValid,
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