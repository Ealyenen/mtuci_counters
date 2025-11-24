import React from 'react'
import CounterMultimedia1 from './counter_multimedia/CounterMultimedia1'
import CounterCloud1 from './counter_cloud/CounterCloud1'
import { Typography } from '@mui/material'
import CounterAudio2 from './sound_multimedia/CounterSound'
import ImgStore from './img_store_multimedia/ImgStore'

const counters = {
    "cloud1": {
        name: "ТИСОС_1",
        component: < CounterCloud1 />
    },
    "multimedia1": {
        name: "МИС_1",
        component: <CounterMultimedia1 />
    },
    "multimedia2": {
        name: "МИС_2",
        component: <CounterAudio2 />
    },
    "multimedia3": {
        name: "МИС_3",
        component: <ImgStore />
    },
}

const Counters = () => {
    const [counter, setCounter] = React.useState(null)
    return (
        <>
            {!counter && <Typography sx={{mt:2, textAlign: "center"}} variant='h6'>Выберите задачу</Typography>}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20, marginBottom: 20 }}>
                {Object.keys(counters).map((key, index) => (
                    <button
                        key={key}
                        onClick={() => setCounter(key)}
                        style={{
                            margin: "0 5px",
                            padding: "10px 20px",
                            backgroundColor: counter === key ? "#007bff" : "#e0e0e0",
                            color: counter === index ? "#fff" : "#000",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer"
                        }}
                    >
                        {counters[key].name}
                    </button>
                ))}
            </div>
            {counter !== null && counters[counter].component}
        </>
    )
}
export default Counters