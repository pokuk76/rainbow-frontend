import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import axios from 'axios';

const { Search } = Input;
const onSearch = value => console.log(value);

class AdminSearch extends React.Component {

    render() {
        return (
            <div className={this.props.className}>
                <Search 
                    placeholder="Search" allowClear onSearch={onSearch} 
                    // style={{borderRadius: 0, backgroundColor: 'maroon'}} 

                    enterButton={<div style={{}}>
                        <SearchOutlined />
                    </div>} 
                />
                {/* <Input placeholder="Search" allowClear bordered={false} />
                <div style={{backgroundColor: 'maroon', width: '100%'}}>
                        <SearchOutlined />
                    </div> */}
            </div>
        );
    }

};

export default AdminSearch;