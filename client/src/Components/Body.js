import React, { useEffect, useState } from 'react';

import '../Style/body.css';

import { Link } from 'react-router-dom';
import Category from './Category.js';

const Body = () => {


    return (
        <div className='body'>
           <div 
  className="content-video relative flex items-center justify-center h-[500px] text-center text-white"
  style={{
    backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  {/* Overlay for better text visibility */}
  <div className="absolute inset-0 bg-black opacity-50"></div>

  {/* Welcome Text */}
  <Link to='/login'
  style={{
    color: 'white',
    backgroundColor: 'blue',
    padding: '15px 30px',
    fontSize: '20px',
    fontWeight: 'bold',
    borderRadius: '8px',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'background 0.3s ease-in-out',
    marginRight:'670px',
    marginTop:'350px'
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = 'darkblue'}
  onMouseLeave={(e) => e.target.style.backgroundColor = 'blue'}
>
  Shop Now
</Link>
</div>

            <div className='products'>
                <h1>Categories</h1>
                <div>
                    <Category title="fashion" ></Category>
                   
                </div>
                
            </div>
        </div>
    )
}

export default Body;



 