import { Box, Button, Divider, Paper, Tooltip, Typography } from "@mui/material"
import Span from "./TextSpan"

const Counting = ({ data, restart }) => {
    const handleRestart = () => {
        restart()
    }

    const deltaSimbol = <span style={{ fontSize: "0.8em" }}>Δ</span>

    const OsSH = Math.pow(10, 0.1 * data.variant)
    const OsSHRounded = Math.round(OsSH * 100) / 100

    const Cvalue1 = Math.log2(1 + OsSHRounded)
    const Cvalue1Rounded = Math.round(Cvalue1 * 1000) / 1000

    const Cvalue2 = data.variant * Math.pow(10, 6) * Math.log2(1 + OsSHRounded)
    const Cvalue2Rounded = Math.round(Cvalue2 / Math.pow(10, 6) * 1000) / 1000

    const Lfactor = data.variant <= 5 ? 1000 : 100
    const Lvalue = data.variant * Lfactor

    const deltaP = 1 / (4 * Lvalue * (1 - data.P))
    const deltaPRounded = Math.round(deltaP * 10000) / 10000
    const deltaPRounded2 = Math.round(deltaPRounded * 10 * 100) / 100

    const countDeltaPResult = () => {
        if (deltaP > 0) {
            let exponent = Math.floor(Math.log10(Math.abs(deltaP)));
            let mantissa = Math.floor(deltaP / Math.pow(10, exponent));
            return {exponent:exponent, mantissa:mantissa}
        } else return null
    }

    const deltaPResult = countDeltaPResult()

    return (
        <Box sx={{margin: 4}}>
            <Button onClick={handleRestart} variant="contained" size="small">Заного</Button>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                {/* TASK 1 */}
                <Paper sx={{ padding: 2 }}>
                    <Typography variant="h6">№1</Typography>
                    <Typography>ОСШ<Span>(дБ)</Span>=10log(ОСШ<Span>(разы)</Span>)</Typography>
                    <Typography>ОСШ<Span>(разы)</Span>=10<Span top>0.1*ОСШ<Span>(дБ)</Span></Span></Typography>
                    <Typography>ОСШ<Span>(разы)</Span>=10<Span top>0.1*{data.variant}</Span></Typography>
                    <Tooltip placement="top-start" title={`ОСШ = ${OsSH}`}>
                        <Typography color="primary">ОСШ<Span>(разы)</Span>={OsSHRounded}</Typography>
                    </Tooltip>
                </Paper>
                {/* TASK 2 */}
                <Paper sx={{ padding: 2 }}>
                    <Typography variant="h6">№2</Typography>
                    <Typography>C={deltaSimbol}F*log<Span>2</Span>(1+ОСШ)</Typography>
                    <Divider />
                    <Box>
                        <Typography>{"1)"}{deltaSimbol}F = 1 Гц</Typography>
                        <Typography>C = 1 log<Span>2</Span>(1+{OsSHRounded})</Typography>
                        <Tooltip placement="top-start" title={`C = ${Cvalue1}`}>
                            <Typography color="primary">C = {Cvalue1Rounded} бит/с</Typography>
                        </Tooltip>
                        <Typography color="primary">C/{deltaSimbol}F = {Cvalue1Rounded} (бит/с / Гц)(Спектральная эффективность)</Typography>
                    </Box>
                    <Divider />
                    <Box>
                        <Typography>{"2)"}{deltaSimbol}F = {data.variant} МГц</Typography>
                        <Typography>C = {data.variant}*10<Span top>6</Span> log<Span>2</Span>(1+{OsSHRounded})</Typography>
                        <Tooltip placement="top-start" title={`C = ${Cvalue2 / Math.pow(10, 6)} * 10^6`}>
                            <Typography color="primary">C = {Cvalue2Rounded} Мбит/с</Typography>
                        </Tooltip>
                        <Typography color="primary">C/{deltaSimbol}F = {Cvalue1Rounded} (бит/с / Гц)(Спектральная эффективность)</Typography>
                    </Box>
                    <Divider />
                    <Typography variant="body2" color="secondary">Не знаю что писать в выводе т.к. спектральная эффективность всегда одинаковая получаеться. Этот пункт на записи вообще не очень понятно объяснен. Лучше пересмотреть запись</Typography>
                    <Typography variant="body2" color="secondary">Я написал C/F=C/F2={Cvalue1Rounded} (бит/с / Гц) для F - 1 и F2 = {data.variant} МГц</Typography>
                </Paper>
                {/* TASK 3 */}
                <Paper sx={{ padding: 2 }}>
                    <Typography variant="h6">№3</Typography>
                    <Typography>L = {data.variant} * {Lfactor}</Typography>
                    <Typography color="primary">L = {Lvalue} (число испытаний)</Typography>
                </Paper>
                {/* TASK 4 */}
                <Paper sx={{ padding: 2 }}>
                    <Typography variant="h6">№4</Typography>
                    <Box sx={{ display: 'flex', alignItems: "center" }}>
                        <Typography>{deltaSimbol}<Span>p</Span>{String.fromCharCode(8805)}
                        </Typography>
                        <Box>
                            <Typography textAlign={"center"}>1</Typography>
                            <Divider />
                            <Typography>4 * L * (1 - P)</Typography>
                        </Box>
                    </Box>
                    <Typography>L = {Lvalue}; P = {data.P}</Typography>
                    <Box sx={{ display: 'flex', alignItems: "center" }}>
                        <Typography>{deltaSimbol}<Span>p</Span>{String.fromCharCode(8805)}
                        </Typography>
                        <Box>
                            <Typography textAlign={"center"}>1</Typography>
                            <Divider />
                            <Typography>4 * {Lvalue} * (1 - {data.P})</Typography>
                        </Box>
                    </Box>
                    <Typography>{deltaSimbol}<Span>p</Span>{String.fromCharCode(8805)} = {deltaPRounded}</Typography>
                    <Typography>{deltaSimbol}<Span>p</Span>{String.fromCharCode(8805)} = {deltaPRounded2} * 10 <Span top>-1</Span></Typography>
                    <Divider/>
                    {deltaPResult ?
                    <Typography color="primary">
                        Примерно {deltaPResult.mantissa} ошибок на {Math.pow(10, Math.abs(deltaPResult.exponent))} бит
                    </Typography>
                    :
                    <Typography color="error">
                        Не удалось вычислить вывод, проверьте вычисления
                        </Typography>
                        }
                </Paper>
            </Box>
        </Box>
    )
}

export default Counting