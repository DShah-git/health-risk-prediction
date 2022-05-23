export const isLoggedIn = () => {
    const token = localStorage.getItem('patient_token')
    if (token) {
        return true
    } else{
        return false
    }
}