import {createStore, combineReducers, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";
import {
    productDetailsReducers,
    newReviewReducer,
    productsReducer,
    newProductReducer,
    productReducer, productReviewsReducer, deleteReviewReducer
} from "./reducers/product_reducer";
import {
    authReducer,
    userReducer,
    forgotPasswordReducer,
    allUsersReducer,
    userDetailsReducer
} from "./reducers/user_reducer";
import {cartReducer} from "./reducers/cart_reducer";
import {
    allOrdersReducer,
    myOrdersReducer,
    newOrderReducer,
    orderDetailsReducer,
    orderReducer
} from "./reducers/order_reducer";


const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducers,
    auth: authReducer,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    newProduct: newProductReducer,
    product: productReducer,
    allOrders: allOrdersReducer,
    order: orderReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    productReviews: productReviewsReducer,
    deleteReview: deleteReviewReducer,
});

let initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingInfo: localStorage.getItem('shippingInfo')
            ? JSON.parse(localStorage.getItem('shippingInfo'))
            : {}
    }
};

const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store;