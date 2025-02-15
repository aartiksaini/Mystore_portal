import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Style/productPage.css';

const ProductPage = () => {
    
    const navigate = useNavigate();
    const location = useLocation();
    const { product } = location.state || {};

    console.log("pro -> ", product);

    const [quantity, setQuantity] = useState(1);

    if (!product) {
        return <p>No product data available</p>;
    }

    const increase = () => {
         if(quantity<product.stock)
        {
            setQuantity(quantity + 1);
        }
           

    }
    const decrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const paymentHandler = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login first");
            return;
        }

        try {
            const keyResponse = await fetch("http://localhost:8080/api/v1/getkey");
            const { key_id } = await keyResponse.json();
            console.log('Key Data:', key_id);

            const requestBody = {
                amount: product.price * quantity, // Total price calculation
                currency: "INR",
                receipt: "Receipt no. 1"
            };

            const checkoutResponse = await fetch("http://localhost:8080/api/v1/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            const checkoutData = await checkoutResponse.json();

            const options = {
                key: key_id,
                amount: checkoutData.paymentResponse.amount,
                currency: "INR",
                name: "Alpha001",
                description: "Test Mode",
                order_id: checkoutData.paymentResponse.id,
                handler: async (response) => {
                    console.log("response", response);
                    try {
                        const res = await fetch(`http://localhost:8080/api/v1/paymentverification`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                product,
                                quantity,
                                token,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            })
                        });

                        const verifyData = await res.json();

                        if (verifyData.message) {
                            console.log("FE verified successfully");
                        }
                    } catch (error) {
                        console.log(error);
                    }
                },
                theme: {
                    color: "#5f63b8"
                }
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const addToCartHandler = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login first");
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/v1/addtocart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ product, quantity, token }) // Now sending quantity
            });

            if (!res.ok) {
                throw new Error(`Failed to add to cart: ${res.status}`);
            }

            const data = await res.json();
            console.log("Product added to cart successfully:", data);
            alert("Product added to cart successfully");
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to add product to cart. Please try again later.");
        }
    }

    return (
        <div className='product-page'>
            <div className='product-page-1'>
                <img src={product.thumbnail} alt="thumbnail" />
                <div className='images'>
                    {product.images.map((image, index) => (
                        <img key={index} src={image} alt={`product-img-${index}`} />
                    ))}
                </div>
            </div>
            <div className='product-page-2'>
                <div className='info-1'>
                    <h2>{product.title}</h2>
                    <p>{product.description}</p>
                    <h3>{product.rating} rating</h3>
                </div>
                <div className='info-2'>
                    <h2>Price {product.price}</h2>
                    <h2>{product.discountPercentage} discount</h2>
                </div>
                <div className='info-3'>
                    <h2>
                        Only {product.stock} left! 
                        Don't miss it
                    </h2>
                    <div className='buttons'>
                        <button onClick={paymentHandler}>Buy Now</button>
                        <button onClick={addToCartHandler}>Add to Cart</button>
                        <div>
                           <button onClick={decrease} disabled={quantity === 1}>-</button>
                           <span>{quantity}</span>
                           <button onClick={increase}>+</button>
                         </div>
                    </div>
                </div>
                <div className='info-4'>
                    <div>
                        <h2>Free delivery</h2>
                        <p>Enter your postal code for free delivery</p>
                    </div>
                    <div>
                        <h2>Return delivery</h2>
                        <p>Enter your postal code for free delivery</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductPage;
