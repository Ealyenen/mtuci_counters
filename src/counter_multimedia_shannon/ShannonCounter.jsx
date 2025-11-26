import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, TextField, Typography,
    Button
} from "@mui/material";

// ---------------------- UTILITIES --------------------------

const isRus = char => /[а-яё ]/i.test(char);

// Частоты
function countLetters(str) {
    const freq = {};
    for (const ch of str.toLowerCase()) {
        if (isRus(ch)) freq[ch] = (freq[ch] || 0) + 1;
    }
    return freq;
}

// Shannon–Fano: рекурсивное построение кодов
function buildShannonFano(nodes, code = "", depth = 0, treeLevels = []) {
    if (!treeLevels[depth]) treeLevels[depth] = [];

    // Лист — назначаем код
    if (nodes.length === 1) {
        nodes[0].code = code;
        treeLevels[depth].push(nodes.map(n => n.char).join(""));
        return;
    }

    // Ищем точку разбиения
    let total = nodes.reduce((s, n) => s + n.prob, 0);
    let half = total / 2;

    let acc = 0;
    let splitIndex = 0;
    for (let i = 0; i < nodes.length; i++) {
        acc += nodes[i].prob;
        if (acc >= half) {
            splitIndex = i;
            break;
        }
    }

    const left = nodes.slice(0, splitIndex + 1);
    const right = nodes.slice(splitIndex + 1);

    treeLevels[depth].push(nodes.map(n => n.char).join(""));

    buildShannonFano(left, code + "0", depth + 1, treeLevels);
    buildShannonFano(right, code + "1", depth + 1, treeLevels);
}

// ---------------------- COMPONENT --------------------------

export default function ShannonFanoTable() {
    const [input, setInput] = useState("пример строки для шеннона фано");
    const [freq, setFreq] = useState(null)

    const total = freq && Object.values(freq).reduce((s, v) => s + v, 0);

    let rows = freq && Object.entries(freq)
        .map(([char, count]) => ({
            char,
            count,
            prob: count / total
        }))
        .sort((a, b) => b.count - a.count || a.char.localeCompare(b.char));

    // Подготовка уровней дерева
    const treeLevels = [];
    if (freq) {
         buildShannonFano(rows, "", 0, treeLevels);
    }

    // Длина кода
    rows = freq && rows?.map(r => ({
        ...r,
        len: r?.code?.length,
        info: -r.prob * Math.log2(r.prob),
        cost: r.prob * r?.code?.length,
    }));

    const entropy = freq && rows?.reduce((s, r) => s + r.info, 0);
    const avgLen = freq && rows?.reduce((s, r) => s + r.cost, 0);
    const totalInfo = entropy * total;

    const maxDepth = freq && Math.max(...rows?.map(r => r?.code?.length));

    const handleCount = () => {
        setFreq(countLetters(input));
    }

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h5" gutterBottom>
                Shannon–Fano Analyzer (Русский текст)
            </Typography>

            <TextField
                fullWidth
                multiline
                minRows={2}
                label="Введите строку"
                value={input}
                onChange={e => setInput(e.target.value)}
                sx={{ mb: 3 }}
            />

            <Button onClick={handleCount}>Рассчитать</Button>
            {freq &&
                <>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Символ</TableCell>
                                    <TableCell>Частота</TableCell>
                                    <TableCell>p</TableCell>

                                    {/* Уровни дерева */}
                                    {[...Array(maxDepth)].map((_, i) => (
                                        <TableCell key={i}>Уровень {i + 1}</TableCell>
                                    ))}

                                    <TableCell>Код</TableCell>
                                    <TableCell>p·len</TableCell>
                                    <TableCell>-p·log₂(p)</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {/* Строки символов */}
                                {rows.map((r, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{r.char === " " ? "ПРОБЕЛ" : r.char}</TableCell>
                                        <TableCell>{r.count}</TableCell>
                                        <TableCell>{r.prob.toFixed(6)}</TableCell>

                                        {/* Визуализация уровней */}
                                        {[...Array(maxDepth)].map((_, level) => (
                                            <TableCell
                                                key={level}
                                                sx={{
                                                    borderLeft: r.code[level] ? "1px solid #aaa" : undefined,
                                                    background:
                                                        r.code[level] !== undefined
                                                            ? r.code[level] === "0"
                                                                ? "#f9f9f9"
                                                                : "#e7f7ff"
                                                            : "transparent",
                                                    textAlign: "center",
                                                    width: 40
                                                }}
                                            >
                                                {r.code[level] ?? ""}
                                            </TableCell>
                                        ))}

                                        <TableCell><strong>{r.code}</strong></TableCell>
                                        <TableCell>{r.cost.toFixed(6)}</TableCell>
                                        <TableCell>{r.info.toFixed(6)}</TableCell>
                                    </TableRow>
                                ))}

                                {/* Узлы дерева (объединённые строки) */}
                                {treeLevels.map((group, level) => (
                                    <TableRow key={`level-${level}`}>
                                        <TableCell
                                            colSpan={3 + maxDepth + 3}
                                            sx={{
                                                background: "#f0f0f0",
                                                fontStyle: "italic",
                                                fontSize: 13
                                            }}
                                        >
                                            Уровень {level + 1}: {group.join(" | ")}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div style={{ marginTop: 20 }}>
                        <Typography variant="subtitle1">Энтропия: {entropy.toFixed(6)} бит</Typography>
                        <Typography variant="subtitle1">Средняя длина кода (стоимость дерева): {avgLen.toFixed(6)} бит</Typography>
                        <Typography variant="subtitle1">Общее количество информации: {totalInfo.toFixed(6)} бит</Typography>
                    </div>
                </>
            }
        </div>
    );
}
