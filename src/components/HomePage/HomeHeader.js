import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const MENU = [['Home', '/'], ['About', '/about'], ['Our Therapists', '/therapists'], ['Find a Therapist', '/find-a-therapist'], ['Blog', '/blog'], ['Services', '/services'], ['Contact Us', '/contact'], ['Request A Session', '/book']]

export default function HomeHeader() 
{
    // eslint-disable-next-line
    const [width, setWidth] = useState(window.innerWidth <= 900)
    const [state, setState] = React.useState({left: false});

    const toggleDrawer = (anchor, open) => (event) => {
        if (
          event &&
          event.type === 'keydown' &&
          (event.key === 'Tab' || event.key === 'Shift')
        ) {
          return;
        }
    
        setState({...state, [anchor]: open});
      };

      const list = (anchor) => (
        <>
        <Box
          sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
          className='TESTT'
        >
          <List>
            {MENU.map(([text, path]) => (
              <Link key={text} to={path}>
                <ListItem style={{ textDecoration: 'none' }} disablePadding>
                  <ListItemButton>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider />
        </Box>
        <svg style={{ alignSelf: 'flex-start', marginLeft: '2vw', marginTop: '5%', height: '15vh', width: '15vh' }} xmlns="http://www.w3.org/2000/svg" width="52" height="76" viewBox="0 0 52 76" fill="none">
                <path d="M22.7101 28.0581V27.8081H22.4601H20.917H20.667V28.0581V74.7204V74.9704H20.917H22.4601H22.7101V74.7204V28.0581Z" fill="#F9F3D0" stroke="#F9F3D0"strokeWidth="0.5"/>
                <path d="M50.478 27.2783V27.0283H50.228H1.0625H0.8125V27.2783V28.8375V29.0875H1.0625H50.228H50.478V28.8375V27.2783Z" fill="#F9F3D0" stroke="#F9F3D0"strokeWidth="0.5"/>
                <path d="M11.4142 28.0581V27.8081H11.1642H9.62109H9.37109V28.0581V74.7204V74.9704H9.62109H11.1642H11.4142V74.7204V28.0581Z" fill="#F9F3D0" stroke="#F9F3D0"strokeWidth="0.5"/>
                <path d="M33.3323 27.3315L33.2436 27.0977L33.0105 27.188L31.5685 27.7467L31.3354 27.8371L31.4241 28.0708L49.2706 75.0949L49.3593 75.3286L49.5924 75.2383L51.0344 74.6796L51.2675 74.5893L51.1788 74.3556L33.3323 27.3315Z" fill="#F9F3D0" stroke="#F9F3D0"strokeWidth="0.5"/>
                <path d="M0.75 75.5V75.75H1H50.7494H50.9994H51V75.5H51.2494V25.7597C51.2494 11.6959 39.9244 0.25 25.9997 0.25C12.075 0.25 0.75 11.6959 0.75 25.7597V75.5ZM49.2069 25.7597V73.6908H2.79313V25.7597C2.79313 12.8274 13.2062 2.30918 26.0003 2.30918C38.7944 2.30918 49.2069 12.8268 49.2069 25.7597Z" fill="#F9F3D0" stroke="#F9F3D0"strokeWidth="0.5"/>
                <path d="M16.3506 14.9016C16.3506 20.2738 20.6759 24.6484 25.9997 24.6484C31.3228 24.6484 35.6487 20.2738 35.6487 14.9016C35.6487 9.5294 31.3228 5.15479 25.9997 5.15479C20.6765 5.15479 16.3506 9.5294 16.3506 14.9016ZM18.3937 14.9016C18.3937 10.6603 21.8089 7.21396 25.9997 7.21396C30.1911 7.21396 33.6056 10.6603 33.6056 14.9016C33.6056 19.1429 30.1911 22.5892 25.9997 22.5892C21.8083 22.5892 18.3937 19.1429 18.3937 14.9016Z" fill="#F9F3D0" stroke="#F9F3D0"strokeWidth="0.5"/>
        </svg>
        </>
      );

    let content = ["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button aria-label='Open menu' style={{ alignSelf: 'flex-start', margin: '5%', fontSize: '6.5vw', fontWeight: '600', color: 'var(--Sonder-olive)' }} onClick={toggleDrawer(anchor, true)}><FontAwesomeIcon style={{ marginLeft: '5%', width: '5vh', height: '5vh' }} icon={faBars} /></Button>
          <SwipeableDrawer
            //@ts-ignore
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))


    return (
        <>{width ? content : <div className='HomeHeaderContainer'>
            <div className='HomeHeaderContent'>
                <div className='HomeHeaderAnchor'><Link to='/'>HOME</Link></div>
                <div className='HomeHeaderAnchor'><Link to='/about'>ABOUT</Link></div>
                <div className='HomeHeaderAnchor'><Link to='/blog'>BLOG</Link></div>
                <div className='HomeHeaderAnchor'><Link to='/services'>OUR SERVICES</Link></div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="52" height="76" viewBox="0 0 52 76" fill="none">
                <path d="M22.7106 28.0581V27.8081H22.4606H20.9175H20.6675V28.0581V74.7204V74.9704H20.9175H22.4606H22.7106V74.7204V28.0581Z" fill="#464834" stroke="#464834" strokeWidth="0.5"/>
                <path d="M50.4778 27.2783V27.0283H50.2278H1.06226H0.812256V27.2783V28.8375V29.0875H1.06226H50.2278H50.4778V28.8375V27.2783Z" fill="#464834" stroke="#464834" strokeWidth="0.5"/>
                <path d="M11.414 28.0581V27.8081H11.164H9.62085H9.37085V28.0581V74.7204V74.9704H9.62085H11.164H11.414V74.7204V28.0581Z" fill="#464834" stroke="#464834" strokeWidth="0.5"/>
                <path d="M33.3318 27.3315L33.2431 27.0977L33.01 27.188L31.568 27.7467L31.3349 27.8371L31.4236 28.0708L49.2701 75.0949L49.3588 75.3286L49.5919 75.2383L51.0339 74.6796L51.267 74.5893L51.1783 74.3556L33.3318 27.3315Z" fill="#464834" stroke="#464834" strokeWidth="0.5"/>
                <path d="M0.75 75.5V75.75H1H50.7494H50.9994H51V75.5H51.2494V25.7597C51.2494 11.6959 39.9244 0.25 25.9997 0.25C12.075 0.25 0.75 11.6959 0.75 25.7597V75.5ZM49.2069 25.7597V73.6908H2.79313V25.7597C2.79313 12.8274 13.2062 2.30918 26.0003 2.30918C38.7944 2.30918 49.2069 12.8268 49.2069 25.7597Z" fill="#464834" stroke="#464834" strokeWidth="0.5"/>
                <path d="M16.3506 14.9016C16.3506 20.2738 20.6759 24.6484 25.9997 24.6484C31.3228 24.6484 35.6487 20.2738 35.6487 14.9016C35.6487 9.5294 31.3228 5.15479 25.9997 5.15479C20.6765 5.15479 16.3506 9.5294 16.3506 14.9016ZM18.3937 14.9016C18.3937 10.6603 21.8089 7.21396 25.9997 7.21396C30.1911 7.21396 33.6056 10.6603 33.6056 14.9016C33.6056 19.1429 30.1911 22.5892 25.9997 22.5892C21.8083 22.5892 18.3937 19.1429 18.3937 14.9016Z" fill="#464834" stroke="#464834" strokeWidth="0.5"/>
            </svg>
            <div className='HomeHeaderContent'>
                <div className='HomeHeaderAnchor'><Link to='/contact'>CONTACT US</Link></div>
                {/* <div className='HomeHeaderAnchor'><Link to='/BookASession'>BOOK A SESSION</Link></div> */}
                <div className='HomeHeaderAnchor'><Link to='/book'>REQUEST A BOOKING</Link></div>
            </div>
        </div>}
        </>
    )
}
