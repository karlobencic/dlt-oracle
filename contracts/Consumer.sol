pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "chainlink/contracts/Chainlinked.sol";

contract Consumer is Chainlinked, Ownable {
    // solium-disable-next-line zeppelin/no-arithmetic-operations
    uint256 constant private ORACLE_PAYMENT = 1 * LINK;

    bytes32 public jobId;

    event RequestFulfilled(
        bytes32 indexed requestId,
        uint256 price
    );

    mapping(bytes32 => bytes32) requests;
    mapping(bytes32 => uint256) public prices;

    constructor(address _token, address _oracle, bytes32 _jobId) public {
        setLinkToken(_token);
        setOracle(_oracle);
        jobId = _jobId;
    }

    /**
        @dev Request the price using Bitstamp and Coinbase, returning a median value
        @dev Value is multiplied by 100 to include 2 decimal places
    */
    function requestPrice(string _currency1, string _currency2) public {
        Chainlink.Request memory req = newRequest(jobId, this, this.fulfill.selector);

        string[] memory api = new string[](2);
        api[0] = string(abi.encodePacked("https://www.bitstamp.net/api/v2/ticker/", _currency1, _currency2));
        api[1] = string(abi.encodePacked("https://api.pro.coinbase.com/products/", _currency1, "-", _currency2, "/ticker"));
        req.addStringArray("api", api);

        string[] memory paths = new string[](2);
        paths[0] = "$.last";
        paths[1] = "$.price";
        req.addStringArray("paths", paths);
        req.add("aggregationType", "median");
        req.add("copyPath", "aggregateValue");
        req.addInt("times", 100);

        bytes32 requestId = chainlinkRequest(req, ORACLE_PAYMENT);
        requests[requestId] = keccak256(abi.encodePacked(_currency1, _currency2));
    }

    function cancelRequest(bytes32 _requestId, uint256 _payment, bytes4 _callbackFunctionId, uint256 _expiration) public onlyOwner
    {
        cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
    }

    function fulfill(bytes32 _requestId, uint256 _price) public recordChainlinkFulfillment(_requestId)
    {
        emit RequestFulfilled(_requestId, _price);
        prices[requests[_requestId]] = _price;
        delete requests[_requestId];
    }
}