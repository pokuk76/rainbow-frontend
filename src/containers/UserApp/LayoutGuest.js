import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from'react-router-dom';

import { RainbowIcon } from '../../components/Icons';

// import { Flex } from 'antd-mobile';
// import { Drawer } from 'antd-mobile';
import { Layout, Menu, Breadcrumb, Form, Button, Drawer, Badge } from 'antd';
import { ProfileOutlined, UserAddOutlined, TeamOutlined, WalletOutlined,
  CloseOutlined, CloseSquareOutlined, MenuOutlined, ExclamationCircleOutlined, 
} from '@ant-design/icons';

import './layout.css';  

import * as guestActions from '../../store/actions/guest';
import * as formActions from '../../store/actions/form';

import GuestInfo from './GuestForm';
import GuardianFormContainer from './GuardianFormContainer';
import StudentFormContainer from './StudentFormContainer';
import Declaration from './Declaration';

const { Header, Content, Footer, Sider } = Layout;

const menuItemStyle = { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, height: "10%", fontSize:"1.2em", display: "flex", alignItems:"center", paddingLeft:"3em" }

function callback(key) {
  console.log(key);
}

/*******/


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
      valid: {
        'guest-details': true,
        'students': true, 
        'guardians': true, 
        'declaration': true, 
      }
    };

    this.componentSwitch = this.componentSwitch.bind(this);
  }

  componentDidMount() {
    // console.log("Props after mount:", this.props);
  }

  componentDidUpdate(prevProps) {
    // console.log("Props after update:", prevProps);
  }

  checkValiditySection = (formObj) => {
    let valid = true;
    for (let formUID in formObj){
      for (let element in formObj[formUID]) {
        try {
          valid = valid && formObj[formUID][element];
        }
        catch (error) {
          valid = valid && true;
        }
      }
    }
    return valid;
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
          // componentSwitch={this.componentSwitch}

          {...this.props} />);
      case 'declaration':
        const declaration_id = "DeclarationForm_0";
        return (
          <div>
            <Declaration 
              id={declaration_id} 
            />
          </div>
        );
      default:
        break;
    }
  };

  controlSwitch = (key) => {
    switch (key) {
      case 'guest-details':
        return (
          <div style={{ margin: "auto", width: "80%" }}>
            <br />
            <Button type="danger" htmlType="button" onClick={(e) => this.setState({ prevMenuItem: this.state.selectedMenuItem, selectedMenuItem: 'students', visible: false })} style={{ float: "right" }}>Next</Button>
          </div>
        );
      case 'students':
        return (
          <div style={{ margin: "auto", width: "80%" }}>
            <br />
            <Button type="danger" htmlType="button" onClick={(e) => this.setState({ prevMenuItem: this.state.selectedMenuItem, selectedMenuItem: 'guest-details', visible: false })} style={{ float: "left" }}>Previous</Button>
            <Button type="danger" htmlType="button" onClick={(e) => this.setState({ prevMenuItem: this.state.selectedMenuItem, selectedMenuItem: 'guardians', visible: false })} style={{ float: "right" }}>Next</Button>
          </div>
        );
      case 'guardians':
        return (
          <div style={{ margin: "auto", width: "80%" }}>
            <br />
            <Button type="danger" htmlType="button" onClick={(e) => this.setState({ prevMenuItem: this.state.selectedMenuItem, selectedMenuItem: 'students', visible: false })} style={{ float: "left" }}>Previous</Button>
            <Button type="danger" htmlType="button" onClick={(e) => this.setState({ prevMenuItem: this.state.selectedMenuItem, selectedMenuItem: 'declaration', visible: false })} style={{ float: "right" }}>Next </Button>
          </div>
        );
      case 'declaration':
        return (
          <div style={{ margin: "auto", width: "80%" }}>
            <br />
            <Button type="danger" htmlType="button" onClick={(e) => this.setState({ prevMenuItem: this.state.selectedMenuItem, selectedMenuItem: 'guardians', visible: false })} style={{ float: "left" }}>Previous</Button>
            <Form.Item style={{ float: "right" }}>
              <Button type="primary" htmlType="submit" onClick={this.handleFormSubmit}>Finish</Button>
            </Form.Item>
          </div>
        );
    }
  }

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

  /* Currently Unused */
  onOpenChange = () => {
    this.setState({
      visible: !this.state.visible,
    });
  }


/* Currently unused */
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

