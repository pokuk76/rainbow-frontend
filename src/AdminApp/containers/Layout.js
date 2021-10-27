import React from 'react';
import { connect } from 'react-redux'
import { Link, withRouter } from'react-router-dom';


import { Layout, Menu, Breadcrumb, Avatar } from 'antd';
import { UserOutlined, UnorderedListOutlined, LoginOutlined, LogoutOutlined, 
    PlusCircleOutlined, HomeOutlined } from '@ant-design/icons';

import AdminSearch from '../components/Search';
import * as actions from '../../store/actions/auth';

/*Needed a CSS file because the div with class 'site-layout-content' wasn't being styled correctly */
import './layout.css';
// TODO: Figure out why some styles aren't working
// e.g. .MenuItem class on Menu.Item component causes the icon to disapper (but the styles are still applied, not sure if I need to have styles in less?)
import classes from './styles/layout.module.scss';

const { Header, Sider, Content, Footer } = Layout;

let headerHeight = '64px';
let siderWidth = '80px';
let styles = {
    MenuItem: {
        display: "flex", flexFlow: "column", alignItems: 'center', 
        justifyContent: 'flex-start', height: 'auto', 
        padding: '0.5em', boxSizing: 'border-box',
        margin: 0,
    },
    icon: {
        margin: '0',
        fontSize: '1.5em',
        position: 'relative',
    },
    anchor: { fontSize: 12, margin: 0, }
};

class CustomLayout extends React.Component {

    componentDidMount() {
        this.props.authCheckState();
    }

    getBreadcrumbs() {
        let path = `${this.props.location.pathname}`;
        let locations = path.split('/');   // Leading forward-slash causes first location to be an empty string
        console.log(locations);
        let linkPath = '';
        return <Breadcrumb style={{ margin: '16px 0' }}>
            {locations.map( (loc, i) => {
                linkPath += `${loc}/`;
                let crumbText;
                if (isNaN(loc) === false) {
                    crumbText = 'Detail';
                    if (loc === '') {
                        crumbText = 'Portals';
                    }
                } else {
                    // Capitalize location
                    crumbText = loc.charAt(0).toLocaleUpperCase() + loc.slice(1);
                }
                return <Breadcrumb.Item key={i}><Link to={linkPath}>{crumbText}</Link></Breadcrumb.Item>;
            })}
        </Breadcrumb>
    }

    render() {
        // console.log(this.getBreadcrumbs());

        return (
            // min-height: 100vh; max-width: 100vw; box-sizing: border-box;
            <Layout 
                className="layout" 
                style={{minHeight:"100vh", maxWidth: '100vw', boxSizing: 'border-box'}}
            >
                
                <Sider 
                    width={siderWidth}
                    className={classes.Sider}
                    theme="dark"
                >
                    <div 
                        style={{ 
                            backgroundColor: 'transparent', height: headerHeight, width: siderWidth,
                            display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center', 
                        }}
                    >
                        <Avatar 
                            size="medium" 
                            icon={<UserOutlined />} 
                            style={{background: 'none', border: '1px solid grey', }} 
                        />
                        {/* <p style={{overflowX: 'ellipsis', backgroundColor: 'pink', marginBottom: 0, }}>
                        { localStorage.getItem('username') }
                        </p> */}
                    </div>
                {
                        localStorage.getItem('isAuthenticated') ?
                        <Menu 
                            theme="dark" mode="vertical" 
                            // defaultSelectedKeys={[3]} 
                            selectable={false}
                            style={{width: 80,}}>

                            <Menu.Item 
                                key="2" 
                                icon={<HomeOutlined style={styles.icon} />} 
                                style={{...styles.MenuItem}}
                            >
                                <a href="http://127.0.0.1:8000/home/" style={styles.anchor}> Home</a>

                                {/* <div style={{backgroundColor: 'blue', width: 100, textAlign: 'center'}}>
                                    
                                </div> */}
                            </Menu.Item>

                            <Menu.Item 
                                key="3" 
                                icon={<UnorderedListOutlined style={styles.icon} />}
                                style={styles.MenuItem}
                            >
                                <Link to="/admin" style={styles.anchor}> Guests</Link>
                            </Menu.Item>

                            <Menu.Item 
                                key="4" 
                                icon={<PlusCircleOutlined style={styles.icon} />}
                                style={styles.MenuItem}
                            >
                                <Link to="/registration" style={styles.anchor}> New Form</Link>
                            </Menu.Item>
                            
                            <Menu.Item 
                                key="5" 
                                onClick={this.props.logout} 
                                icon={<LogoutOutlined style={styles.icon} />}
                                style={styles.MenuItem}
                            >
                                <p style={{...styles.anchor, display: 'inline'}}>Logout</p>
                            </Menu.Item>

                        </Menu>
                        :
                        <Menu theme="dark" mode="vertical" defaultSelectedKeys={[]}>

                            <Menu.Item 
                                key="2" 
                                icon={<LoginOutlined style={styles.icon}/>}
                                style={styles.MenuItem}
                            >
                                <Link to="/login" style={styles.anchor}>Login</Link>
                            </Menu.Item>
                        </Menu>
                    }
                </Sider>

                <Layout style={{ marginLeft: 80 }}>
                    {
                        this.props.isAuthenticated ?
                        <Header
                            style={{
                                backgroundColor: 'rgba(0,21,41, 0.9)',
                                position: 'fixed', zIndex: 1, padding: 0, width: '100%',
                                borderBottom: '2px solid #fff',
                                boxSizing: 'content-box', // To account for the extra 2 pixels from the border (so total height becomes 66px)
                            }}
                        >
                            <AdminSearch className={classes.AdminSearch}></AdminSearch>
                        </Header>
                        : <></>
                    }

                    <Content style={{ padding: '0 50px', marginTop: headerHeight }}>

                            {/* Add something in the redux store that keeps track of the current page so we 
                            can have the Breadcrumb items render dynamically (see GuestDetailView) */}
                        {/* <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><Link to='/portal'>Portal</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>Admin</Breadcrumb.Item>
                            <Breadcrumb.Item>Login</Breadcrumb.Item>
                </Breadcrumb> */}
                        {this.getBreadcrumbs()}
                        <div className="site-layout-content">
                            {this.props.children}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Rainbow Edu ©2021 | By kbd</Footer>
                </Layout>
                
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