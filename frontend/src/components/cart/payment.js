import React, {Fragment, useEffect} from 'react';

import MetaData from '../layouts/meta_data';
import CheckoutSteps from "./checkout_steps";

import {useDispatch, useSelector} from 'react-redux';
import {useAlert} from "react-alert";

import {createOrder, clearErrors} from "../../actions/order_actions";

import {useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement} from "@stripe/react-stripe-js";
import axios from "axios";

const options = {
    style: {
        base: {
            fontSize: '16px'
        },
        invalid: {
            color: '#9e2146'
        }
    }
}

const Payment = ({history}) => {
    const Alert = useAlert();
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();

    const {user} = useSelector(state => state.auth);
    const {cartItems, shippingInfo} = useSelector(state => state.cart);
    const {error} = useSelector(state => state.newOrder)

    useEffect(() => {
        if (error) {
            Alert.error(error)
            dispatch(clearErrors)
        }

    }, [dispatch, Alert, error]);
    const order = {
        orderItems: cartItems,
        shippingInfo
    }
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice;
        order.shippingPrice = orderInfo.shippingPrice;
        order.taxPrice = orderInfo.taxPrice;
        order.totalPrice = orderInfo.totalPrice;
    }
    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100)
    }
    const submitHandler = async (e) => {
        const uri = '/api/v1/payment/process';
        e.preventDefault();

        document.querySelector('#pay_btn').disabled = true;
        let res;
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            res = await axios.post(uri, paymentData, config)

            const clientSecret = res.data.client_secret;
            if (!stripe || !elements) {
                return;
            }

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email
                    }
                },
            });
            if (result.error) {
                Alert.error(result.error.message);
                document.querySelector('#pay_btn').disabled = false;
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status
                    }
                    dispatch(createOrder(order));
                    history.push('/success')
                } else {
                    Alert.error('There is Some Issues With Payment Please Try Again')
                }
            }

        } catch (e) {
            document.querySelector('#pay_btn').disabled = false;
            Alert.error(e.response.data.message)
            console.log(e.response.data)
        }
    }

    return (
        <Fragment>
            <MetaData title={'Payment'}/>
            <CheckoutSteps shipping confirmOrder payment/>
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-4">Card Info</h1>
                        <div className="form-group">
                            <label htmlFor="card_num_field">Card Number</label>
                            <CardNumberElement
                                type="text"
                                id="card_num_field"
                                className="form-control"
                                options={options}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="card_exp_field">Card Expiry</label>
                            <CardExpiryElement
                                type="text"
                                id="card_exp_field"
                                className="form-control"
                                options={options}

                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="card_cvc_field">Card CVC</label>
                            <CardCvcElement
                                type="text"
                                id="card_cvc_field"
                                className="form-control"
                                options={options}

                            />
                        </div>


                        <button
                            id="pay_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            Pay - {orderInfo && orderInfo.totalPrice}
                        </button>

                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default Payment;
