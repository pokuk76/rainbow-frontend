import React from 'react';

const validationMessage = (props) => {

    const errorsOutput = props.errors.map(error => {
        return(
            <div
                key={error.message}
                style={{
                    display: 'flex', 
                    flexFlow: 'row', 
                    margin: '0 8px',
                    border: '1px solid #ccc',
                    padding: '5px',
                }}
            >
                <div style={{ width: "1%", minHeight: "100%", backgroundColor: "rgba(255, 0, 0, 0.8)" }}></div>
                <div style={{ width: "auto", backgroundColor: "rgba(255, 0, 0, 0.5)", padding: '0 0.5em', }}>
                    {error.message}
                </div>
            </div>);
    });

    return (
        <div style={{ display:"flex", flexFlow:"column", justifyContent:"space-between" }}>
            {errorsOutput}
        </div>
    );
};

export default validationMessage;
