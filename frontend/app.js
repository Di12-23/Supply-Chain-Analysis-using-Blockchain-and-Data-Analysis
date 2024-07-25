const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138'; //  deployed contract address
const contractABI =[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "currentLocation",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "ShipmentCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "currentLocation",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "delivered",
				"type": "bool"
			}
		],
		"name": "ShipmentUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_currentLocation",
				"type": "string"
			}
		],
		"name": "createShipment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_shipmentId",
				"type": "uint256"
			}
		],
		"name": "getShipment",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "currentLocation",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "delivered",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "shipmentCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "shipments",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "currentLocation",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "delivered",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_shipmentId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_currentLocation",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "_delivered",
				"type": "bool"
			}
		],
		"name": "updateShipment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

// Create a Web3 instance using injected provider (MetaMask or similar)
let web3;
if (typeof window.ethereum !== 'undefined') {
    // Use MetaMask's provider
    web3 = new Web3(window.ethereum);
} else {
    console.log('No Ethereum provider detected. Please install MetaMask or enable an Ethereum provider.');
}

// Create a contract instance
const myContract = new web3.eth.Contract(contractABI, contractAddress);

// Function to create shipment
async function createShipment() {
    try {
        // Request account access if needed
        await window.ethereum.enable();

        // Get input values
        const description = document.getElementById('description').value;
        const location = document.getElementById('location').value;

        // Get accounts
        const accounts = await web3.eth.getAccounts();
        console.log('Attempting to create shipment...');

        // Send transaction to create shipment
        const result = await myContract.methods.createShipment(description, location).send({
            from: accounts[0],
            gas: 3000000 // Adjust gas limit as needed
        });

        console.log('Shipment created:', result);

        // Check if ShipmentCreated event exists in transaction receipt logs
        const event = result.events['ShipmentCreated'];
        if (event) {
            // Retrieve shipment ID from event return values
            const shipmentId = event.returnValues.id;

            // Display shipment ID on the page
            document.getElementById('createStatus').innerText = `Shipment created with ID: ${shipmentId}`;
        } else {
            throw new Error('ShipmentCreated event not found in transaction receipt.');
        }
    } catch (error) {
        console.error('Error creating shipment:', error);
    }
}

// Function to update shipment
async function updateShipment() {
    try {
        // Request account access if needed
        await window.ethereum.enable();

        // Get input values
        const shipmentId = document.getElementById('updateId').value;
        const newLocation = document.getElementById('newLocation').value;
        const delivered = document.getElementById('delivered').checked;

        // Get accounts
        const accounts = await web3.eth.getAccounts();
        console.log(`Updating shipment ${shipmentId}...`);

        // Send transaction to update shipment
        const result = await myContract.methods.updateShipment(shipmentId, newLocation, delivered).send({
            from: accounts[0],
            gas: 3000000 // Adjust gas limit as needed
        });

        console.log('Shipment updated:', result);

        // Display status on the page
        document.getElementById('updateStatus').innerText = `Shipment ${shipmentId} updated successfully.`;
    } catch (error) {
        console.error('Error updating shipment:', error);
    }
}

// Function to get shipment details
async function getShipment() {
    try {
        // Get input value
        const shipmentId = document.getElementById('shipmentId').value;

        // Call contract method to get shipment details
        const shipment = await myContract.methods.getShipment(shipmentId).call();

        console.log('Shipment details:', shipment);

        // Display shipment details on the page
        const shipmentDetailsDiv = document.getElementById('shipmentDetails');
        shipmentDetailsDiv.innerHTML = `
            <h3>Shipment Details</h3>
            <p><strong>ID:</strong> ${shipment.id}</p>
            <p><strong>Description:</strong> ${shipment.description}</p>
            <p><strong>Current Location:</strong> ${shipment.currentLocation}</p>
            <p><strong>Timestamp:</strong> ${new Date(shipment.timestamp * 1000)}</p>
            <p><strong>Delivered:</strong> ${shipment.delivered ? 'Yes' : 'No'}</p>
        `;
    } catch (error) {
        console.error('Error getting shipment details:', error);
    }
}
