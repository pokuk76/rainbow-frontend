import * as actionTypes from './actionTypes';
import { formValidCopy } from '../../utility/form/methods';
import { studentFormValidInitialState, guardianFormValidInitialState } from '../../utility/form/data';

const STUDENT_FORM = 'StudentForm';
const GUARDIAN_FORM = 'GuardianForm';
const RESET_VALUES_ON_DEFAULT = 'RESET_VALUES_ON_DEFAULT';


export const updateGuestInfo = (guestInfo, guestFormValid) => {
    return {
        type: actionTypes.GUEST_INFO,
        guestForm: guestInfo, 
        guestFormValid: guestFormValid, 
    }
}

export const updateImages = (imagesObj) => {
    return {
        type: actionTypes.UPDATE_IMAGES,
        images: imagesObj,
    }
}

export const addImage = (images, id, file) => {
    // console.log('Adding image form id: ', id)
    let newImages = {...images};
    newImages[id] = [file];  // Can't remember why the file data needs to be an array but it does
    // console.log('Images: ', images);

    return dispatch => {
        dispatch( updateImages(newImages) );
    }
}

export const removeImage = (images, id) => {
    let newImages = {...images};
    try {
        delete newImages[id];
    }
    catch (error) {
    }

    return dispatch => {
        dispatch( updateImages(newImages) );
    }
    
}

export const updateStudents = (studentForms, studentFormsValid, studentUID=null) => {
    const action = {
        type: actionTypes.STUDENT_FORM,
        studentForms: studentForms,
        studentFormsValid: studentFormsValid, 
        studentUID: studentUID,
    }
    return action;
}

export const updateGuardians = (guardianForms, guardianFormsValid, guardianUID=null) => {
    const action = {
        type: actionTypes.GUARDIAN_FORM,
        guardianForms: guardianForms, 
        guardianFormsValid: guardianFormsValid, 
        guardianUID: guardianUID,
    }
    return action;
}

export const addForm = (formsObject, formsValid, uid, currentForm) => {
    uid++;  
    let id;
    let newFormSet;
    let newFormValidSet;
    switch(currentForm) {
        case STUDENT_FORM:
            // console.log("StudentUID:", uid);
            id = "StudentForm_" + uid;
            newFormSet = {...formsObject};  // Don't think we need to make a deep copy since we are just adding a formObject
            newFormValidSet = {...formsValid}
            newFormSet[id] = {};
            newFormValidSet[id] = formValidCopy(studentFormValidInitialState);

            return dispatch => {
                dispatch( updateStudents(newFormSet, newFormValidSet, uid) );
            };
        case GUARDIAN_FORM:
            id = "GuardianForm_" + uid;
            newFormSet = {...formsObject};
            newFormValidSet = {...formsValid}
            newFormSet[id] = {};
            newFormValidSet[id] = formValidCopy(guardianFormValidInitialState);
            return dispatch => {
                dispatch( updateGuardians(newFormSet, newFormValidSet, uid) );
            }
        default:
            return {
                type: RESET_VALUES_ON_DEFAULT,
            }
    }
}

export const removeForm = (formsObject, formsValid, uid, currentForm, images) => {
    // let newFormSet = [...formArray];
    // newFormSet.splice(index, 1);

    let newFormSet = {...formsObject};
    let newFormValidSet = {...formsValid}
    delete newFormSet[uid]; 
    delete newFormValidSet[uid];


    switch(currentForm) {
        case STUDENT_FORM:
            return dispatch => {
                dispatch( updateStudents(newFormSet, newFormValidSet) );
                dispatch( removeImage(images, uid) );
            };
        case GUARDIAN_FORM:
            return dispatch => {
                dispatch( updateGuardians(newFormSet, newFormValidSet) );
                dispatch( removeImage(images, uid) );
            };
        default:
            return{
                type: RESET_VALUES_ON_DEFAULT,
            };
    }
}

export const updateDeclaration = (declarationForm, declarationFormValid) => {
    return {
        type: actionTypes.DECLARATION_FORM,
        declarationForm: declarationForm, 
        declarationFormValid: declarationFormValid
    }
}

