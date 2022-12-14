import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  ListGroupItem,
  Button,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Message from '../../components/Message/Message';
import Loader from '../../components/Loader/Loader';
import {
  deliverOrder,
  getOrderDetails,
  payOrder,
} from '../../redux/actions/orderAction';
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../../constants/orderConstants';

const OrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  if (!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
    // Cal prices
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  useEffect(() => {
    // If not login yet
    if (!userInfo) {
      navigate('/login');
    }
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    // Check the condition for reset the screen
    if (successPay || !order || order._id !== id || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(id));
    } else if (!order.isPaid) {
      // If order isnt paid then add the paypal script
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [id, dispatch, order, successPay, successDeliver, userInfo, navigate]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(id, paymentResult));
  };

  const deliverHandler = () => {
    console.log(order);
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>????n H??ng {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroupItem>
              <h2>Giao H??ng</h2>
              <p>
                <strong>T??n ng?????i nh???n: </strong> {order.user.name}
              </p>
              <p>
                <strong>?????a ch??? email: </strong>
                <a href={`maito:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>?????a Ch???:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  ???? Giao H??ng L??c {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Ch??a Giao H??ng</Message>
              )}
            </ListGroupItem>

            <ListGroupItem>
              <h2>Gi??? H??ng</h2>
              {order.orderItems.length === 0 ? (
                <Message>Gi??? H??ng Tr???ng</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroupItem key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {item.price}vn?? = {item.qty * item.price}{' '}
                          vn??
                        </Col>
                      </Row>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </ListGroupItem>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroupItem>
                <h2>T???ng K???t</h2>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>T???ng C???ng</Col>
                  <Col>{order.totalPrice} vn??</Col>
                </Row>
              </ListGroupItem>
              {loadingDeliver && <Loader />}
              {userInfo && userInfo.isAdmin && !order.isDelivered && (
                <ListGroupItem>
                  <Button
                    type='button'
                    className='btn btn-block'
                    onClick={deliverHandler}
                  >
                    ????nh D???u ???? Giao H??ng
                  </Button>
                </ListGroupItem>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
