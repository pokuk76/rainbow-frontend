import React from 'react';
import axios from 'axios';

import School from '../../components/School';
import CustomForm from '../../components/Form';

const listData = [];
for (let i = 0; i < 23; i++) {
    listData.push({
        href: 'https://ant.design',
        official_name: `ant design part ${i}`,
        logo: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        location:
            'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    });
}

class SchoolList extends React.Component {

    state = {        
        schools: []
    }

    

    componentDidMount() {
        axios.get('http://127.0.0.1:8000/api/school_list/')
            .then(res => {
                this.setState({
                    schools: res.data['results']
                });
                console.log(res.data['results']);
            })
    }

    render() {
        return (
            <div>
                <School data={this.state.schools} />
                <br />
                <h2>Add a new school</h2>
                <CustomForm />
            </div>

        )
    }
}

export default SchoolList;