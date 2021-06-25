import reducer from '../auth';
import { initialState } from '../auth';

import * as actionTypes from '../../actions/actionTypes';

describe('auth reducer', () => {
    it('should return the initial state on undefined behaviour', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should store token upon succesful login', () => {
        expect(reducer({ ...initialState }, {
            type: actionTypes.AUTH_SUCCESS, 
            token: 'some-token', 
            guests: [], 
        })).toEqual({
            token: 'some-token', 
            error: null,
            loading: false,
            guests: [] 
        });
    });
});