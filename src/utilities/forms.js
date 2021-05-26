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

    console.log("Initial values: ", initialValues);
    return initialValues;
    // this.setState({initialFormValues: initialValues});
}