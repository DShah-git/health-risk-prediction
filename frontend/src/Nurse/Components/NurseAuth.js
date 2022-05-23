export const isLoggedIn = () => {
    const token = localStorage.getItem('nurse_token')
    if (token) {
        return true
    } else{
        return false
    }
}