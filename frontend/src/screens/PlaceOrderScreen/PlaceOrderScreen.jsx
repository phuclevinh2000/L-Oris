import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
  ListGroupItem,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Message from '../../components/Message/Message';
import CheckoutStep from '../../components/CheckoutStep/CheckoutStep';
import { createOrder } from '../../redux/actions/orderAction';

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };
  // Cal prices
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Cal Total
  cart.totalPrice = addDecimals(Number(cart.itemsPrice));

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);
    }
    // eslint-disable-next-line
  }, [navigate, success]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
        paymentMethod: cart.paymentMethod,
      })
    );
  };

  return (
    <div>
      <CheckoutStep step1 step2 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroupItem>
              <h2>Giao Hàng</h2>
              <p>
                <strong>Địa Chỉ:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroupItem>

            <ListGroupItem>
              <h2>Giỏ Hàng</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Giỏ Hàng Trống</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
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
                          {item.qty} x {item.price}vnđ = {item.qty * item.price}{' '}
                          vnđ
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
                <h2>Tổng Kết</h2>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Tổng Cộng</Col>
                  <Col>{cart.totalPrice} vnđ</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroupItem>
              <ListGroupItem>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Xác Nhận Đặt Hàng
                </Button>
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
