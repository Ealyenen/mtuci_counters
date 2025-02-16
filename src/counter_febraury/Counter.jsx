import { useState } from "react"
import Form from "./components/Form"
import Counting from "./components/Counting"
import { Box, Button } from "@mui/material"

const Counter = () => {
    const [submited, setSubmited] = useState(false)
    const [counterData, setCounterData] = useState(null)

    const handleSubmit = (e) => {
        setSubmited(true)
        setCounterData(e)
    }

    const handleRestart = () => {
        setSubmited(false)
        setCounterData(null)
    }

    return (
        <>
            {submited ?
                <Counting data={counterData} restart={handleRestart}/>
                :
                <Form onSubmit={handleSubmit} />
            }
        </>
    )
}

export default Counter