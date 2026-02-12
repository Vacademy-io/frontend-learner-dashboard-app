import React, { useEffect, useState } from 'react';

const EwayCardForm = () => {
    const [cardDetails, setCardDetails] = useState({});
    const [pendingTimeoutId, setPendingTimeoutId] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCardDetails({ ...cardDetails, [name]: value });

        // Clear any existing timeout to debounce the auto-encryption
        if (pendingTimeoutId) {
            clearTimeout(pendingTimeoutId);
        }

        // Set a new timeout for encryption
        const timeoutId = setTimeout(() => {
            autoEncryptCardDetails(cardDetails);
        }, 300);

        setPendingTimeoutId(timeoutId);
    };

    const autoEncryptCardDetails = (details) => {
        // Your encryption logic goes here
        console.log('Encrypting card details...', details);
    };

    // Cleanup function to clear any pending timeouts on unmount
    useEffect(() => {
        return () => {
            if (pendingTimeoutId) {
                clearTimeout(pendingTimeoutId);
            }
        };
    }, [pendingTimeoutId]);

    return (
        <form>
            <input type="text" name="cardNumber" onChange={handleChange} placeholder="Card Number" />
            <input type="text" name="expiryDate" onChange={handleChange} placeholder="Expiry Date" />
            <input type="text" name="cvv" onChange={handleChange} placeholder="CVV" />
        </form>
    );
};

export default EwayCardForm;