// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./PlatziPunksDNA.sol";

contract PlatziPunks is ERC721, ERC721Enumerable, Ownable, PaymentSplitter, PlatziPunksDNA {
  using Counters for Counters.Counter;
  using Strings for uint256;

  Counters.Counter private _tokenIdCounter;
  uint256 public maxSupply;

  constructor(uint256 _maxSupply, address[] memory _payees, uint256[] memory _shares) ERC721("PlatziPunks", "EDPKS") PaymentSplitter(_payees, _shares) {
    maxSupply = _maxSupply;
  }

  function mint() public payable {
      // Require that the person who calls the function has more than 0.005 ETH to mint a new token
      require(msg.value > 5000000000000000, "You must send at least 0.005 ETH to mint a new token of Platzi Punk");

      uint256 tokenId = _tokenIdCounter.current();
      // Require that the tokenId is less than the maximum supply of tokens
      require(tokenId < maxSupply, "ERC721: minting would exceed total supply, not plaztiPunks left");

      // mint a new token
      _safeMint(msg.sender, tokenId);
      // increment the tokenId counter
      _tokenIdCounter.increment();
  }

      function tokenURI(uint256 _tokenId)
        public
        pure
        override
        returns (string memory)
    {
        bytes memory jsonURI = abi.encodePacked(
          '{ "name": "PlatziPunks #', _tokenId.toString(), '"',
          '"description": "Platzi Punks are randomized Avataaars stored on chain to teach DApp development on Platzi",',
          '"image": "', '"// TODO: calculate image url"',
          '"}'
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(jsonURI)
            )
        );
    }

  // The following functions are overrides required by Solidity.
  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
      internal
      override(ERC721, ERC721Enumerable)
  {
      super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
      public
      view
      override(ERC721, ERC721Enumerable)
      returns (bool)
  {
      return super.supportsInterface(interfaceId);
  }
}