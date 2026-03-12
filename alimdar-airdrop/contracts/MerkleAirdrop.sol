// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Minimal IERC20 interface
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/// @notice Minimal Ownable
abstract contract Ownable {
    address public owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(address initialOwner) {
        require(initialOwner != address(0), "owner=0");
        owner = initialOwner;
        emit OwnershipTransferred(address(0), initialOwner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "owner=0");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

/// @notice OpenZeppelin-compatible MerkleProof implementation
library MerkleProof {
    function verify(bytes32[] memory proof, bytes32 root, bytes32 leaf) internal pure returns (bool) {
        return processProof(proof, leaf) == root;
    }

    function processProof(bytes32[] memory proof, bytes32 leaf) internal pure returns (bytes32) {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            if (computedHash <= proofElement) {
                computedHash = keccak256(bytes.concat(computedHash, proofElement));
            } else {
                computedHash = keccak256(bytes.concat(proofElement, computedHash));
            }
        }
        return computedHash;
    }
}

/// @title MerkleAirdrop
/// @notice Claim-based airdrop contract for an existing ERC20 token
contract MerkleAirdrop is Ownable {
    IERC20 public immutable token;
    bytes32 public merkleRoot;
    uint64 public immutable claimStart;
    uint64 public immutable claimEnd;

    mapping(address => bool) public claimed;

    event Claimed(address indexed account, uint256 amount);
    event Recovered(address indexed to, uint256 amount);

    error AlreadyClaimed();
    error InvalidProof();
    error ClaimNotOpen();
    error ClaimEnded();

    constructor(
        address tokenAddress,
        bytes32 root,
        uint64 startTime,
        uint64 endTime,
        address initialOwner
    ) Ownable(initialOwner) {
        require(tokenAddress != address(0), "token=0");
        require(endTime > startTime, "bad window");
        token = IERC20(tokenAddress);
        merkleRoot = root;
        claimStart = startTime;
        claimEnd = endTime;
    }

    function claim(uint256 amount, bytes32[] calldata proof) external {
        if (block.timestamp < claimStart) revert ClaimNotOpen();
        if (block.timestamp > claimEnd) revert ClaimEnded();
        if (claimed[msg.sender]) revert AlreadyClaimed();

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        bool ok = MerkleProof.verify(proof, merkleRoot, leaf);
        if (!ok) revert InvalidProof();

        claimed[msg.sender] = true;
        require(token.transfer(msg.sender, amount), "transfer failed");

        emit Claimed(msg.sender, amount);
    }

    /// @notice Recover unclaimed tokens after claim period ends
    function recoverUnclaimed(address to, uint256 amount) external onlyOwner {
        require(block.timestamp > claimEnd, "claim active");
        require(to != address(0), "to=0");
        require(token.transfer(to, amount), "recover failed");
        emit Recovered(to, amount);
    }
}
