import React from 'react';
import axios from 'axios';

import { Card } from 'antd';
class SchoolDetail extends React.Component {

    state = {        
        school: {}
    }

    componentDidMount() {
        const schoolID = this.props.match.params.schoolID;
        axios.get(`http://127.0.0.1:8000/api/school_detail/${schoolID}`)
            .then(res => {
                this.setState({
                    school: res.data
                });
                console.log(res.data);
            })
    }

    render() {
        return (
            <Card title={this.state.school.official_name}>
                <br/>
                <p>Succint Name: {this.state.school.succint_name}</p>
                <br/>
                <p>Telephone: {this.state.school.phone_number}</p>
                <br/>
                <p>Logo: {this.state.school.logo}</p>
                <br/>
                <p>Location: {this.state.school.location}</p>
                <br/>
                <p>Motto: {this.state.school.motto}</p>
            </Card>
        )
    }
}

export default SchoolDetail;