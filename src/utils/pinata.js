// Removed: require('dotenv').config(); // This line is not needed in client-side React apps

const pinataApiKey = process.env.REACT_APP_PINATA_KEY;
const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET;

/**
 * Pins JSON data to IPFS via Pinata.
 * @param {Object} JSONBody - The JSON object to pin.
 * @returns {Promise<Object>} An object indicating success/failure and the Pinata URL.
 */
export const pinJSONToIPFS = async (JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey
            },
            body: JSON.stringify(JSONBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Pinata API Error:", errorData);
            return {
                success: false,
                message: `Pinata API error: ${errorData.error ? errorData.error.details : response.statusText}`
            };
        }

        const data = await response.json();
        return {
            success: true,
            pinataUrl: "https://gateway.pinata.cloud/ipfs/" + data.IpfsHash
        };
    } catch (error) {
        console.error("Error pinning JSON to IPFS:", error);
        return {
            success: false,
            message: error.message || "Unknown error occurred while pinning to IPFS."
        };
    }
};

/**
 * Pins a file (e.g., image) to IPFS via Pinata.
 * Note: This function is provided for completeness but might require
 * specific handling of FormData for file uploads in a browser environment.
 * For NFT metadata, `pinJSONToIPFS` is typically used.
 * @param {File} file - The file to pin.
 * @returns {Promise<Object>} An object indicating success/failure and the Pinata URL.
 */
export const pinFileToIPFS = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let data = new FormData();
    data.append('file', file);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey
            },
            body: data
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Pinata API Error (File):", errorData);
            return {
                success: false,
                message: `Pinata API error: ${errorData.error ? errorData.error.details : response.statusText}`
            };
        }

        const resJson = await response.json();
        return {
            success: true,
            pinataUrl: "https://gateway.pinata.cloud/ipfs/" + resJson.IpfsHash
        };
    } catch (error) {
        console.error("Error pinning file to IPFS:", error);
        return {
            success: false,
            message: error.message || "Unknown error occurred while pinning file to IPFS."
        };
    }
};
