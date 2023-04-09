import { Button as MuiButton } from '@mui/material'

type Props = {
  variant?: 'text' | 'outlined' | 'contained'
  label: string
}

const ButtonComponent = ({ label, variant = 'contained' }: Props) => {
  return <MuiButton variant={variant}>{label}</MuiButton>
}

export const Button = ButtonComponent
