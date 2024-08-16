import React from 'react'

const entityandRoute = (entity) => {
    let result = ""
    if (entity.toLowerCase().includes("product") || entity.toLowerCase().includes("dictionary") || entity.toLowerCase().includes("material")) {
        result = "planning-service/"
    }
    else{
        result = "authentication-service/"
    }
    return (
        result
    )
}

export default entityandRoute