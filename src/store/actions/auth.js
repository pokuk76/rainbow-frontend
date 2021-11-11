import axios from 'axios';
import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
}

export const authSuccess = (token, guests=null) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        // guests: guests
    };
}

/* Currently unused; Moved logic for retrieving users to Layout */
export const authPreSuccess = (token) => {
    return dispatch => {
        // axios.get('http://127.0.0.1:8000/api/guests/', {
        //     headers: {
        //       'Authorization': `Token ${token}`
        //     }
        // })
        axios.get('api/formsets/')
        .then(res => {
            //console.log(this.props);
            console.log("Formsets from API: ", res.data['formsets']);
            var guests = res.data['formsets'];
            dispatch(authSuccess(token, guests));
        })
        .catch(error => {
            console.log("Pre-success get request: ", error);
            dispatch(authFail(error));
        });
    };
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(authLogout());
        }, expirationTime*1000)
    }
}

export const authLogin = (username, password, callback) => {
    return dispatch => {
        dispatch(authStart());
        axios.post('rest-auth/login/', {
            username: username,
            password: password
        })
        .then(response => {
            const token = response.data.key;
            //const username = response.data.username;
            const expirationDate = new Date(new Date().getTime() + (3600*1000));
            localStorage.setItem('token', token);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('username', username);
            let isAuthenticated = true;
            localStorage.setItem('isAuthenticated', isAuthenticated);
            dispatch(authSuccess(token));
            callback();
            // TODO: Do I need to call the callback within a dispatch?
            dispatch(checkAuthTimeout(3600));
        })
        .catch(error => {
            dispatch(authFail(error));
            // TODO: Do I need to call the callback within a dispatch?
            callback();
        })
    };
}

export const authSignup = (username, email=null, password1, password2) => {
    return (dispatch => {
        dispatch(authStart());
        axios.post('rest-auth/registration/', {
            username: username,
            email: email,
            password1: password1,
            password2: password2
        })
        .then(response => {
            const token = response.data.key;
            const expirationDate = new Date(new Date().getTime() + (3600*1000));
            localStorage.setItem('token', token);
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(token));
            dispatch(checkAuthTimeout(3600));
        })
        .catch(error => {
            dispatch(authFail(error))
        })
    });
}

export const authLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('token');
    return {
        type: actionTypes.AUTH_LOGOUT, 
        loading: false, 
    };
}


export const authCheckState = () => {
    return (dispatch => {
        const token = localStorage.getItem('token');
        if (token === undefined) {
            dispatch(authLogout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(authLogout());
            } else {
                dispatch( authSuccess(token) );
                dispatch( checkAuthTimeout( (expirationDate.getTime() - new Date().getTime()) / 1000 ) )
            }
        }
    });
}
