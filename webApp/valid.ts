async function main () {
    console.log("0x3D602d80600A3D3981F3363d3d373d3D3D363d73" == "0x3D602d80600A3D3981F3363d3d373d3D3D363d73")
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});