import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { UnconnectedGuardianForm } from '../GuardianForm';
import { Form } from 'antd';

import { guestMockStateToProps, guestMockDispatchToProps } from '../../../utility/testUtility'

configure({ adapter: new Adapter() });

describe('<GuardianForm />', () => {

    let wrapper;
    let props = {
        showModal: () => {}, 
        formUID: "GuardianForm_0", 
        initialValues: {}, 
        // Redux Store props
        ...guestMockStateToProps, 
        ...guestMockDispatchToProps,
    };

    beforeEach(() => {
        wrapper = shallow(<UnconnectedGuardianForm {...props} />);
    });

    it('should render <Form />', () => {
        expect(wrapper.find(Form)).toHaveLength(1);
    });

    // it('should have 1 <Input /> element', () => {
    //     expect(wrapper.find(Input)).toHaveLength(1);
    // });

    // it('should have 1 antd <Checkbox /> element', () => {
    //     expect(wrapper.find(Checkbox)).toHaveLength(1);
    // });

})