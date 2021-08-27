import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { UnconnectedDeclaration } from '../Declaration';
import { Form, Input, Checkbox } from 'antd';

import { guestMockStateToProps, guestMockDispatchToProps, formMockStateToProps } from './testUtility';

configure({ adapter: new Adapter() });

window.scroll = jest.fn();

describe('<Declaration />', () => {

    let wrapper;
    let props = {
        id: "DeclarationForm_0", 
        // Redux Store props
        ...guestMockStateToProps, 
        ...guestMockDispatchToProps, 
        ...formMockStateToProps
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