/* Currently unused (called in func above) */
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

  handleFormSubmit = () => {
    console.log("Form Submit to be handled...");
    this.props.handleSubmit(this.props.guestForm, 
                            this.props.studentForms, 
                            this.props.guardianForms, 
                            this.props.declarationForm, this.props.images);
    
  }

  render() {
    const drawerContents = (
      <Menu
        theme="dark"
        // style={{ height: '100vh', marginTop: 0 }}
        style={{ height: '100%', marginTop: 0 }}
        defaultSelectedKeys={["guest-details"]}
        selectedKeys={this.state.selectedMenuItem}
        onClick={(e) => this.setState({ prevMenuItem: this.state.selectedMenuItem, selectedMenuItem: e.key, visible: false })}
      >
        {/* <Menu.Item key="home" icon={<RainbowIcon />}>
      <a href="http://127.0.0.1:8000/home/"> Rainbow</a>
    </Menu.Item> */}

        {/* <Menu.Divider /> */}

        <Menu.Item
          key="guest-details"
          icon={<ProfileOutlined />}
          style={menuItemStyle}
        >
          Guest Account
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          key="students"
          icon={<UserAddOutlined />}
          style={menuItemStyle} 
        >
          <span>Students</span>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          key="guardians"
          icon={<TeamOutlined />}
          style={menuItemStyle}
        >
          Guardians {this.checkValiditySection(this.props.guardianForms) ? " Valid" : " Not Valid"}
          { !this.checkValiditySection(this.props.guardianForms) ?
          <ExclamationCircleOutlined style={{ color: '#f5222d', fontSize: '1.5em' }} /> : null }
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          key="declaration"
          icon={<WalletOutlined />}
          style={menuItemStyle}
        >
          Declaration
        </Menu.Item>

        <Menu.Divider />

      </Menu>)
    
    return (
      <>
      <Layout 
        style={{ minHeight: '100vh', maxWidth: '100vw' }}
      >
        <Drawer
          title={
            <a href="http://127.0.0.1:8000/home/" 
              style={{ display: "flex", flexFlow: "column", justifyContent:"center", alignItems: "center", }}
            ><RainbowIcon style={{ backgroundColor:"inherit", fontSize:"inherit"}} /> Rainbow School</a>
          }
          placement="left" 
          closable={true} 
          closeIcon={<CloseOutlined style={{fontSize: '1.2em', color: 'white'}} />} 
          destroyOnClose={true} 
          onClose={this.onClose} 
          visible={this.state.visible} 
          getContainer={false} 
          // drawerStyle={{ height:'100%', }}
          headerStyle={{backgroundColor: '#111d2c', }} 
          bodyStyle={{padding: '0'}}
          drawerStyle={{border: '2px solid white'}} 
        >
          { drawerContents }
        </Drawer>

        <Layout key={"Layout" + this.state.selectedMenuItem} className="site-layout">
          <Header style={{ position: 'fixed', zIndex: 1, width: '100vw', paddingLeft: "3em" }}>
            <Button type="primary" onClick={this.showDrawer} icon={<MenuOutlined style={{fontSize: "1.5em"}} />} style={{backgroundColor: 'inherit', borderColor: "white"}}>
            </Button>
            {/* <MenuOutlined onClick={this.showDrawer} /> */}
          </Header>
          
          <Content key={"Content" + this.state.selectedMenuItem} style={{ margin: '0 0', maxWidth: '100vw', }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: '100vh' }}>
              {/* <Form layout='vertical' initialValues={() => this.getInitialValues()}> */}
              {/* <Form key={this.state.selectedMenuItem} layout='vertical' >
              {this.componentSwitch(this.state.selectedMenuItem)}
            </Form> */}

              <Form.Provider>
                {this.componentSwitch(this.state.selectedMenuItem)}
              </Form.Provider>
            </div>

            { this.controlSwitch(this.state.selectedMenuItem) }

          </Content>

          <Footer style={{ textAlign: 'center' }}>Rainbow Edu ©2020 kbd</Footer>
        </Layout>

        
      </Layout>
      </>
    );
  }
}


const mapStateToProps = state => {
  return {
    guestForm: state.guest.guestForm,
    studentForms: state.guest.studentForms,
    studentUID: state.guest.studentUID,
    guardianForms: state.guest.guardianForms,
    guardianUID: state.guest.guardianUID,
    declaration: state.guest.declarationForm,
    images: state.guest.images, 

    /* Form Submission Props */
    submitStatus: state.form.submitStatus, 
    loading: state.form.loading, 
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addForm: (forms, uid, currentForm) => dispatch(guestActions.addForm(forms, uid, currentForm)), 
    handleSubmit: (guestForm, studentForms, guardianForms, declarationForm, images) => dispatch(formActions.handleSubmit(guestForm, studentForms, guardianForms, declarationForm, images)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GuestLayout));
