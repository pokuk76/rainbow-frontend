import React from 'react';
import { configure, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Provider from 'react-redux';

import { UnconnectedDeclaration } from '../../containers/UserApp/Declaration';
import { Form, Input, Checkbox } from 'antd';

configure({ adapter: new Adapter() });

window.scroll = jest.fn();

describe('<Declaration />', () => {

    let wrapper;
    let props = {
        showModal: () => {}, 
        formUID: "StudentForm_0", 
        initialValues: {}
        // Redux Store props
    };

    beforeEach(() => {
        wrapper = shallow(<UnconnectedDeclaration {...props} />);
    });

    afterAll(() => {
        window.scroll.mockClear();
    });

    it('should render <Form />', () => {
        expect(wrapper.find(Form)).toHaveLength(1);
    });

    it('should have 1 <Input /> element', () => {
        expect(wrapper.find(Input)).toHaveLength(1);
    });

    it('should have 1 antd <Checkbox /> element', () => {
        expect(wrapper.find(Checkbox)).toHaveLength(1);
    });

})