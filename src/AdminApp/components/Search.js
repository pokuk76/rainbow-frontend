import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import axios from 'axios';

import classes from './styles/Search.module.scss';

const { Search } = Input;
const onSearch = value => console.log(value);

class AdminSearch extends React.Component {

    getPlaceholder() {
        let p = "Search by ";
        let searchBy = this.props.searchBy.split('_').join(' ');
        p += searchBy;
        console.log('placeholder', p);
        return p;
    }

    render() {
        return (
            <div className={this.props.className}>
                <Search 
                    placeholder={ this.props.placeholder || "Search..."} 
                    addonBefore={this.props.addonBefore}
                    allowClear 
                    onSearch={(value) => this.props.onSearch(value)} 
                    name={'Search'}
                    className={classes.AdminSearch}
                    enterButton={
                        <div style={{}}>
                            <SearchOutlined />
                        </div>
                    }
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