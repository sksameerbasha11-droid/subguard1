// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SubGuard
 * @author SubGuard Protocol
 * @notice Programmable subscription manager and payment firewall powered by MST Blockchain.
 * Tagline: "Your Subscriptions. Your Rules."
 */
contract SubGuard {
    struct Subscription {
        uint256 id;
        address subscriber;
        address merchant;
        string serviceName;
        uint256 amount;
        uint256 maxAmount;
        uint256 billingInterval;
        uint256 nextPaymentAt;
        bool active;
        bool paused;
        uint256 createdAt;
    }

    uint256 private _subscriptionIdCounter;

    // Mapping from subscription ID to Subscription data
    mapping(uint256 => Subscription) public subscriptions;

    // Mapping from user address to their array of subscription IDs
    mapping(address => uint256[]) private _userSubscriptions;

    // Core Firewall & Subscription Lifecycle Events
    event SubscriptionCreated(
        uint256 indexed id,
        address indexed subscriber,
        address indexed merchant,
        string serviceName,
        uint256 amount,
        uint256 maxAmount,
        uint256 billingInterval,
        uint256 nextPaymentAt
    );
    event SubscriptionPaused(uint256 indexed id, address indexed subscriber);
    event SubscriptionResumed(uint256 indexed id, address indexed subscriber);
    event SubscriptionCancelled(uint256 indexed id, address indexed subscriber);
    event PaymentAllowed(
        uint256 indexed id,
        address indexed subscriber,
        address indexed merchant,
        uint256 amount
    );
    event PaymentBlocked(
        uint256 indexed id,
        address indexed subscriber,
        address indexed merchant,
        uint256 requestedAmount,
        uint256 maxAmount,
        string reason
    );
    event PaymentProcessed(
        uint256 indexed id,
        address indexed subscriber,
        address indexed merchant,
        uint256 amount,
        uint256 timestamp
    );
    event PaymentRuleUpdated(uint256 indexed id, uint256 newAmount, uint256 newMaxAmount);

    modifier onlySubscriber(uint256 subscriptionId) {
        require(subscriptions[subscriptionId].subscriber == msg.sender, "SubGuard: caller is not subscriber");
        _;
    }

    modifier exists(uint256 subscriptionId) {
        require(subscriptions[subscriptionId].id != 0, "SubGuard: subscription does not exist");
        _;
    }

    /**
     * @notice Creates a new subscription rule on MST Blockchain
     * @param merchant Destination wallet address for merchant
     * @param serviceName Service identifier (e.g. "Netflix", "Spotify")
     * @param amount Expected recurring subscription amount
     * @param maxAmount Maximum authorized payment ceiling (firewall rule)
     * @param billingInterval Recurring period in seconds
     * @param nextPaymentAt Scheduled timestamp of the next expected payment
     */
    function createSubscription(
        address merchant,
        string calldata serviceName,
        uint256 amount,
        uint256 maxAmount,
        uint256 billingInterval,
        uint256 nextPaymentAt
    ) external returns (uint256) {
        require(merchant != address(0), "SubGuard: invalid merchant address");
        require(bytes(serviceName).length > 0, "SubGuard: service name required");
        require(amount > 0, "SubGuard: amount must be greater than zero");
        require(maxAmount >= amount, "SubGuard: maxAmount must be >= amount");
        require(billingInterval > 0, "SubGuard: billing cycle must be greater than zero");
        require(nextPaymentAt >= block.timestamp, "SubGuard: next payment date must be in future");

        _subscriptionIdCounter++;
        uint256 newId = _subscriptionIdCounter;

        subscriptions[newId] = Subscription({
            id: newId,
            subscriber: msg.sender,
            merchant: merchant,
            serviceName: serviceName,
            amount: amount,
            maxAmount: maxAmount,
            billingInterval: billingInterval,
            nextPaymentAt: nextPaymentAt,
            active: true,
            paused: false,
            createdAt: block.timestamp
        });

        _userSubscriptions[msg.sender].push(newId);

        emit SubscriptionCreated(
            newId,
            msg.sender,
            merchant,
            serviceName,
            amount,
            maxAmount,
            billingInterval,
            nextPaymentAt
        );

        return newId;
    }

    /**
     * @notice Evaluates whether a requested payment passes the firewall rules
     * @param subscriptionId ID of the subscription
     * @param requestedAmount Requested payment amount
     * @return allowed True if within rules and active, false otherwise
     * @return reason Explanation message for firewall decision
     */
    function isPaymentAllowed(uint256 subscriptionId, uint256 requestedAmount)
        public
        view
        exists(subscriptionId)
        returns (bool allowed, string memory reason)
    {
        Subscription storage sub = subscriptions[subscriptionId];

        if (!sub.active) {
            return (false, "Subscription is cancelled");
        }
        if (sub.paused) {
            return (false, "Subscription is currently paused");
        }
        if (requestedAmount == 0) {
            return (false, "Payment amount must be greater than zero");
        }
        if (requestedAmount > sub.maxAmount) {
            return (false, "Requested amount exceeds authorized limit");
        }

        return (true, "Payment authorized by SubGuard firewall");
    }

    /**
     * @notice Merchant requests payment; smart contract validates against firewall rules
     * @param subscriptionId Target subscription
     * @param requestedAmount Payment amount claimed
     */
    function requestPayment(uint256 subscriptionId, uint256 requestedAmount)
        external
        exists(subscriptionId)
        returns (bool)
    {
        Subscription storage sub = subscriptions[subscriptionId];
        require(msg.sender == sub.merchant || msg.sender == sub.subscriber, "SubGuard: unauthorized caller");

        (bool allowed, string memory reason) = isPaymentAllowed(subscriptionId, requestedAmount);

        if (!allowed) {
            emit PaymentBlocked(
                subscriptionId,
                sub.subscriber,
                sub.merchant,
                requestedAmount,
                sub.maxAmount,
                reason
            );
            return false;
        }

        // Advance next payment schedule
        sub.nextPaymentAt = block.timestamp + sub.billingInterval;

        emit PaymentAllowed(subscriptionId, sub.subscriber, sub.merchant, requestedAmount);
        emit PaymentProcessed(subscriptionId, sub.subscriber, sub.merchant, requestedAmount, block.timestamp);

        return true;
    }

    /**
     * @notice Pauses an active subscription rule
     */
    function pauseSubscription(uint256 subscriptionId)
        external
        exists(subscriptionId)
        onlySubscriber(subscriptionId)
    {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.active, "SubGuard: subscription is inactive");
        require(!sub.paused, "SubGuard: already paused");

        sub.paused = true;
        emit SubscriptionPaused(subscriptionId, msg.sender);
    }

    /**
     * @notice Resumes a paused subscription rule
     */
    function resumeSubscription(uint256 subscriptionId)
        external
        exists(subscriptionId)
        onlySubscriber(subscriptionId)
    {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.active, "SubGuard: subscription is inactive");
        require(sub.paused, "SubGuard: subscription not paused");

        sub.paused = false;
        emit SubscriptionResumed(subscriptionId, msg.sender);
    }

    /**
     * @notice Permanently cancels a subscription rule
     */
    function cancelSubscription(uint256 subscriptionId)
        external
        exists(subscriptionId)
        onlySubscriber(subscriptionId)
    {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.active, "SubGuard: already cancelled");

        sub.active = false;
        emit SubscriptionCancelled(subscriptionId, msg.sender);
    }

    /**
     * @notice Updates the pricing and maximum authorized rule
     */
    function updateRule(
        uint256 subscriptionId,
        uint256 newAmount,
        uint256 newMaxAmount
    ) external exists(subscriptionId) onlySubscriber(subscriptionId) {
        require(newAmount > 0, "SubGuard: amount must be > 0");
        require(newMaxAmount >= newAmount, "SubGuard: maxAmount must be >= amount");

        Subscription storage sub = subscriptions[subscriptionId];
        sub.amount = newAmount;
        sub.maxAmount = newMaxAmount;

        emit PaymentRuleUpdated(subscriptionId, newAmount, newMaxAmount);
    }

    function getSubscription(uint256 subscriptionId)
        external
        view
        exists(subscriptionId)
        returns (Subscription memory)
    {
        return subscriptions[subscriptionId];
    }

    function getUserSubscriptions(address user)
        external
        view
        returns (Subscription[] memory)
    {
        uint256[] storage ids = _userSubscriptions[user];
        Subscription[] memory userSubs = new Subscription[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            userSubs[i] = subscriptions[ids[i]];
        }
        return userSubs;
    }
}
