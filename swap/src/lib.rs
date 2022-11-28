use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey,
};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    account: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    msg!("Hello world");
    msg!("{:?}", *program_id);
    msg!("{:?}", account);
    Ok(())
}
