// contracts/SupplyChain.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract SupplyChain {
    struct Shipment {
        uint id;
        string status;
        string location;
        uint timestamp;
        bool isDelivered;
    }

    struct DemandForecast {
        uint id;
        uint predictedDemand;
        uint actualDemand;
        uint timestamp;
    }

    mapping(uint => Shipment) public shipments;
    mapping(uint => DemandForecast) public forecasts;
    uint public shipmentCount;
    uint public forecastCount;

    event ShipmentCreated(uint id, string status, string location, uint timestamp);
    event ShipmentUpdated(uint id, string status, string location, uint timestamp);
    event ShipmentDelivered(uint id, uint timestamp);
    event ReturnRequested(uint id, string reason, uint timestamp);
    event ReturnProcessed(uint id, bool approved, uint timestamp);
    event DemandForecastCreated(uint id, uint predictedDemand, uint actualDemand, uint timestamp);
    event DemandForecastUpdated(uint id, uint predictedDemand, uint actualDemand, uint timestamp);

    function createShipment(uint _id, string memory _status, string memory _location) public {
        shipmentCount++;
        shipments[_id] = Shipment(_id, _status, _location, block.timestamp, false);
        emit ShipmentCreated(_id, _status, _location, block.timestamp);
    }

    function updateShipment(uint _id, string memory _status, string memory _location) public {
        Shipment storage shipment = shipments[_id];
        shipment.status = _status;
        shipment.location = _location;
        shipment.timestamp = block.timestamp;
        emit ShipmentUpdated(_id, _status, _location, block.timestamp);
    }

    function markAsDelivered(uint _id) public {
        Shipment storage shipment = shipments[_id];
        shipment.isDelivered = true;
        shipment.timestamp = block.timestamp;
        emit ShipmentDelivered(_id, block.timestamp);
    }

    function requestReturn(uint _id, string memory _reason) public {
        emit ReturnRequested(_id, _reason, block.timestamp);
    }

    function processReturn(uint _id, bool _approved) public {
        emit ReturnProcessed(_id, _approved, block.timestamp);
    }

    function createDemandForecast(uint _id, uint _predictedDemand, uint _actualDemand) public {
        forecastCount++;
        forecasts[_id] = DemandForecast(_id, _predictedDemand, _actualDemand, block.timestamp);
        emit DemandForecastCreated(_id, _predictedDemand, _actualDemand, block.timestamp);
    }

    function updateDemandForecast(uint _id, uint _predictedDemand, uint _actualDemand) public {
        DemandForecast storage forecast = forecasts[_id];
        forecast.predictedDemand = _predictedDemand;
        forecast.actualDemand = _actualDemand;
        forecast.timestamp = block.timestamp;
        emit DemandForecastUpdated(_id, _predictedDemand, _actualDemand, block.timestamp);
    }

    function getShipment(uint _id) public view returns (Shipment memory) {
        return shipments[_id];
    }

    function getDemandForecast(uint _id) public view returns (DemandForecast memory) {
        return forecasts[_id];
    }
}
