import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TipJarModule", (m) => {
  const tipJar = m.contract("TipJar");
  return { tipJar };
});
