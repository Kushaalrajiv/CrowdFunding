// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lock {
    address private campaignOwner;
    uint256 private goal;
    uint256 private totalFunds;

    bool public campaignComplete;

    mapping(address => uint256) public contributions;
    address[] public contributors;
    constructor(address _campaignOwner, uint256 _goal) {
        campaignOwner = _campaignOwner;
        goal = _goal;
        campaignComplete = false;
    }

    function contribute() external payable {
        require(!campaignComplete, "Campaign is already complete");
        require(msg.value > 0, "Contribution amount must be greater than 0");

        contributions[msg.sender] += msg.value;
        totalFunds += msg.value;
        if (contributions[msg.sender] == msg.value) {
            contributors.push(msg.sender);
        }
        checkFundingStatus(); // Check if funding goal is reached
    }


    function withdrawFunds() external {
        require(campaignComplete, "Campaign is not yet complete");
        require(msg.sender == campaignOwner, "Only campaign owner can withdraw funds");
        payable(campaignOwner).transfer(totalFunds);
    }

    function getContributions() external view returns (address[] memory, uint256[] memory) {
        uint256 length = contributors.length;
        address[] memory contributorList = new address[](length);
        uint256[] memory contributionList = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            contributorList[i] = contributors[i];
            contributionList[i] = contributions[contributors[i]];
        }
        
        return (contributorList, contributionList);
    }

    function checkFundingStatus() private  {
        if (!campaignComplete && totalFunds >= goal) {
            campaignComplete = true;
        }
    }

}