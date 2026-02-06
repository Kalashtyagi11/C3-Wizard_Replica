import { useState } from 'react'

const useTogglePassword = () => {

    const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const togglePasswordVisibility = () => setShowPassword(!showPassword);
const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

return {showPassword,showConfirmPassword,togglePasswordVisibility,toggleConfirmPasswordVisibility}
}

export default useTogglePassword