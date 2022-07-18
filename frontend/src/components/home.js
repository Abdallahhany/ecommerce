import React, {Fragment, useEffect, useState} from 'react';
import MetaData from "./layouts/meta_data";
import {useDispatch, useSelector} from "react-redux";
import {getProducts} from "../actions/product_action";
import Product from "./product/product";
import Loader from "./layouts/loader";
import {useAlert} from "react-alert";
import Pagination from "react-js-pagination";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const Home = ({match}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([1, 100000]);
    const [category, setCategory] = useState('');
    const [rating, setRating] = useState(0);

    const categories = [
        'Phones',
        'Cameras',
        'Laptops',
        'Accessories',
        'HeadPhones',
        'Foods',
        'Books',
        'Clothes/shoes',
        'Beauty/Health',
        'Sports',
        'OutDoor',
        'Home'
    ]

    const dispatch = useDispatch();
    const Alert = useAlert();
    const {
        loading,
        products,
        error,
        productsCount,
        resPerPage,
        filteredProductsCount
    } = useSelector(state => state.products)
    const keyword = match.params.keyword;

    useEffect(() => {
        if (error) {
            return Alert.error(error);
        }
        dispatch(getProducts(keyword, currentPage, price, category, rating));

    }, [dispatch, Alert, error, keyword, currentPage, price, category, rating]);

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)

    }

    let count = productsCount;
    if (keyword) {
        count = filteredProductsCount;
    }

    return (
        <Fragment>
            {loading ? <Loader/> : (
                <Fragment>
                    <MetaData title={'Buy Best Products Online'}/>
                    <h1 id="products_heading">Latest Products</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            {keyword ? (
                                <Fragment>
                                    <div className="col-6 col-md-3 mt-5 mb-5">
                                        <div className="px-5">
                                            <Range
                                                marks={{
                                                    1: `$1`,
                                                    100000: `$100000`
                                                }}
                                                min={1}
                                                max={100000}
                                                defaultValue={[1, 100000]}
                                                tipFormatter={value => `$${value}`}
                                                tipProps={{
                                                    placement: "top",
                                                    visible: true
                                                }}
                                                value={price}
                                                onChange={price => setPrice(price)}
                                            />
                                            <hr className="my-5"/>
                                            <div className="mt-5">
                                                <h4 className="mb-3">
                                                    Categories
                                                </h4>
                                                <ul className="pl-0">
                                                    {categories.map(category => (
                                                        <li style={{cursor: 'pointer', listStyleType: 'none',}}
                                                            key={category} onClick={() => setCategory(category)}>
                                                            {category}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <hr className="my-3"/>
                                            <div className="mt-5">
                                                <h4 className="mb-3">
                                                    Ratings
                                                </h4>
                                                <ul className="pl-0">
                                                    {[5, 4, 3, 2, 1].map(star => (
                                                        <li style={{cursor: 'pointer', listStyleType: 'none',}}
                                                            key={star} onClick={() => setRating(star)}>
                                                            <div className="rating-outer">
                                                                <div className="rating-inner"
                                                                     style={{
                                                                         width:`${star * 20}%`
                                                                     }}
                                                                >
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-6 col-md-9">
                                        <div className="row">
                                            {products && products.map(product => (
                                                <Product product={product} key={product._id} col={4}/>
                                            ))}
                                        </div>
                                    </div>

                                </Fragment>
                            ) : (
                                products && products.map(product => (
                                    <Product product={product} key={product._id} col={3}/>
                                ))
                            )}
                        </div>
                    </section>
                    {resPerPage <= count && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText={'Next'}
                                prevPageText={'Prev'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>
                    )}
                </Fragment>
            )}

        </Fragment>
    );
};

export default Home;
