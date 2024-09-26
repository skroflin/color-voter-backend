import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ColorVoterBackend } from "../target/types/color_voter_backend";
import { assert } from "chai";

describe("color-voter-backend", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.ColorVoterBackend as Program<ColorVoterBackend>;

  it("Enter a new color", async () => {
    const colorAccount = anchor.web3.Keypair.generate();

    const accounts = {
      color: colorAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    };

    const tx = await program.methods
     .createColor("Blue")
     .accounts(accounts)
     .signers([colorAccount])
     .rpc();

    console.log("Transaction signature for color creation", tx);

    const colorAccountInfo = await program.account.color.fetch(colorAccount.publicKey);
    assert.equal(colorAccountInfo.name, "Blue");
    assert.equal(colorAccountInfo.votes.toNumber(), 0);
  });

  it("You can vote for a color", async () => {
    const colorAccount = anchor.web3.Keypair.generate();

    const accounts = {
      color: colorAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    };

    await program.methods
      .createColor("Green")
      .accounts(accounts)
      .signers([colorAccount])
      .rpc();

    const tx = await program.methods
      .voteColor()
      .accounts({
        color: colorAccount.publicKey,
      })
      .rpc();

    console.log("Transaction signature for voting", tx);

    const colorAccountInfo = await program.account.color.fetch(colorAccount.publicKey);
    assert.equal(colorAccountInfo.votes.toNumber(), 1);
  })
});
