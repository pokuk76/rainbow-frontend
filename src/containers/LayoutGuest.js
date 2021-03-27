import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from'react-router-dom';

import { RainbowIcon } from '../components/Icons';

import { Flex } from 'antd-mobile';
// import { Drawer } from 'antd-mobile';

import { Layout, Menu, Breadcrumb, Form, Button, Collapse,Drawer } from 'antd';
import {
  HomeOutlined,
  ProfileOutlined,
  UserAddOutlined,
  TeamOutlined,
  WalletOutlined,
  FileAddOutlined,
  CloseOutlined,
  CloseSquareOutlined,
  MenuOutlined, 
} from '@ant-design/icons';

import './layout.css';  

import * as actions from '../store/actions/guest-registration';

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
    // this.myRef = React.createRef();

    this.state = {
      collapsed: false,
      leftMargin: 200,
      prevMenuItem: '',
      selectedMenuItem: 'guest-details',
      guardianForms: this.props.guardianForms,
      visible: false,
    };

    this.componentSwitch = this.componentSwitch.bind(this);
    this.onCollapse = this.onCollapse.bind(this);
  }

  componentDidMount() {
    console.log("Props after mount:", this.props);
  }

  componentDidUpdate(prevProps) {
    console.log("Props after update:", prevProps);
  }

  componentSwitch = (key) => {
    let forms = [];
    var i=0;

    switch (key) {
      case 'guest-details':
        const id = "GuestForm_0";
        return (
          <div>
            <Breadcrumb style={{ margin: '3.5em 0 2em 0' }}>
              <Breadcrumb.Item>Portals</Breadcrumb.Item>
              <Breadcrumb.Item>Registration</Breadcrumb.Item>
              <Breadcrumb.Item>Guest Details</Breadcrumb.Item>
            </Breadcrumb>
            <h1><ProfileOutlined /> Guest Account</h1>
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
          selectedMenuItem = { this.state.selectedMenuItem } 
          
          {...this.props} />);
      case 'guardians':
        return (<GuardianFormContainer
          key={"GuardianFormContainer"}
          selectedMenuItem={this.state.selectedMenuItem}

          {...this.props} />);
      case 'declaration':
        const declaration_id = "DeclarationForm_0";
        return (
          <div>
            <Breadcrumb style={{ margin: '3.5em 0 2em 0' }}>
              <Breadcrumb.Item>Portals</Breadcrumb.Item>
              <Breadcrumb.Item>Registration</Breadcrumb.Item>
              <Breadcrumb.Item>Declaration & Signature</Breadcrumb.Item>
            </Breadcrumb>
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

  showDrawer = () => {
    // let viewportmeta = document.querySelector('meta[name="viewport"]');
    // if (viewportmeta) {
    //   viewportmeta.setAttribute('content', 'width=device-width, maximum-scale=1.0, initial-scale=1.0');
    // }
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onOpenChange = () => {
    this.setState({
      visible: !this.state.visible,
    });
  }

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
    const drawerContents = <Menu 
    theme="dark" 
    style={{height: '100vh', marginTop:0 }}
    defaultSelectedKeys={["guest-details"]} 
    selectedKeys={this.state.selectedMenuItem} 
    onClick={(e) => this.setState({ prevMenuItem: this.state.selectedMenuItem, selectedMenuItem: e.key, visible: false })}
  >
    {/* <Menu.Item key="home" icon={<RainbowIcon />}>
      <a href="http://127.0.0.1:8000/home/"> Rainbow</a>
    </Menu.Item> */}

    <Menu.Divider />

    <Menu.Item
      key="guest-details"
      icon={<ProfileOutlined />}
      style={{ paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, }}
    >
      Guest Details
</Menu.Item>

    <Menu.Divider />

    <Menu.Item
      key="students"
      icon={<UserAddOutlined />}
      style={{ paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, }}
    >
      Students
</Menu.Item>

    <Menu.Divider />

    <Menu.Item
      key="guardians"
      icon={<TeamOutlined />}
      style={{ paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, }}
    >
      Guardians
</Menu.Item>

    <Menu.Divider />

    <Menu.Item
      key="declaration"
      icon={<WalletOutlined />}
      style={{ paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, }}
    >
      Declaration
</Menu.Item>

    <Menu.Divider />

  </Menu>
    
    return (
      <>
      <Layout 
        style={{ minHeight: '100vh', maxWidth: '100vw' }}
      >
        <Drawer
          title={
          <a href="http://127.0.0.1:8000/home/"><RainbowIcon /> Rainbow</a>}
          placement="left"
          closable={true}
          closeIcon={<CloseOutlined style={{fontSize: '1.5em',}} />}
          destroyOnClose={true}
          onClose={this.onClose}
          visible={this.state.visible}
          getContainer={false}
          // drawerStyle={{ height:'100%', }}
          // minHeight='100vh'
          // style={{ position: 'absolute'}} 
          bodyStyle={{padding:'0'}}
        >
          { drawerContents }
        </Drawer>

        <Layout key={"Layout" + this.state.selectedMenuItem} className="site-layout"
          // style={{ minHeight: '100vh', maxWidth: '100vw', margin: '0', padding:'1em' }}
          // style={{ paddingLeft: this.state.leftMargin }}
        >
          {/* <Header className="site-layout-background" style={{ padding: 0, height: '48px' }}> */}
          <Header style={{ position: 'fixed', zIndex: 1, width: '100vw' }}>
            <Button type="primary" onClick={this.showDrawer} icon={<MenuOutlined />}>
            </Button>
          </Header>
          
          <Content key={"Content" + this.state.selectedMenuItem} style={{ margin: '0 0', maxWidth: '100vw', }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: '100vh' }}>
              {/* <Form layout='vertical' initialValues={() => this.getInitialValues()}> */}
              {/* <Form key={this.state.selectedMenuItem} layout='vertical' >
              {this.componentSwitch(this.state.selectedMenuItem)}
            </Form> */}
              {this.componentSwitch(this.state.selectedMenuItem)}
            </div>

          </Content>
          <Footer style={{ textAlign: 'center' }}>Rainbow Edu ©2020 kbd</Footer>
        </Layout>

        
      </Layout>
      </>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GuestLayout));
