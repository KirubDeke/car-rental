"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

function PaymentContent() {
    const searchParams = useSearchParams();
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
    const router = useRouter();

    useEffect(() => {
        const verifyPayment = async () => {
            const tx_ref = searchParams.get('tx_ref');
            if (!tx_ref) {
                setPaymentStatus('failed');
                return;
            }

            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/chappa/verify/${tx_ref}`,
                    { withCredentials: true }
                );

                if (response.data.status === 'success') {
                    setPaymentStatus('success');
                    toast.success('Payment verified successfully!');
                } else {
                    setPaymentStatus('failed');
                    toast.error('Payment verification failed');
                }
            } catch (error) {
                setPaymentStatus('failed');
                toast.error('Error verifying payment');
            }
        };

        verifyPayment();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background px-4">
            <div className="flex items-start gap-4 max-w-3xl w-full">
                {/* Back button to the left of the card */}
                <button
                    onClick={() => router.push("/home")}
                    className="flex items-center text-red-500 dark:text-red-500 hover:text-red-600 dark:hover:text-red-600 transition-colors mb-12 -mt-8"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>
                {/* Card content */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg flex-1">
                    {paymentStatus === 'success' ? (
                        <div className="text-center">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                Payment Successful!
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Your booking has been confirmed. Thank you for your payment.
                            </p>
                        </div>
                    ) : paymentStatus === 'failed' ? (
                        <div className="text-center">
                            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                Payment Failed
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                There was an issue processing your payment. Please try again.
                            </p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                Verifying Payment...
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Please wait while we confirm your payment.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Loading...
                    </h2>
                </div>
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}