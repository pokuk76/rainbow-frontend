import React from 'react';
import { Layout, Menu, Breadcrumb, Avatar } from 'antd';
import { UserOutlined, UnorderedListOutlined, LoginOutlined, LogoutOutlined, 
    PlusCircleOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, withRouter } from'react-router-dom';
import './layout.css';  
/*Needed a CSS file because the div with class 'site-layout-content' wasn't being styled correctly */
import { connect } from 'react-redux'
import * as actions from '../../store/actions/auth';

const { Header, Content, Footer } = Layout;

class CustomLayout extends React.Component {

    componentDidMount() {
        this.props.authCheckState();
    }

    render() {
        return (
            <Layout className="layout" style={{minHeight:"100vh"}}>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%'}}>
                    <div className="logo"></div>
                    {
                        localStorage.getItem('isAuthenticated') ?
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[3]}>
                            <Menu.Item key="1" disabled>
                                <Avatar size="large" icon={<UserOutlined />} />
                                &nbsp;&nbsp;&nbsp;
                                {
                                    localStorage.getItem('username')
                                }  
                            </Menu.Item>

                            <Menu.Item key="2" icon={<HomeOutlined />}>
                                <a href="http://127.0.0.1:8000/home/"> Homepage</a>
                            </Menu.Item>

                            <Menu.Item key="3" icon={<UnorderedListOutlined />}>
                                <Link to="/portal/admin"> Guests</Link>
                            </Menu.Item>

                            <Menu.Item key="4" icon={<PlusCircleOutlined />}>
                                <Link to="/portal/admin"> New Application</Link>
                            </Menu.Item>
                            
                            <Menu.Item key="5" onClick={this.props.logout} icon={<LogoutOutlined />}>
                                &nbsp;Logout
                            </Menu.Item>

                        </Menu>
                        :
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[]}>
                            <Menu.Item key="1" disabled>
                                <Avatar size="large" icon={<UserOutlined />} />
                                &nbsp;&nbsp;&nbsp;
                            </Menu.Item>

                            <Menu.Item key="2" icon={<LoginOutlined />}>
                                <Link to="/portal/login"> Login</Link>
                            </Menu.Item>
                        </Menu>
                    }
                    
                </Header>
                <Content style={{ padding: '0 50px', marginTop: 64 }}>

                        {/* Add something in the redux store that keeps track of the current page so we 
                           can have the Breadcrumb items render dynamically (see GuestDetailView) */}
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Portal</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to='/portal/admin'>Admin</Link></Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-content">
                        {this.props.children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Rainbow Edu ©2021 | By kbd</Footer>
            </Layout>
        );
    }
    
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null, 
        loading: state.auth.loading,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.authLogout()), 
        authCheckState: () => dispatch(actions.authCheckState()), 
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomLayout));