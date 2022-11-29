mod instruction;

use instruction::SwapInstruction;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    pubkey::Pubkey,
};
use spl_token::instruction::{mint_to_checked, transfer_checked};

entrypoint!(process_instruction);

fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let destination_token_move_account = next_account_info(accounts_iter)?;
    let token_program = next_account_info(accounts_iter)?;
    let move_token_pubkey = next_account_info(accounts_iter)?;
    let owner_singer_pubkey = next_account_info(accounts_iter)?;
    let source_token_wsol_account = next_account_info(accounts_iter)?;
    let destination_token_wsol_account = next_account_info(accounts_iter)?;
    let wsol_token_pubkey = next_account_info(accounts_iter)?;
    let source_token_wsol_account_holder = next_account_info(accounts_iter)?;
    match SwapInstruction::unpack(instruction_data)? {
        SwapInstruction::Swap { amount } => {
            msg!(
                "Minting {} tokens to {}",
                amount * 10,
                destination_token_move_account.key.to_string()
            );
            let mint_to_checked_instruction = mint_to_checked(
                token_program.key,
                move_token_pubkey.key,
                destination_token_move_account.key,
                owner_singer_pubkey.key,
                &[owner_singer_pubkey.key],
                amount * 10,
                9,
            )?;
            let required_accounts_for_mint_to_instruction = [
                move_token_pubkey.clone(),
                destination_token_move_account.clone(),
                owner_singer_pubkey.clone(),
            ];
            invoke(
                &mint_to_checked_instruction,
                &required_accounts_for_mint_to_instruction,
            )?;
            msg!(
                "Transferring {} WSOL tokens from {} to {}",
                amount,
                source_token_wsol_account.key.to_string(),
                destination_token_wsol_account.key.to_string()
            );
            let transfer_checked_instruction = transfer_checked(
                token_program.key,
                source_token_wsol_account.key,
                wsol_token_pubkey.key,
                destination_token_wsol_account.key,
                source_token_wsol_account_holder.key,
                &[source_token_wsol_account_holder.key],
                amount,
                9,
            )?;
            let require_accounts_for_transfer_checked_instruction = [
                source_token_wsol_account.clone(),
                wsol_token_pubkey.clone(),
                destination_token_wsol_account.clone(),
                source_token_wsol_account_holder.clone(),
            ];
            invoke(
                &transfer_checked_instruction,
                &require_accounts_for_transfer_checked_instruction,
            )?;
            Ok(())
        }
    }
}
