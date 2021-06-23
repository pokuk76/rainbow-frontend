/* Mocking the props from the Redux Store */
export const guestMockStateToProps = {
    guestForm: {},
    guestFormValid: {}, 
    studentForms: {}, 
    studentFormsValid: {}, 
    studentUID: {}, 
    guardianForms: {}, 
    guardianFormsValid: {}, 
    guardianUID: {}, 
    declaration: {}, 
    declarationFormValid: {}, 
    images: {}, 
}

export const guestMockDispatchToProps = {
    updateGuestInfo: () => {}, 
    updateDeclaration: () => {},
    addImage: () => {},
    removeImage: () => {}, 
}

export const formMockStateToProps = {
    submitStatus: null, 
}

export const formMockDispatchToProps = {
    handleSubmit: () => {}, 
}

export const authMockStateToProps = {}

export const authMockDispatchToProps = {}
