// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import {Base64} from "./libraries/Base64.sol";

// Inherit contract we imported. This means we'll have access
// to the inherited contract's methods
contract MyEpicNFT is ERC721URIStorage {
    // Keep tracks of tokenids.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // This is our SVG code. All we need to change is the word that's displayed. Everything else stays the same.
    // So, we make a svg variable here that all our NFTs can use.
    // Split SVG at the part where it asks for background colour
    string svgPartOne = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
    string svgPartTwo = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    // I create three arrays, each with their own theme of random words.
    string[] firstWords = ["WhiteRice ", "BakedPotato ", "FriedNoodle ", "ToastedBread ", "SteamCorn "];
    string[] secondWords = ["Satay ", "Terriyaki ", "Grill ", "Fried ", "Broiled "];
    string[] thirdWords = ["Chicken", "Beef", "Pork", "Lamb", "Fish"];
    
    string[] colors = ["red", "#08C2A8", "black", "yellow", "blue", "green"];
    
    event NewEpicNFTMinted(address sender, uint256 tokenId);

    // Pass the name of our NFTs token and its symbol.
    constructor() ERC721 ("DinnerTime", "DINE") {
        console.log("This is my NFT contract. Whoa!");
    }

    // I create a function to randomly pick a word from each array
    function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
        // I seed the random generator
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        // Squash the # between 0 and the length of the array to avoid going out of bounds
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

        function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

        function pickRandomColor(uint256 tokenId) public view returns (string memory) {
            uint256 rand = random(string(abi.encodePacked("COLOR", Strings.toString(tokenId))));
            rand = rand % colors.length;
            return colors[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    // A function our user will hit to get their NFT
    function makeAnEpicNFT() public {
        // Get current tokenId, this starts at 0
        uint256 newItemId = _tokenIds.current();

        // Go and randomly grab one word from each of the three arrays
        string memory first = pickRandomFirstWord(newItemId);
        string memory second = pickRandomSecondWord(newItemId);
        string memory third = pickRandomThirdWord(newItemId);
        string memory combinedWord = string(abi.encodePacked(first, second, third));

        string memory randomColour = pickRandomColor(newItemId);

        // I concatenate it all together, and then close the <text> and <svg> tags
        string memory finalSvg = string(abi.encodePacked(svgPartOne, randomColour, svgPartTwo, combinedWord, "</text></svg>"));

        // Get all the JSON metadata in place and base64 encode it
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        // We set the title of NFT as the generated word
                        combinedWord,
                        '", "description": "A highly acclaimed collection of dinner, Bon appetit.", "image": "data:image/svg+xml;base64,',
                        // We add data:image/svg+xml;base64 and then append our base64 encode our svg
                        Base64.encode(bytes(finalSvg)),                     
                        '"}'
                    )
                )
            )
        );

        // Prepend data:application/json;base64, to our data
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        console.log("\n--------------------");
        console.log(
            string(
                abi.encodePacked(
                    "https://nftpreview.0xdev.codes/?code=",
                    finalTokenUri
                    )
            )
        );
        console.log("--------------------\n");

        // Actually mint the NFT to the sender using msg.sender
        _safeMint(msg.sender, newItemId);

        // Set NFTs data
        _setTokenURI(newItemId, finalTokenUri);
        

        // Increment counter for when the next NFT is minted
        _tokenIds.increment();
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
    
        emit NewEpicNFTMinted(msg.sender, newItemId);
    }
}

