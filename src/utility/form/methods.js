import React from 'react';
import { Form, Input, Select, Upload, DatePicker } from 'antd';
import ImgCrop from 'antd-img-crop';
import { InboxOutlined } from '@ant-design/icons';
const { Option } = Select;
const { Dragger } = Upload;

export const getInitialValues = (formsObj) => {
    // const guardianForms = this.props.guardianForms;
    let initialValues = {}; // Each form has its own initial values and we'll map then using the form's id

    for (let formUID in formsObj){
        let formItems = formsObj[formUID];
        let initialForm = {};
        try{
            for (const [field, value] of Object.entries(formItems)) {
                let name = `${formUID}+${field}`;
                // initialForm[name] = value;
                initialForm[name] = value;
            }
            initialValues[formUID] = initialForm;
        }
        catch(error) {
            console.log("Error getting initial values: ", error);
        }
    }

    return initialValues;
}


/**
 * Check the validity of a single form field/form item
 * 
 * @param {any} value - current value of form field(?)
 * @param {Array} rules - validation rules for this item/field
 * @param {Boolean} touched - whether this field has previously been touched by user (currently unused)
 * @param {Object} kwargs - Keyword arguments as needed by certain fields
 */
export const checkValidityItem = (value, rules, touched=false, kwargs={'usernames': ["username"]}) => {
    let valid = true;
    let help_messages = [];

    /** @param {Object} rule - Each rule looks like { rule_name:[Boolean | String | Number], message: String  } */
    for(let rule of rules) {
        // Not sure why I'm slicing here (I think maybe Object.keys returns an iterable?
        // TODO: Figure out why slice
        let [rule_name_key, message_key] = Object.keys(rule).slice(0, 2);
        switch (rule_name_key) {
            case "required":
                // Added null check for images (don't think this is used for images rn) and false check for checkbox
                if (value === "" || value ===  null || value === false) {
                    valid = false;
                    help_messages.push(<div>{rule[message_key]}</div>);
                }
                break;
            case "unique":
                if (kwargs['usernames'].includes(value)) {
                    valid = false;
                    help_messages.push(<div>Some other nonsense</div>)
                }
                break;
            default:
                valid = valid && true;  // If encounter unexpected validation rule, leave validity unchanged
        }
    }

    // { validateStatus: "error", 
    // help: <div>Should be combination of numbers & alphabets<br/> Some other nonsense<br/></div>}
    let response = !valid ? { validateStatus: "error", help: help_messages } : null;
    return response;
}

export const checkValidityForm = (formValidObj) => {
    let valid = true;
    for (let element in formValidObj) {
        valid = valid && ( formValidObj[element] === null );
    }
    // 
    // try {
    //     valid = valid && this.props.guardianFormsValid[formUID][element];
    // }
    // catch(error) {
    //     valid = valid && true;  // If the form or element is undefined, we leave valid unchanged TODO: does this make sense?
    // }
    return valid;
}

export const checkValiditySection = (formValidObj) => {
    let valid = true;
    for (let formUID in formValidObj) {
        valid = valid && checkValidityForm(formValidObj[formUID]);
    }
    return valid;
}

// checkValiditySection = (formObj) => {
//     let valid = true;
//     for (let formUID in formObj) {
//         for (let element in formObj[formUID]) {
//             try {
//                 valid = valid && formObj[formUID][element];
//             }
//             catch (error) {
//                 valid = valid && true;
//             }
//         }
//     }
//     return valid;
// }

/* Making deep copies of form-related objects */

export const formCopy = (formObj) => {
    return {...formObj};
}

/**
 * Make a copy of a nested form object
 * 
 * TODO: Add summary
 * @param {Object} formsObj - nested forms object (depth of 2)
 */
export const formsCopy = (formsObj) => {
    let forms = {};
    for (let formUID in formsObj){
        forms[formUID] = {...formsObj[formUID]};
    }
    return forms;
}

export const formValidCopy = (formValidObj) => {
    let formValid = {};
    for (let field in formValidObj){
        formValid[field] = {...formValidObj[field]};
    }
    return formValid;
}