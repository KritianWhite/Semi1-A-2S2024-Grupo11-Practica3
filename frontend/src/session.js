const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

const getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

const removeLocalStorage = (key) => {
    localStorage.removeItem(key);
}

const clearLocalStorage = () => {
    localStorage.clear();
}

const logout = () => {
    clearLocalStorage();
}

export { setLocalStorage, getLocalStorage, removeLocalStorage, clearLocalStorage, logout };