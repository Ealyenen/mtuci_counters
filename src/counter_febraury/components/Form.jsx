import { Box, Button, Divider, FormHelperText, FormLabel, Input, Link, Paper, Typography } from "@mui/material"
import { useState } from "react";

const onVariant = (e) => {
    const newValue = e.target.value.replace(/\D/g, "");
    e.target.value = Number(newValue) >= 1 && Number(newValue) <= 34 ? newValue : newValue.slice(0, 1)
};

const onPvalue = (e) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, "");
    e.target.value = Number(newValue) >= 0 && Number(newValue) < 1 ? newValue.slice(0, 4) : newValue.slice(0, newValue.length - 1)
};

const Form = ({ onSubmit }) => {
    const [variant, setVariant] = useState(null)
    const [Pvalue, setPvalue] = useState(0.99)
    const tableLink = "https://docs.google.com/spreadsheets/d/1_t-TIUPNTxYSPI9Zw5yM90puaBM1bz6qJAAMknyyL10/edit?usp=sharing"

    const handleSubmit = () => {
        onSubmit({ variant: variant, P: Pvalue })
    }

    return (
        <>
            <Paper
                sx={{
                    width: 300,
                    marginLeft: "50%",
                    transform: "translateX(-50%)",
                    marginTop: "10%",
                    padding: 2
                }}
            >
                <Typography>
                    Введите номер варианта - номер в <span><Link href={tableLink} target="_blank">списке группы</Link></span> (от 1 до 34) и выданное всей группе значение
                </Typography>
                <Box sx={{ marginTop: 4 }}>

                    <FormLabel>Вариант</FormLabel>
                    <Input
                        fullWidth
                        size="small"
                        onInput={onVariant}
                        onChange={(e) => setVariant(e.target.value)}
                    />
                    {/* <FormHelperText>В диапазоне между 1 и 33</FormHelperText> */}
                </Box>
                <Box sx={{ marginTop: 4 }}>
                    <FormLabel>P</FormLabel>
                    <Box>
                        <Input
                            fullWidth
                            defaultValue={Pvalue}
                            onInput={onPvalue}
                            onChange={(e) => setPvalue(e.target.value)}
                        />
                        {/* <FormHelperText>В диапазоне между 0 и 1</FormHelperText> */}
                    </Box>
                </Box>
                <Divider sx={{ marginTop: 4 }} />
                <Button
                    fullWidth
                    disabled={!variant || !Pvalue}
                    variant="contained"
                    size="small"
                    onClick={handleSubmit}
                    sx={{ marginTop: 2 }}
                >
                    Рассчитать
                </Button>
            </Paper>
        </>
    )
}

export default Form