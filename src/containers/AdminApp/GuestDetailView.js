import React from 'react';
import axios from 'axios';

import { Button, Card, Breadcrumb } from 'antd';
import { Link } from'react-router-dom';

import CustomForm from '../../components/Form';

class GuestDetail extends React.Component {

    state = {        
        guest: {},
        students: [],
        guardians: [],
        declaration: {}
    }

    componentDidMount() {
        const guestID = this.props.match.params.guestID;
        axios.get(`http://127.0.0.1:8000/api/guests/${guestID}`)
            .then(res => {
                this.setState({
                    guest: res.data
                });
                console.log(res.data);
            });
        axios.get(`http://127.0.0.1:8000/api/students/?guest_user=${guestID}`)
            .then(res => {
                // console.log("Students: ");
                // console.log(res.data.results);
                this.setState({
                    students: res.data['results']
                });
            });
        axios.get(`http://127.0.0.1:8000/api/guardians/?guest_user=${guestID}`)
            .then(res => {
                this.setState({
                    guardians: res.data['results']
                });
            });
        axios.get(`http://127.0.0.1:8000/api/declarations/?guest_user=${guestID}`)
            .then(res => {
                this.setState({
                    declaration: res.data['results'][0]
                });
                //  TODO: Is it a good idea to use res.data[0]? Obviously we expect only 1 
                //  declaration form but who know?
            });
    }

    handleDelete = event => {
        const guestID = this.props.match.params.guestID;
        axios.delete(`http://127.0.0.1:8000/api/guests/${guestID}`);
    }

    render() {
        return (
            <div>
                {/* <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><Link to='/guests'>Guest</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to='/guests'>Students</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to='/guests'>Guardians</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to='/guests'>Declaration</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb> */}
                <Card title={this.state.guest.full_name}>
                    <br />
                    <p>Username: {this.state.guest.username}</p>
                    <br />
                    <p>First Name: {this.state.guest.first_name}</p>
                    <br />
                    <p>Last Name: {this.state.guest.last_name}</p>
                    <br />
                    <p>Created On: {this.state.guest.created}</p>
                    <br />
                    <p>Avi: {this.state.guest.image_file}</p>
                </Card>
                <br />
                <h2>Modify this guest</h2>

                <CustomForm 
                requestType='PUT' 
                guestID={this.props.match.params.guestID} 
                btnText="Update" />

                <form onSubmit={this.handleDelete}>
                    <Button type="danger" htmlType="submit">Delete</Button>
                </form>
            </div>
        )
    }
}

export default GuestDetail;