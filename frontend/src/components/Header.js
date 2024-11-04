import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Row, Col, Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { logout } from '../redux/actions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 631);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  useEffect(() => {
    // Function to handle screen resizing
    const handleResize = () => {
      const isMobileScreen = window.innerWidth <= 630;
      setIsMobile(isMobileScreen);
      

      // Close drawer if switching to a larger screen
      if (!isMobileScreen && drawerVisible) {
        setDrawerVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawerVisible]);

  return (
    <AntHeader
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '0 20px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Row justify="space-between" align="middle" style={{ width: '100%' }}>
        {/* Logo Column */}
        <Col xs={18} sm={12} md={8} style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/content-listing">
            <img
              src="https://admongrel.com/img/logo-dark.png"
              alt="Logo"
              style={{
                height: 40,
                margin: 'auto',
                display: 'block',
              }}
            />
          </Link>
        </Col>

        {/* Mobile Menu Icon - Only on small screens */}
        {!isLoginPage && isMobile && (
          <Col xs={6} sm={0} style={{ textAlign: 'right' }}>
            <Button
              icon={<MenuOutlined />}
              onClick={showDrawer}
              style={{
                backgroundColor: 'white',
                border: 'none',
                boxShadow: 'none',
                color: 'black',
              }}
            />
          </Col>
        )}

        {/* Desktop Links Column - Only on medium and larger screens */}
        {!isLoginPage && !isMobile && (
          <Col xs={0} sm={12} md={9} style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
            <Button type="link" style={{ color: 'black' }}>
              <Link to="/content-listing">Home</Link>
            </Button>
            <Button type="link" style={{ color: 'black' }}>
              <Link to="/content/new">Create Content</Link>
            </Button>
            <Button onClick={handleLogout} type="link" style={{ color: 'black' }}>
              Logout
            </Button>
          </Col>
        )}
      </Row>

      {/* Drawer for Mobile Links */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        bodyStyle={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <Button type="link" onClick={closeDrawer} style={{ color: 'black' }}>
          <Link to="/content-listing">Home</Link>
        </Button>
        <Button type="link" onClick={closeDrawer} style={{ color: 'black' }}>
          <Link to="/content/new">Create Content</Link>
        </Button>
        <Button onClick={() => { handleLogout(); closeDrawer(); }} type="link" style={{ color: 'black' }}>
          Logout
        </Button>
      </Drawer>
    </AntHeader>
  );
}

export default Header;
