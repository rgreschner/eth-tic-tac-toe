pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract EmergencyStop is Ownable {

    bool private _isStopped = false;

    modifier stoppedInEmergency {
        require(!_isStopped);
        _;
    }

    modifier onlyWhenStopped {
        require(_isStopped);
        _;
    }

    function stopContract() public onlyOwner {
        _isStopped = true;
    }

    function resumeContract() public onlyOwner {
        _isStopped = false;
    }

    function isStopped() public view returns (bool) {
        return _isStopped;
    }

}