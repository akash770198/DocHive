import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currency = '$'
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const slotDateFormat = (slotDate) => {
        const dateArr = slotDate.split('_')
        return dateArr[0] + " " + months[dateArr[1]] + " " + dateArr[2]
    }


    const ageCalculator = (dob) => {
        const today = new Date()
        const birthDate = new Date(dob)

        let age = today.getFullYear() - birthDate.getFullYear()
        return age
    }

    const value = {
        ageCalculator, slotDateFormat, currency
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider