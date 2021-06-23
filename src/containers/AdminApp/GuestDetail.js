import React from 'react';
import axios from 'axios';

import { Button, Card, Collapse } from 'antd';
import {RightOutlined} from '@ant-design/icons'
import { Link, Redirect } from'react-router-dom';

import CustomForm from '../../components/Form';

/* Collapse */
const { Panel } = Collapse;

class GuestDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            guest: {},
            students: [],
            guardians: [],
            declaration: {}
        };
    }

    componentDidMount() {
        console.log("Props: ", this.props);
        const guestID = this.props.match.params.guestID;
        // axios.get(`http://127.0.0.1:8000/api/guests/${guestID}`)
        //     .then(res => {
        //         this.setState({
        //             guest: res.data
        //         });
        //         console.log(res.data);
        //     });
        // axios.get(`http://127.0.0.1:8000/api/students/?guest_user=${guestID}`)
        //     .then(res => {
        //         // console.log("Students: ");
        //         // console.log(res.data.results);
        //         this.setState({
        //             students: res.data['results']
        //         });
        //     });
        // axios.get(`http://127.0.0.1:8000/api/guardians/?guest_user=${guestID}`)
        //     .then(res => {
        //         this.setState({
        //             guardians: res.data['results']
        //         });
        //     });
        // axios.get(`http://127.0.0.1:8000/api/declarations/?guest_user=${guestID}`)
        //     .then(res => {
        //         this.setState({
        //             declaration: res.data['results'][0]
        //         });
        //         //  TODO: Is it a good idea to use res.data[0]? Obviously we expect only 1 
        //         //  declaration form but who know?
        //     });
        axios.get(`api/formsets/${guestID}/`)
            .then(res => {
                console.log("Formset retrieve: ", res.data);
                this.setState({
                    guest: res.data['guest'], 
                    students: res.data['students'], 
                    guardians: res.data['guardians'], 
                    declaration: res.data['declaration']
                });
            });
    }

    handleDelete = event => {
        const guestID = this.props.match.params.guestID;
        axios.delete(`api/guests/${guestID}`);
    }

    renderStudents = (students) => {
        console.log(students);
        let studentsOutput = students.map(s => {
            console.log(s);
            return (
                <Card key={s.first_name} title={s.first_name}>
                    <br />
                    <p>First Name: {s.first_name}</p>
                    <br />
                    <p>Last Name: {s.last_name}</p>
                    <br />
                    <p>Image: {s.image_file}</p>
                </Card>
            );
        });
        return studentsOutput;
    }

    render() {
        return (
                <div>
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

                    <Collapse
                        key='CollapsableStudentForms'
                        expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 90 : 0} style={{ fontSize: '2em', }} />}
                        expandIconPosition='left'
                    >
                        <Panel header={<h1> Students</h1>} >
                            {this.renderStudents(this.state.students)}
                        </Panel>
                    </Collapse>
                    <br />

                    <Collapse
                        key='CollapsableGuardianForms'
                        expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 90 : 0} style={{ fontSize: '2em', }} />}
                        expandIconPosition='left'
                    >
                        <Panel header={<h1> Guardians</h1>} >
                            {this.renderStudents(this.state.students)}
                        </Panel>
                    </Collapse>

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