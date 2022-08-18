// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract PlatziPunks is ERC721 {
  constructor() ERC721("PlatziPunks", "EDPKS"){
    
  }
}