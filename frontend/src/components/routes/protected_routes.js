import React, {Fragment} from 'react';
import {useSelector} from "react-redux";
import {Redirect, Route} from "react-router-dom";

const ProtectedRoute = ({isAdmin, component: Component, ...rest}) => {
    const {isAuth, loading, user} = useSelector(state => state.auth)
    return (
        <Fragment>
            {loading === false && (
                <Route
                    {...rest}
                    render={props => {
                        if (isAuth === false)
                            return <Redirect to='/login'/>
                        if (isAdmin === true && user.role !== 'admin')
                            return <Redirect to='/'/>
                        return <Component {...props} />
                    }}
                />
            )}
        </Fragment>
    );
};

export default ProtectedRoute;
