import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useAlert} from "react-alert";
import MetaData from "../layouts/meta_data";
import {updatePassword, clearErrors} from "../../actions/user_action";
import {UPDATE_PASSWORD_RESET} from "../../consts/user_consts";

const UpdatePassword = ({history}) => {
    const dispatch = useDispatch();
    const Alert = useAlert();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const {error, isUpdated, loading} = useSelector(state => state.user);
    useEffect(() => {
        if (error) {
            Alert.error(error);
            dispatch(clearErrors)
        }
        if (isUpdated) {
            Alert.success('Password Updated Successfully');
            history.push('/me');
            dispatch({
                type: UPDATE_PASSWORD_RESET,
            })
        }
    }, [dispatch, Alert, error, history, isUpdated]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('oldPassword', oldPassword);
        formData.set('newPassword', newPassword);

        dispatch(updatePassword(formData));
    }
    return (
        <Fragment>
            <MetaData title={'Update Password'}/>
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mt-2 mb-5">Update Password</h1>
                        <div className="form-group">
                            <label htmlFor="old_password_field">Old Password</label>
                            <input
                                type="password"
                                id="old_password_field"
                                className="form-control"
                                value={oldPassword}
                                onChange={e => setOldPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new_password_field">New Password</label>
                            <input
                                type="password"
                                id="new_password_field"
                                className="form-control"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3"
                                disabled={loading ? true : false}>Update Password
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default UpdatePassword;
