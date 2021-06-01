export const guardianFormElements = {
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

export const checkValidityElement = (value, rules, touched=false, data={}) => {
    let valid = true;
    for(let rule of rules) {
        switch (rule) {
            case "required":
                if (value === "") {
                    valid = false;
                }
                break;
            case "unique":
                break;
            default:
                /* If we somehow encounter a rule that we're not checking, we should probably just set valid to true right? */
                valid = true;
        }
    }
    
    return valid;
}