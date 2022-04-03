import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
import { Link, withRouter } from'react-router-dom';


import { Layout, Menu, Breadcrumb, Select, Spin } from 'antd';
import { UnorderedListOutlined, LogoutOutlined, 
    PlusCircleOutlined, HomeOutlined, LoadingOutlined } from '@ant-design/icons';

import Search from '../components/Search';
import Sider from '../components/Sider';

import * as actions from '../../store/actions/auth';

/*Needed a CSS file because the div with class 'site-layout-content' wasn't being styled correctly */
import './layout.css';
// TODO: Figure out why some styles aren't working
// e.g. .MenuItem class on Menu.Item component causes the icon to disapper (but the styles are still applied, not sure if I need to have styles in less?)
import classes from './styles/layout.module.scss';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

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

const LoadingIcon = <LoadingOutlined style={{ fontSize: '6em' }} spin />;

class CustomLayout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchByValue: "username",
            searchResults: null,
            formsets: [],
            loading: false
        };
    }

    

    componentDidMount() {
        // Being called in the top-level App component; don't think it's required again
        // this.props.authCheckState();

        // let config = {
        //     method: 'get',
        //     url: `api/formsets/`,
        //     headers: {
        //         'Authorization': `Token ${localStorage.getItem('token')}`
        //     },
        // };

        // axios(config)
        // .then(res => {
        //     this.setState({loading: false, formsets: res.data['formsets']});
        // })
        // .catch(error => {
        //     console.log("Error", error);
        //     this.setState({loading: false});

        // })
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

    handleSearchBySelect = (value) => {
        console.log("Search by ", value);
        this.setState({searchByValue: value});
    }

    getSearchPlaceholder() {
        let p = "Search by ";
        let searchBy = this.state.searchByValue.split('_').join(' ');
        p += searchBy;
        // console.log('placeholder', p);
        return p;
    }

    onSearch = (value, endpoint='guests') => {
        let config = {
            method: 'get',
            url: `api/${endpoint}?${this.state.searchByValue}=${value}`,
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
        };

        axios(config)
        .then(res => {
            console.log("Search results: ", res.data);
            // this.setState({loading: false, formsets: res.data['formsets']});
        })
        .catch(error => {
            console.log("Error", error);
            // this.setState({loading: false});
        })
    }

    render() {
        // console.log(this.getBreadcrumbs());

        let searchBy = (
            <Select
                onSelect={value => this.handleSearchBySelect(value)}
                defaultValue={"username"}
            >
                <Option value="username">Username</Option>
                <Option value="first_name">First Name</Option>
                <Option value="last_name">Last Name</Option>
            </Select>
        );

        return (
            <Layout 
                className="layout" 
                style={{minHeight:"100vh", maxWidth: '100vw', boxSizing: 'border-box'}}
            >
                <Sider width={siderWidth}>
                    <Menu
                        theme="dark" mode="vertical"
                        // defaultSelectedKeys={[3]} 
                        selectable={false}
                        style={{ width: 80, }}>

                        <Menu.Item
                            key="2"
                            icon={<HomeOutlined style={styles.icon} />}
                            style={{ ...styles.MenuItem }}
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
                            <p style={{ ...styles.anchor, display: 'inline' }}>Logout</p>
                        </Menu.Item>

                    </Menu>
                </Sider>

                <Layout style={{marginLeft: siderWidth}}>
                    <Header
                        style={{
                            backgroundColor: 'rgba(0,21,41, 0.9)',
                            position: 'fixed', zIndex: 1, padding: 0, width: '100%',
                            borderBottom: '2px solid #fff',
                            boxSizing: 'content-box', // To account for the extra 2 pixels from the border (so total height becomes 66px)
                        }}
                    >
                        <Search 
                            className={classes.Search} 
                            addonBefore={searchBy} 
                            // searchBy={this.state.searchByValue} 
                            placeholder={this.getSearchPlaceholder()}
                            onSearch={this.onSearch}
                        />
                    </Header>

                    <Content style={{ padding: '0 50px', marginTop: headerHeight }}>
                        {this.getBreadcrumbs()}
                        <div className="site-layout-content">
                            {/* {this.props.children} */}
                            {this.state.loading
                                ? <Spin indicator={LoadingIcon} />
                                : <>
                                    {this.props.renderComponent({ loading: this.state.loading, guests: this.state.searchResults })}
                                    {this.props.children}
                                </>
                            }
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