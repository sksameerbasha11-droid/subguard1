import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

describe("SubGuard Protocol — Smart Contract & Payment Firewall Test Suite", function () {
  let subGuard: any;
  let subscriber: any;
  let merchant: any;
  let unauthorizedUser: any;

  const THIRTY_DAYS = 30 * 24 * 60 * 60;

  beforeEach(async function () {
    [subscriber, merchant, unauthorizedUser] = await ethers.getSigners();
    const SubGuardFactory = await ethers.getContractFactory("SubGuard");
    subGuard = await SubGuardFactory.deploy();
    await subGuard.waitForDeployment();
  });

  describe("Subscription Creation & Queries", function () {
    it("Should create a subscription with spending rules and emit SubscriptionCreated", async function () {
      const nextPayment = Math.floor(Date.now() / 1000) + THIRTY_DAYS;
      const tx = await subGuard.connect(subscriber).createSubscription(
        merchant.address,
        "Netflix",
        649,
        699,
        THIRTY_DAYS,
        nextPayment
      );

      await expect(tx)
        .to.emit(subGuard, "SubscriptionCreated")
        .withArgs(1, subscriber.address, merchant.address, "Netflix", 649, 699, THIRTY_DAYS, nextPayment);

      const sub = await subGuard.getSubscription(1);
      expect(sub.id).to.equal(1);
      expect(sub.subscriber).to.equal(subscriber.address);
      expect(sub.merchant).to.equal(merchant.address);
      expect(sub.serviceName).to.equal("Netflix");
      expect(sub.amount).to.equal(649);
      expect(sub.maxAmount).to.equal(699);
      expect(sub.active).to.be.true;
      expect(sub.paused).to.be.false;
    });

    it("Should retrieve all subscriptions for a specific user", async function () {
      const nextPayment = Math.floor(Date.now() / 1000) + THIRTY_DAYS;
      await subGuard.connect(subscriber).createSubscription(merchant.address, "Netflix", 649, 699, THIRTY_DAYS, nextPayment);
      await subGuard.connect(subscriber).createSubscription(merchant.address, "Spotify", 119, 149, THIRTY_DAYS, nextPayment);

      const userSubs = await subGuard.getUserSubscriptions(subscriber.address);
      expect(userSubs.length).to.equal(2);
      expect(userSubs[0].serviceName).to.equal("Netflix");
      expect(userSubs[1].serviceName).to.equal("Spotify");
    });

    it("Should reject invalid merchant address", async function () {
      const nextPayment = Math.floor(Date.now() / 1000) + THIRTY_DAYS;
      await expect(
        subGuard.connect(subscriber).createSubscription(ethers.ZeroAddress, "Netflix", 649, 699, THIRTY_DAYS, nextPayment)
      ).to.be.revertedWith("SubGuard: invalid merchant address");
    });

    it("Should reject zero or invalid amount", async function () {
      const nextPayment = Math.floor(Date.now() / 1000) + THIRTY_DAYS;
      await expect(
        subGuard.connect(subscriber).createSubscription(merchant.address, "Netflix", 0, 699, THIRTY_DAYS, nextPayment)
      ).to.be.revertedWith("SubGuard: amount must be greater than zero");
    });

    it("Should reject maxAmount lower than amount", async function () {
      const nextPayment = Math.floor(Date.now() / 1000) + THIRTY_DAYS;
      await expect(
        subGuard.connect(subscriber).createSubscription(merchant.address, "Netflix", 649, 500, THIRTY_DAYS, nextPayment)
      ).to.be.revertedWith("SubGuard: maxAmount must be >= amount");
    });
  });

  describe("Core Payment Firewall Execution", function () {
    let nextPayment: number;

    beforeEach(async function () {
      nextPayment = Math.floor(Date.now() / 1000) + THIRTY_DAYS;
      // Setup Netflix: 649 MSTC authorized, max limit 699 MSTC
      await subGuard.connect(subscriber).createSubscription(
        merchant.address,
        "Netflix",
        649,
        699,
        THIRTY_DAYS,
        nextPayment
      );
    });

    it("FIREWALL ALLOW: Valid payment at authorized amount (649 MSTC)", async function () {
      const [allowed, reason] = await subGuard.isPaymentAllowed(1, 649);
      expect(allowed).to.be.true;
      expect(reason).to.equal("Payment authorized by SubGuard firewall");

      await expect(subGuard.connect(merchant).requestPayment(1, 649))
        .to.emit(subGuard, "PaymentAllowed")
        .withArgs(1, subscriber.address, merchant.address, 649);
    });

    it("FIREWALL BLOCK: Payment exceeding maximum authorized limit (2999 MSTC)", async function () {
      const [allowed, reason] = await subGuard.isPaymentAllowed(1, 2999);
      expect(allowed).to.be.false;
      expect(reason).to.equal("Requested amount exceeds authorized limit");

      await expect(subGuard.connect(merchant).requestPayment(1, 2999))
        .to.emit(subGuard, "PaymentBlocked")
        .withArgs(1, subscriber.address, merchant.address, 2999, 699, "Requested amount exceeds authorized limit");
    });

    it("FIREWALL BLOCK: Paused subscription blocks payment requests", async function () {
      await subGuard.connect(subscriber).pauseSubscription(1);
      const sub = await subGuard.getSubscription(1);
      expect(sub.paused).to.be.true;

      const [allowed, reason] = await subGuard.isPaymentAllowed(1, 649);
      expect(allowed).to.be.false;
      expect(reason).to.equal("Subscription is currently paused");

      await expect(subGuard.connect(merchant).requestPayment(1, 649))
        .to.emit(subGuard, "PaymentBlocked")
        .withArgs(1, subscriber.address, merchant.address, 649, 699, "Subscription is currently paused");
    });

    it("FIREWALL RESUME: Resuming paused subscription restores authorization", async function () {
      await subGuard.connect(subscriber).pauseSubscription(1);
      await subGuard.connect(subscriber).resumeSubscription(1);

      const [allowed] = await subGuard.isPaymentAllowed(1, 649);
      expect(allowed).to.be.true;
    });

    it("FIREWALL CANCEL: Cancelled subscription permanently stops payments", async function () {
      await subGuard.connect(subscriber).cancelSubscription(1);
      const sub = await subGuard.getSubscription(1);
      expect(sub.active).to.be.false;

      const [allowed, reason] = await subGuard.isPaymentAllowed(1, 649);
      expect(allowed).to.be.false;
      expect(reason).to.equal("Subscription is cancelled");
    });

    it("SECURITY: Unauthorized non-subscriber cannot pause or cancel", async function () {
      await expect(
        subGuard.connect(unauthorizedUser).pauseSubscription(1)
      ).to.be.revertedWith("SubGuard: caller is not subscriber");

      await expect(
        subGuard.connect(unauthorizedUser).cancelSubscription(1)
      ).to.be.revertedWith("SubGuard: caller is not subscriber");
    });
  });
});
