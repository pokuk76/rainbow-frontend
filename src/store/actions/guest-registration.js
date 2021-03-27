import axios from 'axios';
import * as actionTypes from './actionTypes';

const GUEST_INFO = 'GuestForm';
const STUDENT_FORM = 'StudentForm';
const GUARDIAN_FORM = 'GuardianForm';
const DECLARATION_FORM = 'DeclarationForm';
const RESET_VALUES_ON_DEFAULT = 'RESET_VALUES_ON_DEFAULT';

export const updateGuestInfo = (guestInfo, images={}) => {
    return {
        type: actionTypes.GUEST_INFO,
        guestForm: guestInfo,
        images: images
    }
}

export const updateImages = (images, currentForm, formData) => {
    switch(currentForm){
        case GUEST_INFO:
            return dispatch => {
                dispatch( updateGuestInfo(formData, images) );
            }
        case STUDENT_FORM:
            return dispatch => {
                dispatch( updateStudents(formData, null, images) );
            }
        case GUARDIAN_FORM:
            return dispatch => {
                dispatch( updateGuardians(formData, null, images) );
            }
        default:
            return{
                type: RESET_VALUES_ON_DEFAULT,
            }
    }
}

export const addImage = (images, id, file, formData) => {
    console.log('Adding image form id: ', id)
    images[id] = [file];    //Can't remember why the file data needs to be an array but it does
    const currentForm = id.split('_')[0];
    console.log('Images: ', images);

    return dispatch => {
        dispatch( updateImages(images, currentForm, formData) );
    }
}

// beforeUpload: file => {
//     this.setState(state => ({
//       fileList: [...state.fileList, file],
//     }));
//     console.log("image file", file);
//     console.log("image file", file);
//     return false;
//   }

export const removeImage = (images, id, formData) => {
    delete images[id];
    const currentForm = id.split('_')[0];

    return dispatch => {
        dispatch( updateImages(formData, images, currentForm) );
    }
    
}

// onRemove: file => {
//     this.setState(state => {
//         const index = state.fileList.indexOf(file);
//         const newFileList = state.fileList.slice();
//         newFileList.splice(index, 1);
//         return {
//         fileList: newFileList,
//         };
//     });
// }

export const updateGuardians = (guardianForms, guardianUID=null, images={}) => {
    const action = {
        type: actionTypes.GUARDIAN_FORM,
        guardianForms: guardianForms,
        images: images,
        guardianUID: guardianUID,
    }
    return action;
}

// updateGuardians might be the only useful function here
export const addForm = (formObject, uid, currentForm, images) => {
    uid++;  
    switch(currentForm) {
        case STUDENT_FORM:
            console.log("StudentUID:", uid);
            var id = "StudentForm_" + uid;
            var newFormSet = {...formObject};
            newFormSet[id] = {};
            return dispatch => {
                dispatch( updateStudents(newFormSet, uid) );
            };
        case GUARDIAN_FORM:
            var id = "GuardianForm_" + uid;
            var newFormSet = {...formObject};
            newFormSet[id] = {};
            return dispatch => {
                dispatch( updateGuardians(newFormSet, uid, images) );
            }
        default:
            return{
                type: RESET_VALUES_ON_DEFAULT,
            }
    }
}

export const removeForm = (formObject, uid, currentForm, images) => {
    // let newFormSet = [...formArray];
    // newFormSet.splice(index, 1); 
    let newFormSet = {...formObject};
    delete newFormSet[uid]; 


    switch(currentForm) {
        case STUDENT_FORM:
            return dispatch => {
                dispatch( updateStudents(newFormSet) );
            }
        case GUARDIAN_FORM:
            return dispatch => {
                dispatch( updateGuardians(newFormSet, null, images) );
            }
        default:
            return{
                type: RESET_VALUES_ON_DEFAULT,
            }
    }
}

export const updateStudents = (studentForms, studentUID=null, images={}) => {
    const action = {
        type: actionTypes.STUDENT_FORM,
        studentForms: studentForms,
        images: images,
        studentUID: studentUID,
    }
    return action;
}

// export const updateStudents = (studentForms, studentUID=null, images={}) => {
//     const action = (studentUID === null)
//     ?
//     {
//         type: actionTypes.STUDENT_FORM,
//         studentForms: studentForms,
//         images: images,
//     }
//     :
//     {
//         type: actionTypes.STUDENT_FORM,
//         studentForms: studentForms,
//         images: images,
//         studentUID: studentUID,
//     }
//     return action;
// }

export const updateDeclaration = (declarationForm) => {
    return {
        type: actionTypes.DECLARATION_FORM,
        declarationForm: declarationForm
    }
}

