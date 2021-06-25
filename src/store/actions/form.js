import axios from 'axios';
import * as actionTypes from './actionTypes';
import { guestFormItems, studentFormItems, guardianFormItems, declarationFormItems } from '../../utility/forms';
import StudentForm from '../../GuestApp/components/StudentForm';

/* Form Submission */

export const submitStart = (guestFormValid, studentFormsValid, guardianFormsValid, declarationFormValid) => {
    let formValid = true;
    for(let item in guestFormValid){
        formValid = (guestFormValid[item] === null) ? formValid && true : formValid && false;
    }
    for(let formKey in studentFormsValid){
        // for(let field in studentFormItems) {
        for(let field in studentFormsValid[formKey]) {
            formValid = (studentFormsValid[formKey][field] === null) ? formValid && true : formValid && false;
        }
    }
    for(let formKey in guardianFormsValid){
        for(let field in guardianFormsValid[formKey]) {
            formValid = (guardianFormsValid[formKey][field] === null) ? formValid && true : formValid && false;
        }
    }
    for(let item in declarationFormValid){
        formValid = (declarationFormValid[item] === null) ? formValid && true : formValid && false;
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
            url: 'api/formsets/',
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
const createGuestForm = (guestForm, images, formFieldsObj, formPrefix) => {
    let form_data = new FormData();
    // for (let key of keys) {
    for (let key in formFieldsObj) {
        if (key !== "declaration_read") {  // declaration_read is not needed on the back end
            if (!guestForm[key]) {
                form_data.append(formPrefix.concat('+', key), null);
            } else {
                form_data.append(formPrefix.concat('+', key), guestForm[key]);
            }
        }
    }
    // form_data = handleImage(form_data, images);
    // form_data.append('image_file', null);
    for (let entry of form_data.entries()) {
        console.log("form data entry: ", entry);
    }
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

export const handleSubmit = (guestForm, studentForms, guardianForms, declarationForm, images, kwargs={}) => {

    let [studentFormsData, numStudents] = createFormsData(studentForms, images, studentFormItems);
    let [guardianFormsData, numGuardians] = createFormsData(guardianForms, images, guardianFormItems);
    studentFormsData.append("numStudents", numStudents);
    guardianFormsData.append("numGuardians", numGuardians);

    let guestFormData = createGuestForm(guestForm, images, guestFormItems, 'GuestForm_0');
    let declarationData = createGuestForm(declarationForm, images, declarationFormItems, 'Declaration_0');


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
    for (let [key, value] of declarationData.entries()) {
        console.log("Declaration data entry: ", [key, value]);
        formsetData.append(key, value)
    }

    return (dispatch, getState) => {
        // const submitStatus = {...getState().form.submitStatus};
        const guestFormValid = {...getState().guest.guestFormValid}; 
        const studentFormsValid = {...getState().guest.studentFormsValid};
        const guardianFormsValid = {...getState().guest.guardianFormsValid};
        const declarationFormValid = {...getState().guest.declarationFormValid};
        const guestForm = {...getState().guest.guestForm}; 

        dispatch(submitStart(guestFormValid, studentFormsValid, guardianFormsValid, declarationFormValid));
        if( getState().form.submitStatus === actionTypes.SUBMIT_INVALID_FAIL ) {
            dispatch(submitInvalidFail());
            kwargs['invalidFormCallback']();
        } else {
            /* I guess we should do the actual POSTing of the form
                Should we do it all in here, or create another action creator and reducer?
              */
            axios({
                method: 'post',
                url: 'api/formsets/',
                // data: studentFormsData, 
                data: formsetData, 
                headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' }
            })
            .then(response => {
                console.log("POST response:", response); 
                dispatch(submitSuccess());
                kwargs['successCallback'](); 
            })
            .catch(error => {
                console.log("POST error:", error); 
                dispatch(submitNetworkFail()); 
                kwargs['networkErrorCallback']();
            });
        }
        
    };
}