// So, to test a smart contract we've got to do a bunch of stuff right. Like: compile, deploy, then execute.

const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();

  // This will actually compile our contract and generate the necessary files we need to work with our contract 
  // under the artifacts directory.
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  /**
   * Hardhat will create a local Ethereum network for us, but just for this contract. 
   * Then, after the script completes it'll destroy that local network. 
   * So, every time you run the contract, it'll be a fresh blockchain. 
   * What's the point? It's kinda like refreshing your local server every time so you always start 
   * from a clean slate which makes it easy to debug errors.
   */
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  /**
   * We'll wait until our contract is officially deployed to our local blockchain! 
   * Our constructor runs when we actually deploy.
   */
  await waveContract.deployed();

  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );

  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  let waveCount;
  waveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave('Hola mundo!');
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();

  let contractBalanceAfterWave = await hre.ethers.provider.getBalance(
    waveContract.address
  );

  console.log(
    'Contract balance after first wave:',
    hre.ethers.utils.formatEther(contractBalanceAfterWave)
  );

  // Basically this is how we can simulate other people hitting our functions :).
  waveTxn = await waveContract.connect(randomPerson).wave('Saludos saludoos');
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();


  // Basically this is how we can simulate other people hitting our functions :).
  waveTxn = await waveContract.connect(randomPerson).wave('mmmmmmmmbuenasss');
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();


  // Basically this is how we can simulate other people hitting our functions :).
  waveTxn = await waveContract.connect(randomPerson).wave('Hello!');
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();

  let finalContractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );

  console.log(
    'FInal contract balance:',
    hre.ethers.utils.formatEther(finalContractBalance)
  );
  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);


};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();