/* Making deep copies of objects */

export const guestFormCopy = (guestFormObj) => {
    return {...guestFormObj};
}

export const formsCopy = (formsObj) => {
    let forms = {};
    for (let formUID in formsObj){
        forms[formUID] = {...formsObj[formUID]};
    }
    return forms;
}