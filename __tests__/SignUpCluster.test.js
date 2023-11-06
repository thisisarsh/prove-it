import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { SignUpCluster } from '../src/components/SignUpCluster';

describe('SignUpCluster', () => {

    it('should render the component', () => {
        const { getByText } = render(<SignUpCluster />);

        // Check if the component is rendered
        expect(getByText('Sign Up')).toBeInTheDocument();
    });

    it('should display an error message for empty fields', () => {
        const { getByText } = render(<SignUpCluster />);

        // Trigger form submission without filling in any fields
        fireEvent.click(getByText('Sign Up'));

        // Check if the error message is displayed
        expect(getByText('All fields must be filled out.')).toBeInTheDocument();
    });

    it('should display an error message for password mismatch', () => {
        const { getByText, getByLabelText } = render(<SignUpCluster />);

        // Fill in the password fields with different values
        fireEvent.change(getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'mismatched' } });

        // Trigger form submission
        fireEvent.click(getByText('Sign Up'));

        // Check if the error message is displayed
        expect(getByText('Password and Confirm Password do not match.')).toBeInTheDocument();
    });

    it('should display an error message for a weak password', () => {
        const { getByText, getByLabelText } = render(<SignUpCluster />);

        // Fill in the password fields with a weak password
        fireEvent.change(getByLabelText('Password'), { target: { value: 'weak' } });
        fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'weak' } });

        // Trigger form submission
        fireEvent.click(getByText('Sign Up'));

        // Check if the error message is displayed
        expect(getByText('Password must be 8-14 characters long with 1 special character and 1 uppercase letter.')).toBeInTheDocument();
    });
});
