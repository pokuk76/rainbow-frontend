import axios from 'axios';
import * as actionTypes from './actionTypes';
import { checkValidityElement } from '../../utility/forms';

/* Form Submission */

export const submitStart = () => {
    return {
        type: actionTypes.SUBMIT_START, 
        submitStatus: actionTypes.SUBMIT_START, 
        loading: true, 
    };
}

export const submitNetworkFail = () => {
    return {
        type: actionTypes.SUBMIT_NETWORK_FAIL, 
        submitStatus: actionTypes.SUBMIT_NETWORK_FAIL, 
        loading: false, 
    };
}

export const submitInvalidFail = () => {
    return {
        type: actionTypes.SUBMIT_INVALID_FAIL, 
        submitStatus: actionTypes.SUBMIT_INVALID_FAIL, 
        loading: false, 
    };
}

export const submitGuestFormSuccess = () => {
    
}

export const submitSuccess = () => {
    return {
        type: actionTypes.SUBMIT_SUCCESS, 
        submitStatus: actionTypes.SUBMIT_SUCCESS, 
        loading: false, 
    };
}

const handleGuestForm = () => {
    // checkValidityForm
}

// const handleImages = (form, images) => {
//     let formType; // GuestForm, StudentForm, GuardianForm
//     for (let imageKey in images){
//       formType = imageKey.split('_')[0];
//       switch(formType) {
//         case "GuestForm":
//           console.log("Image: ", images[imageKey][0]);
//           let image_blob = images[imageKey][0];
//           form.append('image_file', image_blob, image_blob['name']);
//           return form;
//         case "StudentForm":
//           break;
//         case "GuardianForm":
//           break;
//       }
//     }

//     return form;
// }

const handleImage = (form, images, key) => {
    let image_blob;
    console.log("Image: ", images[key][0]);
    try {
        image_blob = images[key][0];
        form.append('image_file', image_blob, image_blob['name']);
    } catch(error) {
    }
    return form;
}

const createGuestForm = (guestForm, images) => {
    let form_data = new FormData();
    const keys = ['username', 'first_name', 'middle_name', 'last_name']

    let value;
    for (let key of keys) {
        if (!guestForm[key]) {
            form_data.append(key, null);
        } else {
            form_data.append(key, guestForm[key]);
        }
    }
    // form_data = handleImage(form_data, images);
    // form_data.append('image_file', null);
    for (let entry of form_data.entries()) {
        console.log("form data entry: ", entry);
    }
    return form_data;
}

const createStudentForm = (guest_id, studentForm, key, images) => {
    let form_data = new FormData();
    const keys = ['first_name', 'middle_name', 'last_name', 'nationality', 'religion', 'sex', 'date_of_birth', 'has_ailments', 'former_school', 'former_school_address', 'class_reached', 'reason_for_leaving']

    let value;
    for (let key of keys) {
        if (!studentForm[key]) {
            form_data.append(key, "");
        } else {
            form_data.append(key, studentForm[key]);
        }
    }
    form_data = handleImage(form_data, images, key);
    form_data.append('guest_user', guest_id); 
    for (let entry of form_data.entries()) {
        console.log("form data entry: ", entry);
    }
    return form_data;
}

const handleStudentForms = (guest_id, studentForms, images) => {
    let studentFormData;
    for(let key in studentForms) {
        studentFormData = createStudentForm(guest_id, studentForms[key], key, images);
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/students/',
            // data: guestForm, 
            data: studentFormData, 
            headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' }
        })
        .then(response => {
            console.log("Student POST response:", response);
        })
        .catch(error => {
            console.log("Student POST error:", error);
        });
    }
    
}

export const handleSubmit = (guestForm, studentForms, guardianForms, declarationForm, images) => {
    // let guestFormData = {...guestForm}; 
    // guestFormData['image_file'] = null;
    return dispatch => {
        dispatch(submitStart);
        /* POST Guest Form */
        let guestFormData = createGuestForm(guestForm, images);
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/guests/',
            // data: guestForm, 
            data: guestFormData, 
            headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' }
        })
        .then(response => {
            console.log("POST response:", response);
            const guest_id = response.data['id'];
            handleStudentForms(guest_id, studentForms, images); 
        })
        .catch(error => {
            console.log("Guest POST error:", error);
        });
    };
}