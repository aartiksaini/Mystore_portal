import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/body.css';
import ProductCard from './ProductCard';





function Item({cat}){
        const [data, setData] = useState(null);
        const navigate = useNavigate();
    
        const fetchData = async () => {
            const pro = await fetch('https://dummyjson.com/products');
            const json = await pro.json();
            setData(json.products);
        }
    
        useEffect(() => {
            fetchData();
        }, [])
    
        const handleProductClick = (item) => {
            navigate('/productPage', { state: { product: item } });
        };
         {/* <div className='content-video-1'> */}
         <img src="https://cdn.pixabay.com/photo/2017/03/13/17/26/ecommerce-2140603_640.jpg">
         </img>
   
    return <div className='products-container'>
    {data ? (
        data.map((item) => (
            item.category==cat &&(<div key={item.id} className='product-item' onClick={() => handleProductClick(item)}>
                <ProductCard product={item} />
            </div>)
        ))
    ) : (
        <p>Loading...</p> // Fallback UI
    )}
</div> 
}

export default Item;