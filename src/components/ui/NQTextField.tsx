import { TextField, styled, TextFieldProps } from '@mui/material';
import { ReactNode } from 'react';

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderRadius: 12,
    background: '#fff',
    fontSize: 16,
    minHeight: 56,
    alignItems: 'center',
    boxShadow: '0 1px 4px 0 rgba(60,60,60,0.03)',
  },
  '& .MuiInputBase-input': {
    height: 'auto',
    boxSizing: 'border-box',
    '&:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px #fff inset',
      WebkitTextFillColor: theme.palette.text.primary,
      transition: 'background-color 5000s ease-in-out 0s',
      caretColor: theme.palette.text.primary,
    },
    '&:-webkit-autofill:focus': {
      WebkitBoxShadow: '0 0 0 1000px #fff inset',
      WebkitTextFillColor: theme.palette.text.primary,
    },
    '&:-webkit-autofill:hover': {
      WebkitBoxShadow: '0 0 0 1000px #fff inset',
      WebkitTextFillColor: theme.palette.text.primary,
    },
    '&:-webkit-autofill:active': {
      WebkitBoxShadow: '0 0 0 1000px #fff inset',
      WebkitTextFillColor: theme.palette.text.primary,
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#d1d5db',
    background: 'transparent',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '& .MuiFocused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    borderWidth: 2,
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    fontSize: 15,
    color: theme.palette.text.secondary,
    top: '50%',
    left: 16,
    transform: 'translateY(-50%) scale(1)',
    pointerEvents: 'none',
    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1) 0ms',
  },
  '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled':
    {
      color: theme.palette.primary.main,
      fontWeight: 600,
      top: 0,
      left: 0,
      transform: 'translate(14px, -9px) scale(0.75)',
      pointerEvents: 'auto',
    },
  '& .MuiInputAdornment-root': {
    height: '100%',
  },
  '& .MuiIconButton-root': {
    padding: 8,
    marginRight: 2,
    marginLeft: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export type NQTextFieldProps = TextFieldProps & {
  endAdornment?: ReactNode;
};

const NQTextField = ({ endAdornment, ...props }: NQTextFieldProps) => {
  return (
    <CustomTextField
      {...props}
      InputProps={{
        ...props.InputProps,
        endAdornment,
      }}
    />
  );
};

export default NQTextField;
