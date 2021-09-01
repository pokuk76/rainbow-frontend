import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utility';
import { 
    studentFormValidInitialState, guardianFormValidInitialState 
} from '../../utility/form/data';
import { formValidCopy } from '../../utility/form/methods';

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
        "StudentForm_0": formValidCopy(studentFormValidInitialState), 
    }, 
    guardianForms: { "GuardianForm_0": {}, }, 
    guardianUID: 0, 
    guardianFormsValid: { 
        "GuardianForm_0": formValidCopy(guardianFormValidInitialState), 
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
    /** @property images - key-value pairs where the key is the form UID and the value is a singleton array holding an image file object */
    images: {}, 
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