import React, {Fragment, useEffect} from 'react'
import {Link} from 'react-router-dom';
import {MDBDataTable} from "mdbreact";
import MetaData from '../layouts/meta_data'
import Loader from "../layouts/loader";
import {useAlert} from 'react-alert';
import {useDispatch, useSelector} from 'react-redux';
import {getAdminProducts, clearErrors, deleteProduct} from "../../actions/product_action";
import Sidebar from "./sidebar";
import {DELETE_PRODUCT_RESET} from "../../consts/product_consts";

const AdminProducts = ({history}) => {
    const Alert = useAlert();
    const dispatch = useDispatch();
    const {loading, error, products} = useSelector(state => state.products);
    const {error: deleteError, isDeleted} = useSelector(state => state.product);

    useEffect(() => {
        dispatch(getAdminProducts());
        if (error) {
            Alert.error(error);
            dispatch(clearErrors)
        }
        if (deleteError) {
            Alert.error(deleteError);
            dispatch(clearErrors)
        }
        if (isDeleted) {
            Alert.success('Product Deleted Successfully')
            history.push('/admin/products');
            dispatch({
                type: DELETE_PRODUCT_RESET
            })
        }
    }, [dispatch, Alert, error, deleteError, isDeleted, history]);

    const deleteHandler = (id) => {
        dispatch(deleteProduct(id));
    }
    const setProducts = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort: 'asc'
                },
                {
                    label: 'Stock',
                    field: 'stock',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions'
                },
            ],
            rows: [],
        }
        products.forEach(product => {
            data.rows.push({
                id: product._id,
                name: product.name,
                price: `$${product.price}`,
                stock: product.stock,
                actions:
                    <Fragment>
                        <Link to={`/admin/product/${product._id}`} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteHandler(product._id)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </Fragment>

            })
        })
        return data;
    }
    return (
        <Fragment>
            <MetaData title={'All Products'}/>
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar/>
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Products</h1>

                        {loading ? <Loader/> : (
                            <MDBDataTable
                                data={setProducts()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        )}

                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
};

export default AdminProducts;
