import React from 'react';

import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer>
      <Container>
        <hr />
        <Row>
          <Col md={4} sm={12} className='text-center py-3'>
            Copyright &copy; Phuc Le Vinh
          </Col>

          <Col md={8} className='text-center py-3'>
            <Row>
              <Col sm={12}>THÔNG TIN LIÊN HỆ</Col>
              <Col sm={12}>
                <strong>Địa Chỉ</strong>: 544/5 Lý Thường Kiệt, phường 7, quận
                Tân Bình, Thành Phố Hồ Chí Minh
              </Col>
              <Col sm={12}>
                <strong>Di động</strong>: 0769 79 49 65(Mr. Sơn)
              </Col>
              <Col sm={12}>
                <strong>Email</strong>: nguyenhoangson0504@gmail.com
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
