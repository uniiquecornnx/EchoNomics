// const { expect } = require("chai");

// describe("TipJar", function () {
//   it("Should transfer ETH to streamer", async function () {
//     const [sender, streamer] = await ethers.getSigners();
//     const TipJar = await ethers.getContractFactory("TipJar");
//     const tipJar = await TipJar.deploy();
//     await tipJar.waitForDeployment();

//     const tipAmount = ethers.parseEther("0.01");
//     await expect(
//       tipJar.connect(sender).sendTip(streamer.address, "Nice stream!", { value: tipAmount })
//     ).to.changeEtherBalances(
//       [sender, streamer],
//       [-tipAmount, tipAmount]
//     );
//   });
// });


const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TipJar", function () {
  it("should transfer ETH from sender to streamer", async function () {
    const [sender, streamer] = await ethers.getSigners();

    // Deploy the contract
    const TipJar = await ethers.getContractFactory("TipJar");
    const tipJar = await TipJar.deploy();
    await tipJar.waitForDeployment();

    // Send a tip
    const tipAmount = ethers.parseEther("0.01");

    await expect(
      tipJar.connect(sender).sendTip(streamer.address, "Nice stream!", {
        value: tipAmount,
      })
    ).to.changeEtherBalances(
      [sender, streamer],
      [-tipAmount, tipAmount]
    );
  });

  it("should emit TipSent event", async function () {
    const [sender, streamer] = await ethers.getSigners();
    const TipJar = await ethers.getContractFactory("TipJar");
    const tipJar = await TipJar.deploy();
    await tipJar.waitForDeployment();

    const tipAmount = ethers.parseEther("0.01");

    await expect(
      tipJar.connect(sender).sendTip(streamer.address, "You rock!", {
        value: tipAmount,
      })
    )
      .to.emit(tipJar, "TipSent")
      .withArgs(sender.address, streamer.address, tipAmount, "You rock!");
  });
});
