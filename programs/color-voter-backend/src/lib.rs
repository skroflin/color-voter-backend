use anchor_lang::prelude::*;

declare_id!("xT1sp4mfJ4rNGjwbrCNNMgFPXmUgUerAYCsoEGNKd4U");

#[program]
pub mod color_voter_backend {
    use super::*;

    #[account]
    pub struct Color {
        pub name: String,
        pub votes: u64
    }

    pub fn create_color(ctx: Context<CreateColor>, name: String) -> Result<()> {
        let color = &mut ctx.accounts.color;
        color.name = name;
        color.votes = 0;
        Ok(())
    }

    pub fn vote_color(ctx: Context<VoteColor>) -> Result<()> {
        let color = &mut ctx.accounts.color;
        color.votes += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateColor<'info> {
    #[account(init, payer = user, space = 8 + 40 + 8)]
    pub color: Account<'info, Color>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VoteColor<'info> {
    #[account(mut)]
    pub color: Account<'info, Color>
}
