use borsh::BorshDeserialize;
use solana_program::program_error::ProgramError;

pub enum SwapInstruction {
    Swap { amount: u64 },
}

#[derive(BorshDeserialize)]
struct SwapInstructionPayload {
    amount: u64,
}

impl SwapInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;
        let payload = SwapInstructionPayload::try_from_slice(rest)?;
        Ok(match variant {
            0 => Self::Swap {
                amount: payload.amount,
            },
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}
