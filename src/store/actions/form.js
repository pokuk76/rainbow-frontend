import axios from 'axios';
import * as actionTypes from './actionTypes';
import { guestFormItems, studentFormItems, guardianFormItems, checkValidityItem } from '../../utility/forms';

/* Form Submission */

export const submitStart = (guestFormValid) => {
    let formValid = true;
    for(let item in guestFormValid){
        // var value = guestForm[item];
        // var rules = guestFormItems[item]['validation_rules'];
        // var checkValidityErrors = checkValidityItem(value, rules);
        // if (checkValidityErrors === null) {
        //     formValid = formValid && true;
        // } else {
        //     formValid = formValid && false;
        // }
        formValid = (guestFormValid[item] === null) ? formValid && true : formValid && false;
    }
    let submitStatus = formValid ? actionTypes.SUBMIT_START : actionTypes.SUBMIT_INVALID_FAIL;
    return {
        type: actionTypes.SUBMIT_START, 
        submitStatus: submitStatus, 
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

export const submitSuccess = () => {
    return {
        type: actionTypes.SUBMIT_SUCCESS, 
        submitStatus: actionTypes.SUBMIT_SUCCESS, 
        loading: false, 
    };
}

export const submitFormset = (formsetData) => {
    return dispatch => {
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/formsets/',
            // data: studentFormsData, 
            data: formsetData, 
            headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' }
        })
        .then(response => {
            console.log("POST response:", response);
            const guest_id = response.data['id'];
            // handleStudentForms(guest_id, studentForms, images);
            dispatch(submitSuccess());
        })
        .catch(error => {
            console.log("POST error:", error);
            // return (dispatch) => {
            //     console.log("Dispatching submitNetworkFail...");
            //     dispatch(submitNetworkFail());
            // };
            dispatch(submitNetworkFail());
        });
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
    let keyUID = key.concat("+image_file");
    try {
        console.log("Image: ", images[key][0]);
        image_blob = images[key][0];
        form.append(keyUID, image_blob, image_blob['name']);
    } catch(error) {
    }
    return form;
}

/**
* Create and validate the guest form
* @param {Event} e - A change event?
*/
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

// const createStudentForm = (guest_id, studentForm, key, images) => {
//     let form_data = new FormData();
//     const keys = ['first_name', 'middle_name', 'last_name', 'nationality', 'religion', 'sex', 'date_of_birth', 'has_ailments', 'former_school', 'former_school_address', 'class_reached', 'reason_for_leaving']

//     let value;
//     for (let key of keys) {
//         if (!studentForm[key]) {
//             form_data.append(key, "");
//         } else {
//             form_data.append(key, studentForm[key]);
//         }
//     }
//     form_data = handleImage(form_data, images, key);
//     form_data.append('guest_user', guest_id); 
//     for (let entry of form_data.entries()) {
//         console.log("form data entry: ", entry);
//     }
//     return form_data;
// }

const createStudentForm = (studentForm, key, images) => {
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
    // for (let entry of form_data.entries()) {
    //     console.log("form data entry: ", entry);
    // }
    return form_data;
}

const createFormsData = (studentForms, images, formItemsObj) => {
    let studentFormsData = new FormData();
    let formDataKey = "";
    let numForms = 0
    for(let formKey in studentForms) {
        // for(let elementKey in studentForms[formKey]) {
        for(let elementKey in formItemsObj) {
            formDataKey = formKey.concat("+", elementKey);
            // studentFormsData = createStudentForm(guest_id, studentForms[key], key, images);
            // studentFormsData.append(formDataKey, studentForms[formKey][elementKey]);
            if (!studentForms[formKey][elementKey]) {
                studentFormsData.append(formDataKey, "");
            } else if (elementKey==="date_of_birth"){
                let dateString = studentForms[formKey][elementKey].format("YYYY-MM-DD")
                studentFormsData.append(formDataKey, dateString);
            } else {
                studentFormsData.append(formDataKey, studentForms[formKey][elementKey]);
            }
        }
        studentFormsData = handleImage(studentFormsData, images, formKey);
        numForms += 1;
    }
    // console.log("Student forms FormData object [handleStudentForms]: ");
    // for (let entry of studentFormsData.entries()) {
    //     console.log("form data entry: ", entry);
    // }
    return [studentFormsData, numForms];
}

export const handleSubmit = (guestForm, studentForms, guardianForms, declarationForm, images) => {

    let [studentFormsData, numStudents] = createFormsData(studentForms, images, studentFormItems);
    let [guardianFormsData, numGuardians] = createFormsData(guardianForms, images, guardianFormItems);
    studentFormsData.append("numStudents", numStudents);
    guardianFormsData.append("numGuardians", numGuardians);

    let guestFormData = createGuestForm(guestForm, images);

    let formsetData = new FormData();
    for (let [key, value] of guestFormData.entries()) {
        // console.log("Guest form data entry: ", [key, value]);
        formsetData.append(key, value)
    }
    for (let [key, value] of studentFormsData.entries()) {
        // console.log("Student forms data entry: ", [key, value]);
        formsetData.append(key, value)
    }
    for (let [key, value] of guardianFormsData.entries()) {
        // console.log("Guardian forms data entry: ", [key, value]);
        formsetData.append(key, value)
    }

    return (dispatch, getState) => {
        // const submitStatus = {...getState().form.submitStatus};
        // const guestFormValid = {...getState().form.guestFormValid};
        const guestFormValid = {...getState().guest.guestFormValid}; 
        const guestForm = {...getState().guest.guestForm}; 

        dispatch(submitStart(guestFormValid));
        if( getState().form.submitStatus === actionTypes.SUBMIT_INVALID_FAIL ) {
            dispatch(submitInvalidFail());
        } else {
            /* I guess we should do the actual POSTing of the form
                Should we do it all in here, or create another action creator and reducer?
              */
            // submitFormset(formsetData);
            // if( getState().form.submitStatus === actionTypes.SUBMIT_NETWORK_FAIL ) {
            //     dispatch(submitSuccess());
            // } else {

            // }
            axios({
                method: 'post',
                url: 'http://127.0.0.1:8000/api/formsets/',
                // data: studentFormsData, 
                data: formsetData, 
                headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' }
            })
            .then(response => {
                console.log("POST response:", response); 
                dispatch(submitSuccess()); 
            })
            .catch(error => {
                console.log("POST error:", error); 
                dispatch(submitNetworkFail()); 
            });
        }
        /* POST Guest Form */

        // for (let [key, value] of studentFormsData.entries()) {
        //     // console.log("form data entry: ", entry);
        //     guestFormData.append(key, value);
        // }

        // axios({
        //     method: 'post',
        //     url: 'http://127.0.0.1:8000/api/formsets/',
        //     // data: studentFormsData, 
        //     data: formsetData, 
        //     headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' }
        // })
        // .then(response => {
        //     console.log("POST response:", response);
        //     const guest_id = response.data['id'];
        //     // handleStudentForms(guest_id, studentForms, images); 
        // })
        // .catch(error => {
        //     console.log("POST error:", error);
        // });
        
    };
}