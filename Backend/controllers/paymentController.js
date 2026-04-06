const axios = require("axios");
const Transaction = require("../model/paymentModel");
const Booking = require("../model/bookingModel");
const { generateHmacSha256Hash } = require("../Services/paymentHelper");

const initiatePayment = async (req, res) => {
    const {
        amount,
        bookingId,
        paymentGateway,
        customerName,
        customerEmail,
        customerPhone,
        productName,
    } = req.body;

    // Validation
    if (!paymentGateway) {
        return res.status(400).json({ message: "Payment gateway is required" });
    }
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Valid amount is required" });
    }
    if (!bookingId) {
        return res.status(400).json({ message: "Booking ID is required" });
    }
    if (!customerName || !customerEmail || !customerPhone) {
        return res.status(400).json({ message: "Customer details are required" });
    }

    try {
        // Verify the booking exists
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check if payment already completed for this booking
        const existingTransaction = await Transaction.findOne({
            booking_id: bookingId,
            status: "COMPLETED",
        });
        if (existingTransaction) {
            return res.status(400).json({ message: "Payment already completed for this booking" });
        }

        // Generate a unique product ID for the transaction
        const productId = `BOOKY-${bookingId}-${Date.now()}`;

        const customerDetails = {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
        };

        const transactionData = {
            customerDetails,
            product_name: productName || booking.service,
            product_id: productId,
            booking_id: bookingId,
            amount,
            payment_gateway: paymentGateway,
        };

        let paymentConfig;
        if (paymentGateway === "esewa") {
            const SUCCESS_URL = process.env.SUCCESS_URL || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success`;
            const FAILURE_URL = process.env.FAILURE_URL || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failure`;

            const paymentData = {
                amount,
                failure_url: FAILURE_URL,
                product_delivery_charge: "0",
                product_service_charge: "0",
                product_code: process.env.ESEWA_MERCHANT_ID,
                signed_field_names: "total_amount,transaction_uuid,product_code",
                success_url: SUCCESS_URL,
                tax_amount: "0",
                total_amount: amount,
                transaction_uuid: productId,
            };

            const data = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
            const signature = generateHmacSha256Hash(data, process.env.ESEWA_SECRET);

            paymentConfig = {
                url: process.env.ESEWA_PAYMENT_URL,
                data: { ...paymentData, signature },
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                responseHandler: (response) => response.request?.res?.responseUrl,
            };
        } else if (paymentGateway === "khalti") {
            paymentConfig = {
                url: process.env.KHALTI_PAYMENT_URL,
                data: {
                    return_url: process.env.SUCCESS_URL || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success`,
                    website_url: process.env.FRONTEND_URL || "http://localhost:5173",
                    amount: amount * 100, // Convert to paisa
                    purchase_order_id: productId,
                    purchase_order_name: productName || booking.service,
                    customer_info: {
                        name: customerName,
                        email: customerEmail,
                        phone: customerPhone,
                    },
                },
                headers: {
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
                responseHandler: (response) => response.data?.payment_url,
            };
        } else {
            return res.status(400).json({ message: "Invalid payment gateway" });
        }

        // Make payment request
        const payment = await axios.post(paymentConfig.url, paymentConfig.data, {
            headers: paymentConfig.headers,
        });

        const paymentUrl = paymentConfig.responseHandler(payment);
        if (!paymentUrl) {
            throw new Error("Payment URL is missing in the response");
        }

        // Save transaction record
        const pidx = payment.data?.pidx || null;
        const transaction = new Transaction({
            ...transactionData,
            pidx,
        });
        await transaction.save();

        // Update booking payment status
        await Booking.findByIdAndUpdate(bookingId, {
            paymentStatus: "PENDING",
        });

        return res.json({
            success: true,
            url: paymentUrl,
            product_id: productId,
            booking_id: bookingId,
            pidx: payment.data?.pidx || productId,
            status: "PENDING",
        });
    } catch (error) {
        console.error(
            "Error during payment initiation:",
            error.response?.data || error.message
        );
        res.status(500).json({
            success: false,
            message: "Payment initiation failed",
            error: error.response?.data || error.message,
        });
    }
};

const paymentStatus = async (req, res) => {
    const { product_id, pidx, status } = req.body;

    if (!product_id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const transaction = await Transaction.findOne({ product_id });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        const { payment_gateway, booking_id } = transaction;

        if (status === "FAILED") {
            await Transaction.updateOne(
                { product_id },
                { $set: { status: "FAILED", updatedAt: new Date() } }
            );

            // Update booking payment status
            if (booking_id) {
                await Booking.findByIdAndUpdate(booking_id, {
                    paymentStatus: "FAILED",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Transaction status updated to FAILED",
                status: "FAILED",
            });
        }

        let paymentStatusCheck;

        if (payment_gateway === "esewa") {
            const paymentData = {
                product_code: process.env.ESEWA_MERCHANT_ID,
                total_amount: transaction.amount,
                transaction_uuid: transaction.product_id,
            };

            const response = await axios.get(
                process.env.ESEWA_PAYMENT_STATUS_CHECK_URL,
                { params: paymentData }
            );

            paymentStatusCheck = response.data;

            if (paymentStatusCheck.status === "COMPLETE") {
                await Transaction.updateOne(
                    { product_id },
                    { $set: { status: "COMPLETED", updatedAt: new Date() } }
                );

                if (booking_id) {
                    await Booking.findByIdAndUpdate(booking_id, {
                        paymentStatus: "COMPLETED",
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "Payment completed successfully",
                    status: "COMPLETED",
                    transaction: {
                        amount: transaction.amount,
                        product_name: transaction.product_name,
                        payment_gateway: transaction.payment_gateway,
                        booking_id: transaction.booking_id,
                    },
                });
            } else {
                await Transaction.updateOne(
                    { product_id },
                    { $set: { status: "FAILED", updatedAt: new Date() } }
                );

                if (booking_id) {
                    await Booking.findByIdAndUpdate(booking_id, {
                        paymentStatus: "FAILED",
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "Transaction status updated to FAILED",
                    status: "FAILED",
                });
            }
        }

        if (payment_gateway === "khalti") {
            try {
                const response = await axios.post(
                    process.env.KHALTI_VERIFICATION_URL,
                    { pidx },
                    {
                        headers: {
                            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                paymentStatusCheck = response.data;
            } catch (error) {
                if (error.response?.status === 400) {
                    paymentStatusCheck = error.response.data;
                } else {
                    console.error(
                        "Error verifying Khalti payment:",
                        error.response?.data || error.message
                    );
                    throw error;
                }
            }

            if (paymentStatusCheck.status === "Completed") {
                await Transaction.updateOne(
                    { product_id },
                    { $set: { status: "COMPLETED", updatedAt: new Date() } }
                );

                if (booking_id) {
                    await Booking.findByIdAndUpdate(booking_id, {
                        paymentStatus: "COMPLETED",
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "Payment completed successfully",
                    status: "COMPLETED",
                    transaction: {
                        amount: transaction.amount,
                        product_name: transaction.product_name,
                        payment_gateway: transaction.payment_gateway,
                        booking_id: transaction.booking_id,
                    },
                });
            } else {
                await Transaction.updateOne(
                    { product_id },
                    { $set: { status: "FAILED", updatedAt: new Date() } }
                );

                if (booking_id) {
                    await Booking.findByIdAndUpdate(booking_id, {
                        paymentStatus: "FAILED",
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "Transaction status updated to FAILED",
                    status: "FAILED",
                });
            }
        }

        return res.status(400).json({ message: "Invalid payment gateway" });
    } catch (error) {
        console.error("Error during payment status check:", error);
        res.status(500).json({
            success: false,
            message: "Payment status check failed",
            error: error.response?.data || error.message,
        });
    }
};

// Get transaction details by booking ID
const getTransactionByBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const transaction = await Transaction.findOne({ booking_id: bookingId }).sort({ createdAt: -1 });

        if (!transaction) {
            return res.status(404).json({ success: false, message: "No transaction found for this booking" });
        }

        return res.status(200).json({
            success: true,
            transaction,
        });
    } catch (error) {
        console.error("Error fetching transaction:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch transaction",
            error: error.message,
        });
    }
};

// Get transactions for a user
const getTransactionsByCustomer = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const transactions = await Transaction.find({
            "customerDetails.email": email,
            status: "COMPLETED"
        }).sort({ createdAt: -1 }).lean();

        return res.status(200).json({
            success: true,
            transactions,
        });
    } catch (error) {
        console.error("Error fetching customer transactions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch transactions",
            error: error.message,
        });
    }
};

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ status: "COMPLETED" }).sort({ createdAt: -1 }).lean();
        return res.status(200).json({
            success: true,
            transactions,
        });
    } catch (error) {
        console.error("Error fetching all transactions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch all transactions",
            error: error.message,
        });
    }
};

module.exports = { initiatePayment, paymentStatus, getTransactionByBooking, getTransactionsByCustomer, getAllTransactions };