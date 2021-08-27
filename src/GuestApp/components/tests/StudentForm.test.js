import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { UnconnectedStudentForm } from '../StudentForm';
import { Form } from 'antd';

import { guestMockStateToProps, guestMockDispatchToProps } from '../../containers/tests/testUtility'

configure({ adapter: new Adapter() });

describe('<StudentForm />', () => {

    let wrapper;
    let props = {
        showModal: () => {}, 
        formUID: "StudentForm_0", 
        initialValues: {}, 
        // Redux Store props
        ...guestMockStateToProps, 
        ...guestMockDispatchToProps, 
    };

    beforeEach(() => {
        wrapper = shallow(<UnconnectedStudentForm {...props} />);
    });

    it('should render <Form />', () => {
        expect(wrapper.find(Form)).toHaveLength(1);
    });

})