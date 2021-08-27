import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { GuestForm } from '../GuestForm';
import { Form, Input } from 'antd';

import { guestMockStateToProps, guestMockDispatchToProps, formMockStateToProps } from '../../../utility/testUtility';


window.scroll = jest.fn();

configure({ adapter: new Adapter() });

describe('<GuestInfo />', () => {

    let wrapper;
    const store = {auth: {}, form: {}, guest: {}};
    let props = {
        id: "GuestForm_0", 
        fileSelected: false,
        // Store props
        ...guestMockStateToProps, 
        ...guestMockDispatchToProps, 
        ...formMockStateToProps
    };

    beforeEach(() => {
        // wrapper = shallow(
        //     <Provider store={store}>
        //         <GuestInfo />
        //     </Provider>
        // );
        wrapper = shallow(<GuestForm {...props} />);
    });

    afterAll(() => {
        window.scroll.mockClear();
    });

    // it('should exist/be imported correctly', function () {
    //     expect(GuestForm);
    // });

    it('should render 1 antd <Form />', () => {
        expect(wrapper.find(Form)).toHaveLength(1);
    });

    it('should have 4 antd <Input /> elements', () => {
        expect(wrapper.find(Input)).toHaveLength(4);
    });

});

