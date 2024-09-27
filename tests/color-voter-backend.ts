import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ColorVoterBackend } from "../target/types/color_voter_backend";
import { assert } from "chai";

describe("color-voter-backend", () => {
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

    try {
      const tx = await program.methods
        .createColor("Blue")
        .accounts(accounts)
        .signers([colorAccount])
        .rpc();

      console.log("Transaction signature for color creation", tx);

      const colorAccountInfo = await program.account.color.fetch(colorAccount.publicKey);
      assert.equal(colorAccountInfo.name, "Blue");
      assert.equal(colorAccountInfo.votes.toNumber(), 0);
    } catch (error) {
      console.error("Error creating color: ", error);
    }
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

    try {
      const tx = await program.methods
        .voteColor()
        .accounts({
          color: colorAccount.publicKey,
        })
        .rpc();

      console.log("Transaction signature for voting", tx);

      const colorAccountInfo = await program.account.color.fetch(colorAccount.publicKey);
      assert.equal(colorAccountInfo.votes.toNumber(), 1);

      await program.methods
        .voteColor()
        .accounts({
          color: colorAccount.publicKey,
        })
        .rpc();

      const updatedColorAccountInfo = await program.account.color.fetch(colorAccount.publicKey);
      assert.equal(updatedColorAccountInfo.votes.toNumber(), 2);
    } catch (error) {
      console.error("Error voting for color: ", error);
    }
  });
});
