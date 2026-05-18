// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IntegrityToken (AIT)
 * @dev ERC20 token for Academic Integrity DAO governance.
 * Officers hold this token and their balance represents voting power.
 */
contract IntegrityToken is ERC20, Ownable {
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    constructor() ERC20("Academic Integrity Token", "AIT") Ownable(msg.sender) {
        // Initial supply is zero.
        // Admin mints tokens to officers when required.
    }

  
   

    /**
     * @dev Easier minting function for demo.
     * Example: mintOfficerTokens(officer, 10) gives 10 full AIT tokens.
     */
    function mintOfficerTokens(address to, uint256 tokenAmount) public onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(tokenAmount > 0, "Amount must be greater than zero");

        uint256 amount = tokenAmount * 10 ** decimals();

        _mint(to, amount);

        emit TokensMinted(to, amount);
    }

    /**
     * @dev Optional penalty/revocation mechanism.
     * Admin can burn tokens from an officer if needed.
     */
    function burn(address from, uint256 amount) public onlyOwner {
        require(from != address(0), "Cannot burn from zero address");
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(from) >= amount, "Insufficient balance to burn");

        _burn(from, amount);

        emit TokensBurned(from, amount);
    }

    function getBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }
}