import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useAlert} from "react-alert";
import Loader from "../layouts/loader";
import MetaData from "../layouts/meta_data";
import {login, clearErrors} from "../../actions/user_action";
import {Link} from "react-router-dom";

const Login = ({history, location}) => {
    const dispatch = useDispatch();
    const Alert = useAlert();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {isAuth, error, loading} = useSelector(state => state.auth);
    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (isAuth) {
            history.push(redirect)
        }

        if (error) {
            Alert.error(error);
            dispatch(clearErrors)
        }
    }, [dispatch, error, isAuth, history]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    }


    return (
        <Fragment>
            {loading ? <Loader/> : (
                <Fragment>
                    <MetaData title={'Login'}/>
                    <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={submitHandler}>
                                <h1 className="mb-3">Login</h1>
                                <div className="form-group">
                                    <label htmlFor="email_field">Email</label>
                                    <input
                                        type="email"
                                        id="email_field"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}

                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password_field">Password</label>
                                    <input
                                        type="password"
                                        id="password_field"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <Link to="/password/forget" className="float-right mb-4">Forgot Password?</Link>

                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                >
                                    LOGIN
                                </button>

                                <Link to="/register" className="float-right mt-2">New User?</Link>
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Login;
