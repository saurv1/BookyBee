import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { APIAuthenticated } from '../http';
import { Download, ArrowLeft, Loader2, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import Navbar from './Navbar';

const Invoice = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchBookingDetails();
    }, [bookingId]);

    const fetchBookingDetails = async () => {
        try {
            setLoading(true);
            const res = await APIAuthenticated.get(`/booking/${bookingId}`);
            if (res.data.success) {
                setBooking(res.data.booking);
            }
        } catch (error) {
            console.error("Error fetching booking:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        try {
            setDownloading(true);
            const doc = new jsPDF();
            const accentColor = [255, 184, 0]; // #FFB800

            // Header Section - Colored Banner
            doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
            doc.rect(0, 0, 210, 40, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text('INVOICE', 20, 25);
            
            doc.setFontSize(10);
            doc.text('BOOKYBEE SERVICES', 190, 20, { align: 'right' });
            doc.text('www.bookybee.com', 190, 26, { align: 'right' });

            // Booking Details
            doc.setTextColor(50, 50, 50);
            doc.setFontSize(10);
            const invId = booking._id.slice(-6).toUpperCase();
            doc.text(`Invoice ID: #INV-${invId}`, 20, 55);
            doc.text(`Issue Date: ${new Date(booking.createdAt).toLocaleDateString()}`, 20, 61);
            doc.text(`Status: COMPLETED (PAID)`, 20, 67);

            // Two Columns: Customer & Provider
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text('CUSTOMER', 20, 85);
            doc.text('SERVICE PROVIDER', 110, 85);

            doc.setFontSize(12);
            doc.setTextColor(30, 30, 30);
            doc.setFont('helvetica', 'bold');
            doc.text(`${booking.customer?.firstName} ${booking.customer?.lastName}`, 20, 93);
            doc.text(`${booking.provider?.firstName} ${booking.provider?.lastName}`, 110, 93);

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(booking.customer?.email || '', 20, 100);
            doc.text(booking.service || '', 110, 100);
            doc.text(booking.customer?.phone || '', 20, 106);
            doc.text(booking.provider?.phone || '', 110, 106);

            // Item Table
            doc.setDrawColor(240, 240, 240);
            doc.line(20, 120, 190, 120);
            
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text('DESCRIPTION', 20, 128);
            doc.text('TOTAL', 190, 128, { align: 'right' });
            
            doc.line(20, 132, 190, 132);

            doc.setFontSize(11);
            doc.setTextColor(30, 30, 30);
            doc.setFont('helvetica', 'bold');
            doc.text(booking.service, 20, 142);
            doc.text(`Rs ${booking.amount}`, 190, 142, { align: 'right' });

            doc.line(20, 152, 190, 152);

            // Final Total
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text('TOTAL AMOUNT PAID', 130, 170);
            
            doc.setFontSize(20);
            doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
            doc.setFont('helvetica', 'bold');
            doc.text(`Rs ${booking.amount}`, 190, 170, { align: 'right' });

            // Footer
            doc.setDrawColor(240, 240, 240);
            doc.line(20, 270, 190, 270);
            doc.setFontSize(8);
            doc.setTextColor(180, 180, 180);
            doc.text('Thank you for choosing BookyBee. This is a computer-generated document and requires no signature.', 105, 278, { align: 'center' });

            // Format filename: invoice_username_servicename.pdf
            const userName = booking.customer?.firstName?.toLowerCase() || 'customer';
            const serviceName = booking.service?.toLowerCase().replace(/\s+/g, '_') || 'service';
            const fileName = `invoice_${userName}_${serviceName}.pdf`;

            // This triggers the browser's save dialog immediately
            doc.save(fileName);
        } catch (error) {
            console.error("Manual PDF error:", error);
            alert("Digital delivery encountered a local system conflict. Please use Cmd+P to save this page as PDF.");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-12 h-12 text-[#FFB800] animate-spin" />
                    <p className="text-gray-400 font-bold">Fetching details...</p>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-6">
                    <h2 className="text-2xl font-black text-gray-900">Invoice Not Found</h2>
                    <button onClick={() => navigate(-1)} className="text-[#FFB800] font-bold underline">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans pb-20 pt-28">
            <Navbar />
            
            <div className="max-w-3xl mx-auto px-6">
                <div className="flex justify-between items-center mb-12 no-print">
                    <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-900 font-bold flex items-center space-x-2">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>
                    <button 
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-bold flex items-center space-x-2 hover:bg-[#FFB800] transition-colors shadow-lg active:scale-95"
                    >
                        {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        <span>Save as PDF</span>
                    </button>
                </div>

                <div className="border border-gray-100 p-10 rounded-2xl">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter mb-1">INVOICE</h1>
                            <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-6">#INV-{booking._id.slice(-6).toUpperCase()}</p>
                            
                            <div className="space-y-1 text-sm font-medium">
                                <p className="text-gray-400">Date: <span className="text-gray-900 font-bold">{new Date(booking.createdAt).toLocaleDateString()}</span></p>
                                <p className="text-gray-400">Status: <span className="text-[#FFB800] font-black uppercase tracking-wider">Paid</span></p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-black text-[#FFB800]">BookyBee</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Professional Home Services</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-12">
                        <div>
                            <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-2">Customer</p>
                            <p className="font-extrabold text-lg uppercase">{booking.customer?.firstName} {booking.customer?.lastName}</p>
                            <p className="text-xs text-gray-400 mt-1">{booking.customer?.email}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-2">Service</p>
                            <p className="font-extrabold text-[#FFB800] text-lg uppercase">{booking.service}</p>
                            <p className="text-xs text-gray-400 mt-1">Provider: {booking.provider?.firstName}</p>
                        </div>
                    </div>

                    <div className="border-t border-b border-gray-50 py-6 mb-10 flex justify-between items-center">
                        <p className="font-black text-gray-900">{booking.service}</p>
                        <p className="text-xl font-black text-gray-900">Rs {booking.amount}</p>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase mb-1">Amount Paid</p>
                        <p className="text-4xl font-black text-[#FFB800]">Rs {booking.amount}</p>
                    </div>
                </div>

                <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em] mt-12">
                    Secured Transaction • bookybee.com
                </p>
            </div>
        </div>
    );
};

export default Invoice;
