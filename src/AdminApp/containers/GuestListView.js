import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Spin, Breadcrumb } from 'antd';
import { Link, withRouter } from'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

import Guest from '../components/Guest';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

class GuestList extends React.Component {

    componentDidMount() {
        axios.get('api/formsets/')
        .then(res => {
            //console.log(this.props);
            console.log("Formsets from API: ", res.data);
        })
        .catch(error => {
            console.log("Error getting formsets: ", error);
        })
    }

    render() {
        return (
            <div>
                {/* <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><Link to='/portal'>Portal</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>Admin</Breadcrumb.Item>
                            <Breadcrumb.Item>Login</Breadcrumb.Item>
                </Breadcrumb> */}
                {console.log(this.props.isAuthenticated)}
                {
                    // localStorage.getItem('isAuthenticated') ?
                    this.props.isAuthenticated ?
                    <div style={{boxSizing: 'border-box', }}>
                        <Guest data={this.props.guests} isAuthenticated={this.props.isAuthenticated} />
                        {/* <br />
                        <h2>Create new guest</h2>
                        <CustomForm
                            requestType='POST'
                            guestID={null}
                            btnText="Create" /> */}
                    </div>
                    :
                    (
                        this.props.loading
                            ?
                            <Spin indicator={antIcon} />
                            :
                            <div>
                                <Button type="primary" style={{ margin: 'auto' }}>
                                    <Link to="/portal/login">Login to view this page</Link>
                                </Button>
                            </div>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        loading: state.auth.loading,
        guests: state.auth.guests
    }
}

export default withRouter(connect(mapStateToProps, null)(GuestList));