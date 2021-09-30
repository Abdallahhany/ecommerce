import {BrowserRouter as Router, Route} from "react-router-dom";
import './App.css';
import store from "./store";
import axios from "axios";
import {useEffect, useState} from "react";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import {useSelector} from "react-redux";
import Header from "./components/layouts/header";
import Footer from "./components/layouts/footer";
import Home from "./components/home";
import ProductDetails from "./components/product/product_details";
import Login from "./components/user/login";
import Register from "./components/user/register";
import {loadUser} from "./actions/user_action";
import Profile from "./components/user/profile";
import ProtectedRoute from "./components/routes/protected_routes";
import UpdateProfile from "./components/user/update_profile";
import UpdatePassword from "./components/user/update_password";
import ForgotPassword from "./components/user/forgot_password";
import ResetPassword from "./components/user/reset_password";
import Cart from "./components/cart/cart";
import Shipping from "./components/cart/shipping";
import ListOrders from "./components/order/list_orders";
import Payment from "./components/cart/payment";
import ConfirmOrder from "./components/cart/confirm_order";
import OrderSuccess from "./components/cart/order_success";
import OrderDetails from "./components/order/order_details";
import Dashboard from "./components/admin/dashboard";
import AdminProducts from "./components/admin/peoducts_list";
import NewProduct from "./components/admin/new_product";
import UpdateProduct from "./components/admin/update_product";
import OrdersList from "./components/admin/orders_list";
import ProcessOrder from "./components/admin/process_order";
import UsersList from "./components/admin/users_list";
import UpdateUser from "./components/admin/update_user";
import ProductReviews from "./components/admin/product_reviews";

function App() {

    const [stripeApiKey, setStripeApiKey] = useState('')

    useEffect(() => {
        store.dispatch(loadUser());

        async function getStripeApiKey() {
            const uri = 'api/v1/stripe/api';
            const {data} = await axios.get(uri)
            setStripeApiKey(data.stripeApiKey);
        }

        getStripeApiKey();
    }, [])
    const {user, isAuth, loading} = useSelector(state => state.auth)
    return (
        <Router>
            <div className="App">
                <Header/>
                <div className="container container-fluid">
                    <Route path="/" component={Home} exact/>
                    <Route path="/search/:keyword" component={Home}/>
                    <Route path="/product/:id" component={ProductDetails} exact/>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                    <ProtectedRoute path="/me" component={Profile} exact/>
                    <ProtectedRoute path="/me/update" component={UpdateProfile} exact/>
                    <ProtectedRoute path="/password/update" component={UpdatePassword} exact/>
                    <Route path="/password/forget" component={ForgotPassword} exact/>
                    <Route path="/password/reset/:token" component={ResetPassword} exact/>
                    <ProtectedRoute path="/cart" component={Cart} exact/>
                    <ProtectedRoute path="/shipping" component={Shipping} exact/>
                    <ProtectedRoute path="/confirm" component={ConfirmOrder} exact/>
                    <ProtectedRoute path="/success" component={OrderSuccess} exact/>
                    <ProtectedRoute path="/orders/me" component={ListOrders} exact/>
                    <ProtectedRoute path="/order/:id" component={OrderDetails} exact/>
                    {stripeApiKey &&
                    <Elements stripe={loadStripe(stripeApiKey)}>
                        <ProtectedRoute path="/payment" component={Payment} exact/>
                    </Elements>
                    }
                </div>
                <ProtectedRoute path="/dashboard" isAdmin={true} component={Dashboard} exact/>
                <ProtectedRoute path="/admin/products" isAdmin={true} component={AdminProducts} exact/>
                <ProtectedRoute path="/admin/product" isAdmin={true} component={NewProduct} exact/>
                <ProtectedRoute path="/admin/product/:id" isAdmin={true} component={UpdateProduct} exact/>
                <ProtectedRoute path="/admin/orders" isAdmin={true} component={OrdersList} exact/>
                <ProtectedRoute path="/admin/order/:id" isAdmin={true} component={ProcessOrder} exact/>
                <ProtectedRoute path="/admin/users" isAdmin={true} component={UsersList} exact/>
                <ProtectedRoute path="/admin/user/:id" isAdmin={true} component={UpdateUser} exact/>
                <ProtectedRoute path="/admin/reviews" isAdmin={true} component={ProductReviews} exact/>

                {!loading && (!isAuth || user.role !== 'admin') && (
                    <Footer/>
                )}
            </div>
        </Router>
    );
}

export default App;
