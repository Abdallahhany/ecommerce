import React from 'react';
import {Helmet} from "react-helmet";

const MetaData = ({title}) => {
    return (
        <Helmet>
            <title>{`${title} - E-commerce`}</title>
        </Helmet>
    );
};

export default MetaData;
