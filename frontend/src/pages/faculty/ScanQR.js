import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { eventsAPI } from '../../utils/api';

const ScanQR = () => {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        // Initialize scanner
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 5,
        });

        scanner.render(success, errorCallback);

        function success(result) {
            scanner.clear();
            setScanResult(result);
            processQR(result);
        }

        function errorCallback(err) {
            // Ignored: this constantly fires when no QR is found
        }

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);

    const processQR = async (qrText) => {
        setProcessing(true);
        setError(null);
        try {
            const data = JSON.parse(qrText);
            if (!data.eventId || !data.studentId) {
                throw new Error("Invalid QR Code FORMAT");
            }

            const res = await eventsAPI.checkIn(data.eventId, data.studentId);

            setScanResult({
                success: true,
                message: res.data.message
            });

        } catch (err) {
            console.error(err);
            setScanResult({
                success: false,
                message: err.response?.data?.message || err.message || "Invalid QR Code"
            });
        } finally {
            setProcessing(false);
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        window.location.reload(); // Simple way to remount the scanner safely
    };

    return (
        <div className="page animated">
            <h2 className="section-title">Scan Ticket QR</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                Scanner requires camera permissions. Point it at a student's ticket to check them in.
            </p>

            <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
                {scanResult ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        {processing ? (
                            <h3>Processing...</h3>
                        ) : scanResult.success ? (
                            <>
                                <div style={{ fontSize: '4rem', color: '#10B981', marginBottom: '10px' }}>✅</div>
                                <h3 style={{ color: '#059669' }}>Success!</h3>
                                <p style={{ fontSize: '18px', margin: '10px 0' }}>{scanResult.message}</p>
                            </>
                        ) : (
                            <>
                                <div style={{ fontSize: '4rem', color: '#EF4444', marginBottom: '10px' }}>❌</div>
                                <h3 style={{ color: '#DC2626' }}>Error</h3>
                                <p style={{ fontSize: '18px', margin: '10px 0' }}>{scanResult.message}</p>
                            </>
                        )}

                        <button
                            className="btn btn-primary"
                            onClick={resetScanner}
                            style={{ marginTop: '20px' }}
                            disabled={processing}
                        >
                            Scan Another Ticket
                        </button>
                    </div>
                ) : (
                    <div id="reader"></div>
                )}
            </div>
        </div>
    );
};

export default ScanQR;
