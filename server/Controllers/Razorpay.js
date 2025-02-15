const { instance } = require('../Config/razorpay');
const crypto = require('crypto');
require('dotenv').config();
const Payment = require('../Models/Payment');
const OrderedProducts = require('../Models/OrderedProducts');
const User = require('../Models/User');

// Function to generate a random receipt
function generateReceipt() {
    return Math.random().toString(36).substring(7);
}

// Initiate Razorpay order
exports.capturePayment = async (req, res) => {
    try {
        const { amount, upi_id } = req.body;
        const currency = "INR";
        const receipt = generateReceipt();
        
        const options = {
            amount: amount * 100,
            currency,
            receipt,
        };

        if (upi_id) {
            options.payment_capture = 1; // Auto-capture payment
            options.notes = { upi_id };
        }

        const paymentResponse = await instance.orders.create(options);
        
        return res.status(200).json({
            success: true,
            paymentResponse
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(400).json({
            success: false,
            message: "Could not initiate the order",
            error: error.message
        });
    }
};

// Verify payment
exports.paymentVerification = async (req, res) => {
    try {
        const { product, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User id is missing" });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        const newPayment = await Payment.create({
            razorpay_order_id,
            razorpay_signature,
            razorpay_payment_id,
            userId
        });

        const order = await OrderedProducts.create({
            product,
            userId,
            paymentId: newPayment._id,
            status: "ordered"
        });

        await Payment.findByIdAndUpdate(newPayment._id, { orderedProductId: order._id });
        await User.findByIdAndUpdate(userId, { $push: { ordered_products: order._id } }, { new: true });

        console.log("Payment verified successfully");
        res.redirect(`http://localhost:8080/paymentsuccess?reference=${razorpay_payment_id}`);
    } catch (error) {
        console.error("Error during payment verification:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


/// Payment refund
exports.paymentRefund = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user.id;

        // Validation for missing fields
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "orderId are missing"
            });
        }

        // Check if user ID is present
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id is missing"
            });
        }

        //get payment id
        const orderdPro = await OrderedProducts.findById(orderId).populate('paymentId');
        const paymentId = orderdPro?.paymentId?.razorpay_payment_id;
        const amount = orderdPro.product.amount;

        //console.log(orderdPro);

       // console.log("pay -> ",paymentId);
        // Process the refund through Razorpay
        const refundResponse = await instance.payments.refund(paymentId, {
            amount: amount,
            speed: "optimum",
        });

        // Update user schema: Add to refunded products
        await User.findByIdAndUpdate(
            userId,
            { $push: { refunded_products: orderId } },
            { new: true }
        );

        // Remove the product from the ordered products list
        await User.findByIdAndUpdate(
            userId,
            { $pull: { ordered_products: orderId } },
            { new: true }
        );

        // Update the status of the ordered product to "refunded"
        await OrderedProducts.findByIdAndUpdate(
            orderId, // Use orderedId which should be an ObjectId
            { status: "refunded" },
            { new: true }
        );

        // Respond with success
        return res.status(200).json({
            success: true,
            message: "Payment refund successful",
            refundResponse
        });
    } catch (error) {
        console.error("Error while processing refund:", error);
        res.status(500).json({
            success: false,
            message: "Error while making request for refund",
            error: error.message
        });
    }
};




// fetch details of all payments
exports.fetchAllPayments=async(req,res)=>{
    try{
        const response= await instance.payments.all();
        console.log(response);

        return res.status(200).json({
            success:true,
            message:"fetched all payments successfully",
            response
          })
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:"error while fetching all payments details",
            error:error.message
        })
    }
}


// fetch payment by id
exports.fetchPaymentWithId = async(req,res)=>{
    try{

        const {orderId}=req.body;

        //console.log(req.body);
        //validation
        if(!orderId)
        {
            return res.status(400).json({
                success:false,
                message:"orderId is missing"
            })
        }

         //fetch payment id 
         const data = await Payment.findOne({
            razorpay_order_id:orderId
        });

        if(!data){
            return res.status(400).json({
                success:false,
                message:"orderId is invalid"
            })
        }
        const paymentId = data.razorpay_payment_id;

        const response= await instance.payments.fetch(paymentId);
        //console.log(response);

        return res.status(200).json({
            success:true,
            message:"fetched payment successfully",
            response
          })
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:"error while fetching payment details",
            error:error
        })
    }
}



// fetch card details used for payment
exports.fetchCardDetails = async(req,res)=>{
    try{

        const {orderId}=req.body;

        //validation
        if(!orderId)
        {
            return res.status(400).json({
                success:false,
                message:"orderId is missing"
            })
        }

        // fetch payment id 
        const data = await Payment.findOne({
            razorpay_order_id:orderId
        });

        if(!data){
            return res.status(400).json({
                success:false,
                message:"orderId is invalid"
            })
        }
        const paymentId = data.razorpay_payment_id;

        const response= await instance.payments.fetchCardDetails(paymentId)
        //console.log(response);

        return res.status(200).json({
            success:true,
            message:"fetched card details successfully",
            response
          })
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:"error while fetching payment card details",
            error:error
        })
    }
}



// get key id controller
exports.getKeyId= async (req,res)=>{
    try{
        const Id=process.env.RAZORPAY_KEY_ID;
        return res.status(200).json({
            success:true,
            message:"successfully fetched razorpay key id",
            key_id:Id
        })
    }
    catch(error)
    {
        return res.status(400).json({
            success:false,
            message:"error while geting key id",
            error:error.message
        })
    }
}