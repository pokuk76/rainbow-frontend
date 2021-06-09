import React from 'react';

export const guestFormItems = {
    username: {
        validation_rules: [ 
            { required: true, message: "Username Required" }, 
            { unique: true, message: "Username already exists"}, 
            { type: "username", message: "Username can only contain alphanumeric characters, punctuation, and special characters" }, 
            { max: 128, message: "First name must have fewer than 128 characters" }, 
        ], 
    }, 
    first_name: {
        validation_rules: [ 
            { required: true, message: "First Name Required" }, 
            { max: 128, message: "First name must have fewer than 128 characters" }, 
        ], 
    }, 
    middle_name: {
        validation_rules: [ 
            { max: 128, message: "Middle name must have fewer than 128 characters" }, 
        ], 
    }, 
    last_name: {
        validation_rules: [ 
            { required: true, message: "Last Name Required" }, 
            { max: 128, message: "Last name must have fewer than 128 characters" }, 
        ], 
    }, 
}
export const studentFormItems = {
    first_name: {
        validation_rules: [ 
            { required: true, message: "First Name Required" }, 
            { max: 128, message: "First name must have fewer than 128 characters" }, 
        ], 
    }, 
    middle_name: {
        validation_rules: [ 
            { max: 128, message: "Middle name must have fewer than 128 characters" }, 
        ], 
    }, 
    last_name: {
        validation_rules: [ 
            { required: true, message: "Last Name Required" }, 
            { max: 128, message: "Last name must have fewer than 128 characters" }, 
        ], 
    }, 
    sex: {
        validation_rules: [ 
            { required: true, message: "Please specify" }, 
        ], 
    }, 
    date_of_birth: {
        validation_rules: [ 
            { required: true, message: "Please specify a date of birth" }, 
        ], 
    }, 
    image_file: {
        validation_rules: [ 
            { required: true, message: "Please provide a passport-style photo" }, 
        ], 
    }, 
    nationality: {
        validation_rules: [ 
            { required: true, message: "Please enter the nationality" }, 
            { max: 128, message: "Nationality must be less than 128 characters" }, 
        ], 
    }, 
    religion: {
        validation_rules: [ 
            { max: 128, message: "Religion must have fewer than 128 characters" }, 
        ], 
    }, 
    has_ailments: {
        validation_rules: [ ], 
    }, 
    former_school: {
        validation_rules: [ ], 
    }, 
    former_school_address: {
        validation_rules: [ ], 
    }, 
    class_reached: {
        validation_rules: [ ], 
    }, 
    reason_for_leaving: {}, 
}

export const guardianFormItems = {
    first_name: {
        validation_rules: [ 
            { required: true, message: "First Name Required" }, 
            { max: 128, message: "First name must have fewer than 128 characters" }, 
        ], 
    }, 
    middle_name: {
        validation_rules: [ 
            { max: 128, message: "Middle name must have fewer than 128 characters" }, 
        ], 
    }, 
    last_name: {
        validation_rules: [ 
            { required: true, message: "Last Name Required" }, 
            { max: 128, message: "Last name must have fewer than 128 characters" }, 
        ], 
    }, 
    phone_number: {
        validation_rules: [ 
            { required: true, message: "Please enter a phone number" }, 
            { max: 13, message: "Phone number must have fewer than 13 characters" } 
        ], 
    }, 
    email_address: {
        validation_rules: [ 
            { type: "email", message: "Please enter a valid a E-mail address" }, 
            { max: 128, message: "E-mail must have fewer than 128 characters" }, 
        ], 
    }, 
    image_file: {
        validation_rules: [ ], 
    }, 
    nationality: {
        validation_rules: [ 
            { required: true, message: "Please enter the nationality" }, 
            { max: 128, message: "Nationality must be less than 128 characters" }, 
        ], 
    }, 
    religion: {
        validation_rules: [ 
            { max: 128, message: "Religion must have fewer than 128 characters" }, 
        ], 
    }, 
    guardian_type: {
        validation_rules: [ 
            { required: true, message: "Please indicate the type of guardian" }, 
        ], 
    }, 
    lives_with_guardian: {
        validation_rules: [ 
            { required: true, message: "Please indicate whether students live with this guardian" }, 
        ], 
    }, 
    occupation: {
        validation_rules: [ 
            { required: true, message: "Please enter an occupation" }, 
            { max: 256, message: "Occupation must have fewer than 256 characters" }, 
        ], 
    }, 
    place_of_work: {
        validation_rules: [ 
            { required: true, message: "Please enter a place of work" }, 
            { max: 256, message: "Place of work must have fewer than 256 characters" }, 
        ], 
    }, 
    home_address: {}, 
    postal_address: {}, 
}

export const getInitialValues = (formsObj) => {
    // const guardianForms = this.props.guardianForms;
    let initialValues = {}; // Each form has its own initial values and we'll map then using the form's id

    for (let formUID in formsObj){
        let formItems = formsObj[formUID];
        let initialForm = {};
        try{
            for (const [name, value] of Object.entries(formItems)) {
                let key = formUID + "+" + name;
                // initialForm[name] = value;
                initialForm[key] = value;
            }
            initialValues[formUID] = initialForm;
        }
        catch(error) {
            //initialValues[formUID] = initialForm;
            console.log("Error getting initial values: ", error);
        }
    }

    // console.log("Initial values: ", initialValues);
    return initialValues;
    // this.setState({initialFormValues: initialValues});
}

// { validateStatus: "error", 
// help: <div>Should be combination of numbers & alphabets<br/> Some other nonsense<br/></div>}
export const checkValidityItem = (value, rules, touched=false, data={'username': ["username"]}) => {
    let valid = true;
    let help_messages = [];
    for(let rule of rules) {
        // Each rule is an object of the form { rule_name:[Boolean | data], message: String  }
        let [rule_name_key, message_key] = Object.keys(rule).slice(0, 2);  // Slice up to index 2 (3rd element) non-inclusive
        // console.log("Message key: ", message_key);
        switch (rule_name_key) {
            case "required":
                if (value === "") {
                    valid = false;
                    help_messages.push(<div>{rule[message_key]}</div>);
                }
                break;
            case "unique":
                if (data['username'].includes(value)) {
                    valid = false;
                    help_messages.push(<div>Some other nonsense</div>)
                }
                break;
            default:
                /* If we somehow encounter a rule that we're not checking, we should just set valid to true right?
                    Ok decided that seemed like a bad idea so lets leave it unchanged?
                */
                valid = valid;
        }
    }
    let response = !valid ? { validateStatus: "error", help: help_messages } : null;
    return response;
}

export const checkValidityForm = () => {

}