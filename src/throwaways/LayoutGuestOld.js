import React from 'react';
import { connect } from 'react-redux';

import { Layout, Menu, Breadcrumb, Form, Button, Collapse } from 'antd';
import {
  HomeOutlined,
  ProfileOutlined,
  UserAddOutlined,
  TeamOutlined,
  WalletOutlined,
  FileAddOutlined,
  CloseOutlined,
  CloseSquareOutlined,
} from '@ant-design/icons';

import * as actions from '../store/actions/guest';

import GuestInfo from './guest-users/GuestForm';
import GuardianForm from '../throwaways/GuardianForm';
import StudentForm from '../throwaways/StudentForm';
import GuardianFormContainer from './guest-users/GuardianFormContainer';
import StudentFormContainer from './guest-users/StudentFormContainer';
import Declaration from './guest-users/Declaration';


const { Header, Content, Footer, Sider } = Layout;

 /* Collapse */
const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}

/*******/


const genExtra = () => (
  <CloseSquareOutlined
    onClick={event => {
      // If you don't want click extra trigger collapse, you can prevent this:
      event.stopPropagation();
    }} 
    style={{color: 'red', }} 
  />
);

class GuestLayout extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.state = {
      collapsed: false,
      leftMargin: 200,
      prevMenuItem: '',
      selectedMenuItem: 'guest-details',
      guardianForms: this.props.guardianForms,
    };

    this.componentSwitch = this.componentSwitch.bind(this);
    this.onCollapse = this.onCollapse.bind(this);
  }

  componentDidMount() {
    console.log("Props after mount:", this.props);
  }

  componentSwitch = (key) => {
    let forms = [];
    var i=0;

    switch (key) {
      case 'guest-details':
        const id = "GuestForm_0";
        return (
          <div>
            <h1>Guest Account</h1>
            <GuestInfo 
              id={id} 
              fileSelected={
                (this.props.images[id]) ? true : false
              } 
              />
          </div>
        );
      case 'students':
        return(<StudentFormContainer 
          key={"StudentFormContainer"} 
          // id={"GuardianForm_" + this.props.guardianUID} 
          // id={formUID} 
          // listIndex={i} 
          selectedMenuItem = { this.state.selectedMenuItem } 
          
          {...this.props} />);
      case 'guardians':
        return(<GuardianFormContainer 
                  key={"GuardianFormContainer"} 
                  // id={"GuardianForm_" + this.props.guardianUID} 
                  // id={formUID} 
                  // listIndex={i} 
                  selectedMenuItem = { this.state.selectedMenuItem } 
                  
                  {...this.props} />);
        // forms = [];
        // i = 0;
        // console.log("Guardian form: ", this.props.guardianForms);
        // for (var form of this.props.guardianForms){
        //   let formUID = Object.keys(form)[0];
        //   console.log("formUID: ", formUID);
        //   var key = "GuardianPanel" + i;
        //   forms.push(
        //     <Panel header={"Guardian " + (i+1)} key={key} extra={genExtra()}>
        //       <Form>
        //         <GuardianForm 
        //           key={"GuardianForm" + i} 
        //           // id={"GuardianForm_" + this.props.guardianUID} 
        //           id={formUID} 
        //           listIndex={i} 
        //           fileSelected={
        //             (this.props.images[formUID]) ? true : false
        //           } 
        //           fileList = {this.props.images[formUID]} 
        //           {...this.props} 
        //         />
        //       </Form>
        //     </Panel>
        //   );
        //   i++;
        // }

        // // const guardianForms = this.props.guardianForms;
        // return (
        //   <div>
        //     <h1>Guardians</h1>
        //     <br />
        //     <Collapse
        //       key='CollapseGuardians'
        //       defaultActiveKey={['GuardianPanel0']} 
        //       onChange={callback} 
        //       expandIconPosition='left' 
        //     >
        //       { forms }
        //     </Collapse>
        //     <br />
        //     { console.log(this.state.selectedMenuItem) }
        //     <Button key={this.state.selectedMenuItem} onClick={() => this.props.addForm(this.props.guardianForms, this.props.guardianUID, 'GuardianForm') }>
        //         <FileAddOutlined /> Add Parent or Guardian
        //     </Button>
        //   </div>
        // );
      case 'declaration':
        const declaration_id = "DeclarationForm_0";
        return (
          <div>
            <h1>Declaration</h1>
            <Declaration 
              id={declaration_id} 
              fileSelected={
                (this.props.images[declaration_id]) ? true : false
              } 
              />
          </div>
        );
      default:
        break;
    }
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    //let layout = document.querySelector('.site-layout');
    if (collapsed){
      this.setState({ collapsed: collapsed, leftMargin: 80});
    } else {
      
      this.setState({ collapsed: collapsed });
      setTimeout( () => this.setState({ leftMargin: 200 }) , 100);
    }
    // this.setState({ collapsed });
    
  };

  getInitialValues = () => {
    const guest = this.props.guestForm;
    const guardians = this.props.guardianForms;
    const students = this.props.studentForms;
    const declaration = this.props.declarationForm;

    return {
      // guestValue: (guest !== undefined) ? 
      // {
      //   'username': guest['username'], 
      //   'first_name': guest['first_name'], 
      //   'middle_name': guest['middle_name'], 
      //   'last_name': guest['last_name'], 
      // } : guest,
      // studentValues: (students.length > 0) ? this.handleForm(students, "STUDENT") : students,
      // guardianValues: (guardians.length > 0) ? this.handleForm(guardians, "GUARDIAN") : guardians,
      // declarationValue: (declaration !== undefined) ? 
      // {
      //   'username': declaration['username'], 
      //   'first_name': declaration['first_name'], 
      //   'middle_name': declaration['middle_name'], 
      //   'last_name': declaration['last_name'], 
      // } : declaration,
      guestValue: this.handleForm(guest),
      studentValues: (students.length > 0) ? this.handleForm(students) : students,
      guardianValues: (guardians.length > 0) ? this.handleForm(guardians) : guardians,
      declarationValue: this.handleForm(declaration),
    }
  }

  handleForm = (formArray) => {
    let initialValues = {}; // Each form has its own initial values and we'll map then using the form's id

    for (var form of formArray){
      let id = Object.keys(form)[0];
      let formItems = Object.values(form)[0];
      let initialForm = {};
      for (const [name, value] of Object.entries(formItems)) {
        console.log(`${name}: ${value}`);
        initialForm[name] = value;
      }
      initialValues[id] = initialForm;
    }

    return initialValues;
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          style={{
            // overflowY: 'auto',
            minHeight: '100vh',
            position: 'fixed',
            left: 0,
          }}
          collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={["guest-details"]} selectedKeys={this.state.selectedMenuItem} onClick={(e) => this.setState({ prevMenuItem: this.state.selectedMenuItem, selectedMenuItem: e.key })}>

            {/* <Header style={{ position: 'fixed', zIndex: 1, width: '100%'}}>
              <HomeOutlined />
              <span>Rainbow</span>
            </Header>
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <a href="http://127.0.0.1:8000/home/"> Rainbow</a>
            </Menu.Item> */}
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <a href="http://127.0.0.1:8000/home/"> Rainbow</a>
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item 
              key="guest-details" 
              icon={<ProfileOutlined />} 
              style={ {paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, } } 
            >
              Guest Details
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item 
              key="students" 
              icon={<UserAddOutlined />} 
              style={ {paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, } } 
            >
              Students
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item 
              key="guardians" 
              icon={<TeamOutlined />} 
              style={ {paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, } } 
            >
              Guardians
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item 
              key="declaration" 
              icon={<WalletOutlined />} 
              style={ {paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, } } 
            >
              Declaration
            </Menu.Item>

            <Menu.Divider />

          </Menu>
        </Sider>
        <Layout key={"Layout" + this.state.selectedMenuItem} className="site-layout" 
          style={{ paddingLeft: this.state.leftMargin }}
        >
          <Header className="site-layout-background" style={{ padding: 0, height:'48px' }} />
          <Content key={"Content" + this.state.selectedMenuItem} style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              {/* <Form layout='vertical' initialValues={() => this.getInitialValues()}> */}
              {/* <Form key={this.state.selectedMenuItem} layout='vertical' >
                {this.componentSwitch(this.state.selectedMenuItem)}
              </Form> */}
              {this.componentSwitch(this.state.selectedMenuItem)}
            </div>
            
          </Content>
          <Footer style={{ textAlign: 'center' }}>Rainbow Edu ©2020 kofi poku</Footer>
        </Layout>
      </Layout>
    );
  }
}


const mapStateToProps = state => {
  //console.log("Forms state-to-props: ", state);
  return {
    guestForm: state.guest.guestForm,
    studentForms: state.guest.studentForms,
    studentUID: state.guest.studentUID,
    guardianForms: state.guest.guardianForms,
    guardianUID: state.guest.guardianUID,
    declaration: state.guest.declarationForm,
    images: state.guest.images
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addForm: (forms, uid, currentForm) => dispatch(actions.addForm(forms, uid, currentForm)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GuestLayout);
