// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PolyHopCharacter is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    constructor() ERC721("PolyHop Character", "PHC") Ownable(msg.sender) {}

    function mintCharacter(string memory tokenURI) external returns (uint256) {
        uint256 tokenId = ++nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }
}